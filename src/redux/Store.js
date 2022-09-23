import { configureStore } from "@reduxjs/toolkit";
import { productsSlice } from "./reducers/productsSlice";
import { usersSlice } from "./reducers/usersSlice";
import { appsSlice } from "./reducers/appsSlice";
const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    users: usersSlice.reducer,
    apps: appsSlice.reducer,
  },
});
export default store;
