import { createSlice } from "@reduxjs/toolkit";
import { loadAuthInfo, saveAuthInfo } from "./LocalStorage";

const initialState = loadAuthInfo() || {
  id: "",
  fullName: "",
  email: "",
  isAuthenticated: false,
  authToken: "",
  avtar: "",
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.authToken = action.payload.authToken;
      state.avtar = action.payload.avtar;
      saveAuthInfo(state);
    },

    logout: (state) => {
      state.id = "";
      state.fullName = "";
      state.email = "";
      state.isAuthenticated = false;
      state.authToken = "";
      state.avtar = "";
      saveAuthInfo(state);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
