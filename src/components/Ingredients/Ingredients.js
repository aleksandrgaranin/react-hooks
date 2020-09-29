import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [userIngredient, setUserIngredient] = useState([])

  const addIngredientHandler = ingredient => {
    setUserIngredient(prevIngredients => [
      ...prevIngredients,
      {id: Math.random().toString(), ...ingredient}
    ]);
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
