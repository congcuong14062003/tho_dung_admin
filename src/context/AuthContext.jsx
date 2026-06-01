// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const initialState = {
  token: Cookies.get("token") || null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;

      // lưu token
      Cookies.set("token", token);

      state.token = token;

      // dùng data từ API
      state.userInfo = {
        userId: user.id,
        phone: user.phone,
        role: user.role,
        username: user.full_name,
        avatar: user.avatar,
      };
    },

    logout: (state) => {
      Cookies.remove("token");
      state.token = null;
      state.userInfo = null;
    },

    setUser: (state, action) => {
      const user = action.payload;
      state.userInfo = {
        userId: user.id,
        phone: user.phone,
        role: user.role,
        username: user.full_name,
        avatar: user.avatar || user?.avatar_link,
      };
    },
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
