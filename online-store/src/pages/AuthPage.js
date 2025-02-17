import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext is where login logic resides

const AuthPage = () => {
  const { login } = useAuth(); // Accessing the login method from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error message before trying login

    try {
      await login(email, password); // Call login function from AuthContext
      navigate('/profile'); // Redirect to profile page after successful login
    } catch (err) {
      setError('Login failed: ' + err.message); // Handle login error
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-800">Login</h2>
        
        {/* Error message handling */}
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white focus:outline-none ${loading ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-700'}`}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
