import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./page/auth/AuthPage.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import EmailVerification from "./components/auth/EmailVerification.jsx";
import AccountVerified from "./components/auth/AccountVerified.jsx";
import App from "./App.jsx";
import ProtectedRoute from "./page/auth/ProtectedRoute.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Bounce, ToastContainer } from "react-toastify";
import StatusPage from "./components/status/StatusPage.jsx";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <ProtectedRoute authentication={false}>
        <AuthPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/email-verification/:email",
        element: <EmailVerification />,
      },
      {
        path: "/success-asuwecwoew12@1slks/:email",
        element: <AccountVerified />
      }
    ],
  },
  {
    path: "/c",
    element: (
      <ProtectedRoute authentication={true}>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/status/:userId",
    element: (
      <ProtectedRoute authentication={true}>
        <StatusPage />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Bounce}
    />
  </StrictMode>
);
