import React, { useState } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/register.css';
import '../assets/styles/global.css';

import { NavLink, useNavigate } from 'react-router-dom';

import { APISemuanya } from '@/lib/api';
import { RegisterFormData } from '@/types/user';


const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await APISemuanya.auth.register({
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (response.data.code === 200) {

        navigate('/login');
      }
    } catch (error: any) {
      console.error('Register failed:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container-black mt-12">
      <div className="content-container">
        <img className="register-heading" src={iconCircle} alt="Circle" />
        <h2 className="text-heading text-3xl font-bold mt-5">Create Account Circle</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="input-field bg-white mt-5"
              type="text"
              name="full_name"
              placeholder="Full Name*"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="input-field bg-white mt-5"
              type="text"
              name="username"
              placeholder="Username*"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="input-field bg-white mt-3"
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleChange}
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
            />
          </div>
          <button className='bg-[#04A51E] hover:bg-[#008616] text-white w-full py-2 px-4 rounded-full mt-3 cursor-pointer' type="submit">Create</button>
          <p className='decoration-text mt-3'>Already Have Account?<NavLink to="/login" className='decoration-text' style={{ color: '#04A51E', textDecoration: 'none' }}>Login</NavLink></p>
        </form>
      </div>
    </div>
  );
};

export default Register;