import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Importing components
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Importing pages
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PaymentPage from './pages/PaymentPage';

// Importing contexts
import { CartProvider } from './contexts/CartContext';
import AuthProvider from './contexts/AuthContext';
import UserProfilePage from './pages/UserProfilePage'; // Import the UserProfilePage
// Global styles
import './App.css';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize color
    },
    secondary: {
      main: '#dc004e', // Customize color
    },
  },
  // Additional theme customizations can be added here
});



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
                <Header />
                <main className="flex-grow">
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductListingPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/payment" element={<PaymentPage />} />
                      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                      <Route path="/auth/login" element={<LoginPage />} />
                      <Route path="/auth/signup" element={<SignupPage />} />
                      
                      {/* Profile route */}
                      <Route path="/profile" element={<UserProfilePage />} />
                    </Routes>
                  </ErrorBoundary>
                </main>
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}


export default App;
