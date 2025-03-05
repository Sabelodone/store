import React, { createContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  facebookProvider 
} from '../firebase';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setUser(userCredential.user);
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  };

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setUser(userCredential.user);
    } catch (error) {
      throw new Error('Signup failed: ' + error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      setUser(userCredential.user);
    } catch (error) {
      throw new Error('Google login failed: ' + error.message);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const userCredential = await signInWithPopup(auth, facebookProvider);
      setIsAuthenticated(true);
      setUser(userCredential.user);
    } catch (error) {
      throw new Error('Facebook login failed: ' + error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      throw new Error('Logout failed: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, loading, loginWithGoogle, loginWithFacebook }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
