import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const usersSlice = createSlice({
  name: "users",
  initialState: {
    userIsLogin: null,
    userUid: null,
  },
  reducers: {
    setUserIsLogin: (state, action) => {
      state.userIsLogin = action.payload;
    },
    setUserUid: (state, action) => {
      state.userUid = action.payload;
    },
  },
});
