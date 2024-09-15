// src/features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const Slice = createSlice({
  name: 'store',
  initialState: { 
    productType: null
},
  reducers: {
    setProductDetails: (state,action) => {
      state.productType =action.payload;
    },
  },
});

export const { setProductDetails } = Slice.actions;
export default Slice.reducer;
