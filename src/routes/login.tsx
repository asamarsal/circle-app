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
    <div className="register-container">
      <div className="content-container">
        <img className="icon-heading" src={iconCircle} alt="Circle" />
        <h2 className="text-heading">Login to Circle</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="input-field"
              type="email"
              name="email"
              placeholder="Email/Username*"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="input-field"
              type="password"
              name="password"
              placeholder="Password*"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom : '10px'}}>
              <NavLink to="/forgotpassword" className='forgotpassword-text' style={{ textDecoration: 'none' }}>Forgot Password?</NavLink>
          </div>
          <button className='decoration-button' type="submit">Login</button>
          <p className='decoration-text'>Don't have account yet?<NavLink to="/register" className='decoration-text' style={{ color: '#04A51E', textDecoration: 'none' }}>Create Account</NavLink></p>
        </form>
      </div>
    </div>
  );
};

export default Register;