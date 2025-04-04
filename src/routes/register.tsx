import React, { useState } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/register.css';
import '../assets/styles/global.css';

import { NavLink } from 'react-router-dom';

interface RegisterFormData {
  fullname: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullname: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
              name="fullname"
              placeholder="Full Name*"
              value={formData.fullname}
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