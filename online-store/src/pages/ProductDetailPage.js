import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import Slider from 'react-slick'; // Import Slick carousel
import 'slick-carousel/slick/slick.css'; // Import Slick styles
import 'slick-carousel/slick/slick-theme.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProduct({
        id: parseInt(id),
        name: "Luxury Watch X",
        price: 2500,
        description: "A high-end luxury watch with exquisite craftsmanship. Features include a sapphire crystal face, automatic movement, and water resistance up to 100 meters.",
        images: ["/watch-1.jpg", "/watch-2.jpg", "/watch-3.jpg", "/watch-4.jpg"]
      });
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomPosition({ x, y });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  // Slick Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-lg overflow-hidden shadow-lg">
          {/* Main product images carousel using React Slick */}
          <Slider {...settings} className="mb-6">
            {product.images.map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                  onMouseMove={handleMouseMove}
                />
                {showZoom && (
                  <div
                    className="absolute inset-0 bg-no-repeat transition-all duration-300 ease-in-out"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                      backgroundSize: '250%',
                    }}
                  />
                )}
              </div>
            ))}
          </Slider>
        </div>

        {/* Product details */}
        <div className="flex flex-col justify-between space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="text-xl text-blue-700">${product.price.toFixed(2)}</p>
          <p className="text-lg text-gray-600">{product.description}</p>
          
          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out shadow-lg transform"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
