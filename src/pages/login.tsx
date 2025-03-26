import React, { useState } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/login.css';
import '../assets/styles/global.css';

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
      <img className="register-heading" src={iconCircle} alt="Circle" />
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
            <a className='forgotpassword-text' href="/forgotpassword">Forgot Password?</a>
        </div>
        <button className='login-button' type="submit">Login</button>
        <p className='register-text'>Don't have account yet? <a className='register-text' style={{ color: '#04A51E', textDecoration: 'none'}} href="/register">Create Account</a></p>
      </form>
    </div>
  );
};

export default Register;