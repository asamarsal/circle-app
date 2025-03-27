import { createBrowserRouter } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import ForgotPassword from "./forgotpassword";
import ResetPassword from "./resetpassword";

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
]);

export default router;