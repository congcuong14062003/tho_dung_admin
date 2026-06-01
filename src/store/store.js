// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../context/AuthContext";
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
