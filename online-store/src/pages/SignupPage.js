import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext is where signup logic resides

const SignupPage = () => {
  const { signup } = useAuth(); // Accessing the signup method from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    let valid = true;

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    // Confirm Password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (valid) {
      try {
        await signup(email, password); // Call signup function from AuthContext
        navigate('/profile'); // Redirect to profile page after successful signup
      } catch (err) {
        setError('Signup failed: ' + err.message); // Handle signup error
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-800">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className={`w-full p-2 border rounded-md ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`w-full p-2 border rounded-md ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white focus:outline-none ${loading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-700'}`}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-800">Log In</Link>

          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
