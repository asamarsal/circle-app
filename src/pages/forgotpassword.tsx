import React, { useState } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/forgotpassword.css';
import '../assets/styles/global.css';

interface RegisterFormData {
  email: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
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
    <div className="forgotpassword-container">
      <img className="forgotpassword-heading" src={iconCircle} alt="Circle" />
      <h2 className="text-heading">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button className='forgotpassword-button' type="submit">Send Instruction</button>
        <p className='login-text'>Already Have Account?<a className='register-text' style={{ color: '#04A51E', textDecoration: 'none'}} href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Register;