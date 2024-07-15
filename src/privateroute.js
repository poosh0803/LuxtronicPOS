import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { isLoggedIn } = useAuth();

  return (
    <Route
      {...rest}
      element={
        isLoggedIn ? (
          <Element />
        ) : (
          <Navigate to="/login" replace state={{ from: rest.location }} />
        )
      }
    />
  );
};

export default PrivateRoute;