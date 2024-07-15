import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import loginImg from './Pictures_/thumbnail_NEW_LOGO_DESIGN_PNG.png';
import axios from 'axios';
import { hostaddress } from './App';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${hostaddress}/login`, {
        email,
        password
      });

      console.log(response.data); // Log response data to inspect server's response

      if (response.data.message === 'Login successful') {
        // Perform any necessary login actions (e.g., setting user data in context)
        login(); // Assuming login function sets user authentication state
        // Redirect user to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-row">
      <div className="bg-orange hidden sm:flex flex-1 justify-center items-center">
        <div className="h-full w-full flex justify-center items-center">
          <img
            className="max-w-full max-h-full object-contain"
            src= {loginImg}
            alt="Login"
          />
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <form className="bg-slate-100-md rounded px-10 pt-16 pb-8 mb-4 w-96" onSubmit={handleSubmit}>
          <p className="text-left mb-4 text-lg font-bold">Nice to see you again</p>
          <div className="block text-gray-700 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-200 border-0 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Email"
              required
            />
          </div>
          <div className="block text-gray-700 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-200 border-0 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="text-sm text-gray-600 cursor-pointer mt-1"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'} Password
            </button>
          </div>
          <div className="block text-gray-700 flex justify-between items-start mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="sr-only"
              />
              <span className="ms-3 text-sm font-medium text-gray-900">
                Remember Me
              </span>
            </label>
          </div>
          <div className="block">
            <button className="bg-orange-400 text-white block w-full text-sm py-2 px-4 rounded-lg">
              Sign In
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;