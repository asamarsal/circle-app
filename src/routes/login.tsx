import React, { useState } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/login.css';
import '../assets/styles/global.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { APISemuanya } from '@/lib/api';
import { LoginFormData } from '@/types/user';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await APISemuanya.auth.login({
        identifier: formData.identifier,
        password: formData.password
      });
      
      if (response.data.data.token) {
        
        localStorage.setItem('token', response.data.data.token);
        
        localStorage.setItem('user', JSON.stringify(response.data.data));
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="mt-12 container-black">
      <div className="content-container">
        <img className="icon-heading" src={iconCircle} alt="Circle" />
        <h2 className="text-heading text-3xl font-bold mt-5">Login to Circle</h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="input-field bg-white mt-5"
              type="text"
              name="identifier"
              placeholder="Email/Username*"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              className="input-field bg-white mt-3"
              type="password"
              name="password"
              placeholder="Password*"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end mt-2">
            <NavLink to="/forgotpassword" className="text-white hover:text-gray-300">
              Forgot Password?
            </NavLink>
          </div>
          <button 
            className="bg-[#04A51E] hover:bg-[#008616] text-white w-full py-2 px-4 rounded-full mt-3 cursor-pointer" 
            type="submit"
          >
            Login
          </button>
          <p className="decoration-text mt-3">
            Don't have account yet?
            <NavLink to="/register" className="text-[#04A51E] hover:text-[#008616] ml-1">
              Create Account
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;