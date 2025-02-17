import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Truck, Shield } from 'react-feather';

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Discover Timeless Elegance</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Indulge in our curated collection of premium watches, jewelry, and accessories.</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/products"
                className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors duration-300 inline-flex items-center"
              >
                Explore Collection <ChevronRight className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        >
          <img src="/Screenshot 2025-01-07 095834.png" alt="" className="w-full h-full object-cover opacity-20" />
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Elegant Timepieces', image: '/tadeusz-lakota-Tb38UzCvKCY-unsplash.jpg' },
              { title: 'Sparkling Jewelry', image: '/ruan-richard-rodrigues-JhtiV2zsHHY-unsplash.jpg' },
              { title: 'Luxurious Accessories', image: '/robert-torres-Nhf1TU65y4k-unsplash.jpg' }
            ].map((collection, index) => (
              <motion.div
                key={collection.title}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <img src={collection.image} alt={collection.title} className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold mb-2">{collection.title}</h3>
                  <p className="text-sm text-blue-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Discover our exquisite selection</p>
                  <Link
                    to="/products"
                    className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors duration-300 inline-flex items-center"
                  >
                    Shop now <ChevronRight className="ml-2" />
                  </Link>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Why Choose LuxeCommerce</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Authentic Products', description: 'Every item is guaranteed authentic and comes with a certificate of authenticity.', icon: Shield },
              { title: 'Free Shipping', description: 'Enjoy free shipping on all orders over R500. Fast and secure delivery worldwide.', icon: Truck },
              { title: 'Expert Support', description: '24/7 customer support from our team of luxury product experts.', icon: Star },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-50 p-8 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Join Our VIP List</h2>
          <p className="text-xl mb-8 text-blue-100">Be the first to know about new collections, exclusive offers, and luxury insights.</p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            />
            <motion.button
              type="submit"
              className="bg-white text-blue-900 px-6 py-3 rounded-r-full font-semibold hover:bg-blue-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

