import React, { useState } from 'react';
import iconCircle from '../assets/images/circle.png';
import '../assets/styles/resetpassword.css';
import '../assets/styles/global.css';

interface RegisterFormData {
  newPassword: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    newPassword: '',
    confirmPassword: ''
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
        <img className="icon-heading" src={iconCircle} alt="Circle" />
        <h2 className="text-heading text-3xl font-bold mt-5">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="input-field bg-white mt-5"
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="input-field bg-white mt-3"
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button className='bg-[#04A51E] hover:bg-[#008616] text-white w-full py-2 px-4 rounded-full mt-3 cursor-pointer' type="submit">
            Create New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;