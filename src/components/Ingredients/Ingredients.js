import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [userIngredient, setUserIngredient] = useState([])

  useEffect(()=>{
    fetch('https://react-hooks-cb0d7.firebaseio.com/ingredients.json')
    .then(response => {
      return response.json();
    })
    .then(responseData => {
      const loadedIngredients = [];
      for(const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        });
      }
      setUserIngredient(loadedIngredients);
    });
  },[])

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-cb0d7.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          return response.json()
        })
        .then(responseData => {
          setUserIngredient(prevIngredients => [
            ...prevIngredients,
            {id: responseData.name, ...ingredient}
          ])
        });    
  };

  const removeIngredientHandler = ingredientId => {
    setUserIngredient(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={userIngredient} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
