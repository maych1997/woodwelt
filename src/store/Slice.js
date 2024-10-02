// src/features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const Slice = createSlice({
  name: 'store',
  initialState: { 
    productType: null,
    productAttributes:null,
    attributeNode:null,
    categoryVisibility:null
},
  reducers: {
    setProductDetails: (state,action) => {
      state.productType =action.payload;
    },
    setProductAttributes: (state,action) => {
      state.productAttributes =action.payload;
    },
    setAttributeNode: (state,action) => {
      state.attributeNode =action.payload;
    },
    setCategoryVisibility: (state,action) => {
      state.categoryVisibility =action.payload;
    },
  },
});

export const { setProductDetails,setProductAttributes,setAttributeNode,setCategoryVisibility } = Slice.actions;
export default Slice.reducer;
