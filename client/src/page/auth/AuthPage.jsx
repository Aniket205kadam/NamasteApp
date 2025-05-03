import React from "react";
import { Outlet } from "react-router-dom";
import "./AuthPage.css";
import Logo from "../../assets/NamasteApp.png";

function AuthPage() {
  return (
    <div className="auth-container">
      <header className="app-header">
        <img src={Logo} alt="NamasteApp" className="heading-logo" />
        <h1 className="app-title">NamasteApp</h1>
      </header>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
