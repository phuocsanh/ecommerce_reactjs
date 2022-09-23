import { createSlice } from "@reduxjs/toolkit";
export const productsSlice = createSlice({
  name: "products",
  initialState: {
    listProduct: [{ name: "iphone" }, { name: "iphone4" }],
  },
  reducers: {
    setListProduct: (state, action) => {
      state.listProduct.push(action.payload);
    },
  },
});
