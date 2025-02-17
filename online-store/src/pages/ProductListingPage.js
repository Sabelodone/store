import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from '@mui/material/Slider';
import {  X, Filter, Grid, List } from 'react-feather';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 5000],
  });
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts([
        { id: 1, name: "Luxury Watch A", price: 1000, image: "/rick-muigo-SX9IouL_qOg-unsplash (1).jpg", category: "Watches", description: "A luxurious watch with exquisite details." },
        { id: 2, name: "Designer Bag B", price: 1500, image: "/content-pixie-ZB4eQcNqVUs-unsplash.jpg", category: "Bags", description: "A stylish designer bag perfect for everyday use." },
        { id: 3, name: "Premium Sunglasses C", price: 300, image: "/tamara-bellis-LJqRUWr9V0w-unsplash.jpg", category: "Accessories", description: "Premium sunglasses that offer superior UV protection." },
        { id: 4, name: "Elegant Necklace D", price: 800, image: "/ruan-richard-rodrigues-JhtiV2zsHHY-unsplash.jpg", category: "Jewelry", description: "An elegant necklace crafted with high-quality materials." },
        { id: 5, name: "Leather Wallet E", price: 200, image: "/georgi-dyulgerov-RFCw8jlT1oQ-unsplash.jpg", category: "Accessories", description: "A durable leather wallet designed for practicality and style." },
        { id: 6, name: "Silk Scarf F", price: 150, image: "/yulia-mishkantsova-NApMKSRW-oE-unsplash.jpg", category: "Accessories", description: "A soft and luxurious silk scarf that adds a touch of elegance to any outfit." },
      ]);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product => 
      (filters.category === '' || product.category === filters.category) &&
      (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1])
    )
    .sort((a, b) => {
      if (sort === 'priceLowToHigh') return a.price - b.price;
      if (sort === 'priceHighToLow') return b.price - a.price;
      return 0;
    });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleAddToCartFromQuickView = () => {
    if (quickViewProduct) {
      addToCart(quickViewProduct);
      setQuickViewProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="bg-blue-900 text-white py-16 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Our Collection</h1>
          <p className="text-xl mb-8">Explore our curated selection of luxury items</p>
          <div className="flex space-x-4">
            <button className="bg-white text-blue-900 px-6 py-2 rounded-full hover:bg-blue-100 transition duration-300">
              New Arrivals
            </button>
            <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-blue-900 transition duration-300">
              Best Sellers
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            className="w-full md:w-1/4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  className="md:hidden text-blue-600 hover:text-blue-800"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? <X /> : <Filter />}
                </button>
              </div>
              <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Category</h3>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Watches">Watches</option>
                    <option value="Bags">Bags</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Jewelry">Jewelry</option>
                  </select>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <Slider
                    value={filters.priceRange}
                    onChange={(_, newValue) => handleFilterChange('priceRange', newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5000}
                    sx={{
                      color: '#3B82F6',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#3B82F6',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#E5E7EB',
                      },
                    }}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>R{filters.priceRange[0].toFixed(2)}</span>
                    <span>R{filters.priceRange[1].toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="w-full md:w-3/4">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-600">{filteredProducts.length} products found</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List size={20} />
                    </button>
                  </div>
                  <select
                    value={sort}
                    onChange={handleSortChange}
                    className="p-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </motion.div>

            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} onQuickView={() => handleQuickView(product)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length > 6 && (
              <div className="mt-12 text-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {quickViewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
              <button onClick={() => setQuickViewProduct(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full md:w-1/2 rounded-lg" />
              <div>
                <p className="text-2xl font-bold mb-4">R{quickViewProduct.price.toFixed(2)}</p>
                <p className="text-gray-600 mb-4">{quickViewProduct.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}</p>
                <button
                  onClick={handleAddToCartFromQuickView}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;

