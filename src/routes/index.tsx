import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import ForgotPassword from "./forgotpassword";
import ResetPassword from "./resetpassword";
import Dashboard from "./dashboard";
import Profile from "./profile"
import Search from "./search"
import Followboard from "./followboard"
import { ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgotpassword",
    Component: ForgotPassword,
  },
  {
    path: "/resetpassword",
    Component: ResetPassword,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
          <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
         <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/search",
    Component: Search,
  },
  {
    path: "/followboard",
    Component: Followboard,
  },
]);

export default router;