import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc'; // Google icon
import { FaFacebook } from 'react-icons/fa'; // Facebook icon

const LoginPage = () => {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let valid = true;
    
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      try {
        await login(email, password);
        toast.success('Login successful! Redirecting...');
        navigate('/profile');
      } catch (err) {
        setError('Login failed: ' + err.message);
        toast.error('Login failed: ' + err.message);
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Login with Google successful! Redirecting...');
      navigate('/profile');
    } catch (err) {
      setError('Google login failed: ' + err.message);
      toast.error('Google login failed: ' + err.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      toast.success('Login with Facebook successful! Redirecting...');
      navigate('/profile');
    } catch (err) {
      setError('Facebook login failed: ' + err.message);
      toast.error('Facebook login failed: ' + err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-800">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className={`w-full p-2 border rounded-md ${emailError ? 'border-red-500' : 'border-gray-300'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
          
          <div className="relative">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              className={`w-full p-2 border rounded-md ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {passwordVisible ? (
                <EyeOffIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-600" />
              )}
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
          
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white focus:outline-none ${loading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
          </p>
          <p className="text-sm text-blue-600 mt-2">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleGoogleLogin}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
            title="Login with Google"
          >
            <FcGoogle className="h-6 w-6" />
          </button>
          <button
            onClick={handleFacebookLogin}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
            title="Login with Facebook"
          >
            <FaFacebook className="h-6 w-6 text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;