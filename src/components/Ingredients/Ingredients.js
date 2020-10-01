import React, { useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import useHttp from '../../hooks/http';

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



const Ingredients = () => {  
  const [ userIngredient, dispatch ] = useReducer(ingredientReducer, []);
  const { isLoading, data, error, sendRequest } = useHttp();
  
  const filterUserIngredintsHandler = useCallback(filteredIngredients => {    
    dispatch({type: 'SET', ingredients: filteredIngredients});
  },[])

  const addIngredientHandler = useCallback(ingredient => {
    // dispatchHttp({type: 'SEND'});
    // fetch('https://react-hooks-cb0d7.firebaseio.com/ingredients.json',{
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    //   })
    //     .then(response => {
    //       dispatchHttp({type: 'RESPONSE'});
    //       return response.json()
    //     })
    //     .then(responseData => {          
    //       dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient} });
    //     }).catch(err => {
    //       dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'});
    //     });    
  },[]);

  const removeIngredientHandler = useCallback(ingredientId => {
    // dispatchHttp({type: 'SEND'});
    sendRequest(
      `https://react-hooks-cb0d7.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE'
    )
  
  },[sendRequest]);

  const clearError = useCallback(() => {
    // dispatchHttp({type: 'CLEAR'})
  },[])

  const ingredientList = useMemo(()=> {
    return (
      <IngredientList 
        ingredients={userIngredient} 
        onRemoveItem={removeIngredientHandler}/>
    )
  }, [userIngredient, removeIngredientHandler])

  return (
    <div className="App"> 
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}     
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>
      <section>
        <Search onLoadIngredients={filterUserIngredintsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
