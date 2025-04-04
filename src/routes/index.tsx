import { createBrowserRouter } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import ForgotPassword from "./forgotpassword";
import ResetPassword from "./resetpassword";
import Dashboard from "./dashboard";
import Profile from "./profile"
import Search from "./search"
import Followboard from "./followboard"

const router = createBrowserRouter([
  {
    path: "/",
    Component: Login, // Halaman default ke Login
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
    Component: Dashboard,
  },
  {
    path: "/profile",
    Component: Profile,
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