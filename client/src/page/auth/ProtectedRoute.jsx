import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, authentication }) {
  const { isAuthentication } = useSelector((state) => state.authentication);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthentication);


  // Redirect to login if authentication is required but user is not authenticated
  if (authentication && !isUserAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if user is authenticated but tries to access login/register pages
  if (!authentication && isUserAuthenticated) {
    return <Navigate to="/c" replace />;
  }

  return children;
}

export default ProtectedRoute;
