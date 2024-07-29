// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import thunk from 'redux-thunk';
import formReducer from './reducer';

const store = configureStore(
    {
        reducer:{
        form: formReducer
    }
}
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;