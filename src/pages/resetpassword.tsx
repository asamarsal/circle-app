import React, { useState } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/resetpassword.css';
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
    <div className="resetpassword-container">
      <img className="resetpassword-heading" src={iconCircle} alt="Circle" />
      <h2 className="text-heading">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="New Password"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Confirm New Password"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button className='resetpassword-button' type="submit">Create New Password</button>
      </form>
    </div>
  );
};

export default Register;