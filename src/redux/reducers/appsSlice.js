import { createSlice } from "@reduxjs/toolkit";
export const appsSlice = createSlice({
  name: "apps",
  initialState: {
    loading: false,
    isModal: { signIn: false, signUp: false },
    open: false,
    numProductsCart: 0,
    openPayPalModal: false,
    totalPrice: 0,
    cartProducts: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setIsModal: (state, action) => {
      state.isModal = action.payload;
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setNumProductsCart: (state, action) => {
      state.numProductsCart = action.payload;
    },
    setOpenPaypalModal: (state, action) => {
      state.openPayPalModal = action.payload;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setCartProducts: (state, action) => {
      state.cartProducts = action.payload;
    },
  },
});
