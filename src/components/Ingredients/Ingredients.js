import React, { useState, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD': 
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
}

function Ingredients() {
  const [userIngredient, dispatch] = useReducer(ingredientReducer, [])
  // const [userIngredient, setUserIngredient] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  
  const filterUserIngredintsHandler = useCallback(filteredIngredients => {
    // setUserIngredient(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients});
  },[])

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-cb0d7.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          setIsLoading(false)
          return response.json()
        })
        .then(responseData => {
          // setUserIngredient(prevIngredients => [
          //   ...prevIngredients,
          //   {id: responseData.name, ...ingredient}
          // ])
          dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient} });
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
      // setUserIngredient(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId))
      dispatch({type: 'DELETE', id: ingredientId})
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
