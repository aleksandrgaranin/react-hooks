import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [userIngredient, setUserIngredient] = useState([])

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
