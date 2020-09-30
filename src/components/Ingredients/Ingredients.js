import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

function Ingredients() {
  const [userIngredient, setUserIngredient] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  
  const filterUserIngredintsHandler = useCallback(filteredIngredients => {
    setUserIngredient(filteredIngredients);
  },[])

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-cb0d7.firebaseio.com/ingredients.jsn',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          setIsLoading(false)
          return response.json()
        })
        .then(responseData => {
          setUserIngredient(prevIngredients => [
            ...prevIngredients,
            {id: responseData.name, ...ingredient}
          ])
        }).catch(err => {
          setError('Something went wrong!');
        });    
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-cb0d7.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'      
      }
    ).then(response => {
      setIsLoading(false)
      setUserIngredient(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId))
    }).catch(err => {
      setError('Something went wrong!');
    })
  }

  const clearError = () => {
    setError(null);
    setIsLoading(false)
  }

  return (
    <div className="App"> 
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}     
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>
      <section>
        <Search onLoadIngredients={filterUserIngredintsHandler}/>
        <IngredientList ingredients={userIngredient} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
