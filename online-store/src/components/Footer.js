import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'react-feather';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-600">LuxeCommerce is your destination for premium watches, jewelry, and accessories.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">All Products</Link></li>
              <li><Link to="/sale" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Sale</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <Facebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <Twitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">&copy; 2023 LuxeCommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

