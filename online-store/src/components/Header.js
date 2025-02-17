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
  };

  const cartItemCount = getTotalQuantity();

  // Close dropdowns when clicking outside
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

          {/* Desktop Navigation */}
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
                <div className="absolute left-0 mt-2 w-screen max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-4 gap-x-4 gap-y-8 p-8 bg-white shadow-lg rounded-xl">
                    {['Watches', 'Jewelry', 'Bags', 'Accessories'].map((category) => (
                      <div key={category} className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                          <button
                            onClick={() => handleCategoryClick(category)}
                            className="flex items-center space-x-2"
                            aria-expanded={activeCategory === category}
                          >
                            <span>{category}</span>
                            <ChevronDown className={classNames('transition-transform', {
                              'rotate-180': activeCategory === category,
                            })} />
                          </button>
                        </h3>
                        {activeCategory === category && (
                          <ul className="space-y-2">
                            {['New Arrivals', 'Bestsellers', 'Sale'].map((subcategory) => (
                              <li key={subcategory}>
                                <Link
                                  to={`/products?category=${category.toLowerCase()}&subcategory=${subcategory.toLowerCase()}`}
                                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                >
                                  {subcategory}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">All Products</Link>
            <Link to="/sale" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Sale</Link>
          </nav>

          {/* Desktop User and Cart Menu */}
          <div className="flex items-center space-x-8">
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="ml-2">Cart</span>
            </Link>

            {/* User Link or Dropdown */}
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
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu with 3D Effect */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
            <div className="bg-white w-64 transform transition-all duration-500 ease-in-out shadow-xl rounded-l-lg p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-700 hover:text-blue-600"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">All Products</Link>
                <Link to="/sale" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Sale</Link>
                <button
                  onClick={toggleCategories}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300"
                >
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isCategoriesOpen && (
                  <div className="ml-4">
                    {['Watches', 'Jewelry', 'Bags', 'Accessories'].map((category) => (
                      <div key={category} className="space-y-2">
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="flex items-center space-x-2"
                        >
                          <span>{category}</span>
                          <ChevronDown className={classNames('transition-transform', {
                            'rotate-180': activeCategory === category,
                          })} />
                        </button>
                        {activeCategory === category && (
                          <ul className="ml-4 space-y-2">
                            {['New Arrivals', 'Bestsellers', 'Sale'].map((subcategory) => (
                              <li key={subcategory}>
                                <Link
                                  to={`/products?category=${category.toLowerCase()}&subcategory=${subcategory.toLowerCase()}`}
                                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                >
                                  {subcategory}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Cart Link */}
                <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="ml-2">Cart</span>
                </Link>

                {/* User Login/Logout */}
                {user ? (
                  <button
                    onClick={() => logout()}
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
