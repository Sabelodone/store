import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart, Heart } from 'react-feather';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/currencyFormat'; // Import the currency format function

const ProductCard = ({ product, viewMode, onQuickView }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView(product);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Here you would typically call an API to update the wishlist status
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button
            onClick={handleQuickView}
            className="bg-white text-blue-600 p-2 rounded-full mr-2 hover:bg-blue-100 transition duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye size={20} />
          </motion.button>
          <motion.button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-2 rounded-full mr-2 hover:bg-blue-700 transition duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingCart size={20} />
          </motion.button>
          <motion.button
            onClick={toggleWishlist}
            className={`bg-white p-2 rounded-full transition duration-300 ${
              isWishlisted ? 'text-red-500 hover:bg-red-100' : 'text-gray-400 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </div>
      <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <p className="text-blue-600 font-bold">{formatCurrency(product.price)}</p> {/* Use formatCurrency function */}
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-gray-600 text-sm ml-1">({product.reviewCount || 0})</span>
          </div>
        </div>
        {viewMode === 'list' && (
          <div className="mt-4">
            <p className="text-gray-600 mb-4">
              {product.description ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
            </p>
            <motion.button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
