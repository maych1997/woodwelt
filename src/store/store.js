// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import storeReducer from './Slice';

const store = configureStore({
  reducer: {
    store: storeReducer,
  },
});

export default store;
