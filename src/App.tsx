import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css'
import Register from './pages/register.tsx';
import Login from './pages/login.tsx';
import ForgotPassword from './pages/forgotpassword.tsx';
import ResetPassword from './pages/resetpassword.tsx';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App