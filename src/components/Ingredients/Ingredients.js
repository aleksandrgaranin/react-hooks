import React, { useCallback, useReducer, useMemo } from 'react';

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

const httpReducer = (curHttpState, action) => {
  switch(action.type){
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading:false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error('Should not be reached!');
  }
}

function Ingredients() {  
  const [userIngredient, dispatch] = useReducer(ingredientReducer, [])  
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  
  const filterUserIngredintsHandler = useCallback(filteredIngredients => {    
    dispatch({type: 'SET', ingredients: filteredIngredients});
  },[])

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-cb0d7.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          dispatchHttp({type: 'RESPONSE'});
          return response.json()
        })
        .then(responseData => {          
          dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient} });
        }).catch(err => {
          dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'});
        });    
  },[]);

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({type: 'SEND'});
    fetch(
      `https://react-hooks-cb0d7.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'      
      }
    ).then(response => {      
      dispatch({type: 'DELETE', id: ingredientId});
      dispatchHttp({type: 'RESPONSE'});
    }).catch(err => {
      dispatchHttp({type: 'ERROR', errorData: 'Something went wrong!'})
    })
  },[]);

  const clearError = useCallback(() => {
    dispatchHttp({type: 'CLEAR'})
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
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}     
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>
      <section>
        <Search onLoadIngredients={filterUserIngredintsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
