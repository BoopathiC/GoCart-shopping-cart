// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../Feature/ProductSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

export default store;
