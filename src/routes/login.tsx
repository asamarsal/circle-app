import React, { useState } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/login.css';
import '../assets/styles/global.css';
import { NavLink } from 'react-router-dom';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
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
    <div className=" mt-12 container-black">
      <div className="content-container">
        <img className="icon-heading" src={iconCircle} alt="Circle" />
        <h2 className="text-heading text-3xl font-bold mt-5">Login to Circle</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="input-field bg-white mt-5"
              type="email"
              name="email"
              id="email"
              placeholder="Email/Username*"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="input-field bg-white mt-3"
              type="password"
              name="password"
              id="password"
              placeholder="Password*"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
              <NavLink to="/forgotpassword" className='text-white mt-2' style={{ textDecoration: 'none' }}>Forgot Password?</NavLink>
          </div>
          <button className='bg-[#04A51E] hover:bg-[#008616] text-white w-full py-2 px-4 rounded-full mt-3 cursor-pointer' type="submit">Login</button>
          <p className='decoration-text mt-3'>Don't have account yet?<NavLink to="/register" className='decoration-text' style={{ color: '#04A51E', textDecoration: 'none' }}>Create Account</NavLink></p>
        </form>
      </div>
    </div>
  );
};

export default Register;