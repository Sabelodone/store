import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Menu, X, ShoppingCart, User, ChevronDown } from 'react-feather';
import classNames from 'classnames';

const Header = () => {
  const { user, logout } = useAuth();
  const { getTotalQuantity } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setIsCategoriesOpen(false); // Close categories dropdown after selection
  };

  const cartItemCount = getTotalQuantity();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-800">LuxeCommerce</Link>

          <nav className="hidden md:flex space-x-8">
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={toggleCategories}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300"
                aria-expanded={isCategoriesOpen}
                aria-haspopup="true"
              >
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isCategoriesOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-xl">
                  <ul>
                    {['Watches', 'Jewelry', 'Bags', 'Accessories'].map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">All Products</Link>
            <Link to="/sale" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Sale</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="h-6 w-6" />
                  <span className="ml-2">{user.name}</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)} // Close user menu after clicking
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false); // Close user menu after logout
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Login</Link>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white shadow-lg rounded-lg p-4">
            <nav className="space-y-4">
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu after clicking
                className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                All Products
              </Link>
              <Link
                to="/sale"
                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu after clicking
                className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Sale
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu after clicking
                className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Cart ({cartItemCount})
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu after clicking
                    className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false); // Close mobile menu after logout
                    }}
                    className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu after clicking
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;