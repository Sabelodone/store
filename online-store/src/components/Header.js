import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Menu, X, ShoppingCart, User, ChevronDown } from "react-feather";
import { motion } from "framer-motion";

const Header = () => {
  const { user, logout } = useAuth();
  const { getTotalQuantity } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-800">
          LuxeCommerce
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {user && (
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={toggleCategories}
                className="flex items-center text-gray-700 hover:text-blue-600 transition"
              >
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isCategoriesOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-xl">
                  <ul>
                    {["Watches", "Jewelry", "Bags", "Accessories"].map((category) => (
                      <li key={category}>
                        <button
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
          )}
          <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">
            All Products
          </Link>
          <Link to="/sale" className="text-gray-700 hover:text-blue-600 transition">
            Sale
          </Link>
        </nav>

        {/* Right-Side Icons */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  <User className="h-6 w-6" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl">
                    <ul>
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 transition">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMobileMenu} className="md:hidden text-gray-700">
          <Menu className="h-8 w-8" />
        </button>

        {/* Mobile Menu Drawer */}
        <motion.div
          initial={{ x: "100%", rotateY: 15 }}
          animate={{ x: isMobileMenuOpen ? 0 : "100%", rotateY: isMobileMenuOpen ? 0 : 15 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 p-6 transform origin-right"
        >
          <button onClick={toggleMobileMenu} className="absolute top-4 left-4 text-gray-700">
            <X className="h-6 w-6" />
          </button>

          <nav className="mt-8 space-y-6">
            <Link to="/" onClick={toggleMobileMenu} className="block text-gray-700">
              Home
            </Link>
            <Link to="/products" onClick={toggleMobileMenu} className="block text-gray-700">
              Products
            </Link>
            <Link to="/sale" onClick={toggleMobileMenu} className="block text-gray-700">
              Sale
            </Link>
            {user && (
              <Link to="/cart" onClick={toggleMobileMenu} className="block text-gray-700 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({cartItemCount})
              </Link>
            )}
            {user ? (
              <>
                <Link to="/profile" onClick={toggleMobileMenu} className="block text-gray-700">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="block text-left text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth/login" onClick={toggleMobileMenu} className="block text-gray-700">
                Login
              </Link>
            )}
          </nav>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;