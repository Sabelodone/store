import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // To get user details
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Icons for editing and deleting

const ProfilePage = () => {
  const { currentUser, logout } = useAuth(); // Accessing user data from AuthContext
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '' });
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      setLoading(false);
      fetchOrderHistory();
      fetchWishlist();
      fetchUserDetails();
    }
  }, [currentUser, navigate]);

  const fetchOrderHistory = async () => {
    // Simulate fetching order history data
    const orders = [
      { id: 1, date: '2024-12-20', total: 150, status: 'Shipped', trackingId: 'ABC123' },
      { id: 2, date: '2024-12-15', total: 200, status: 'Delivered', trackingId: 'XYZ456' },
    ];
    setOrderHistory(orders);
  };

  const fetchWishlist = async () => {
    // Simulate fetching wishlist data
    const items = [
      { id: 1, name: 'Wireless Headphones', price: 80 },
      { id: 2, name: 'Smart Watch', price: 120 },
    ];
    setWishlist(items);
  };

  const fetchUserDetails = async () => {
    // Simulate fetching user details (e.g., name, email, phone)
    setUserDetails({ name: currentUser.displayName || 'No name set', email: currentUser.email, phone: '123-456-7890' });
  };

  const handleLogout = async () => {
    try {
      await logout(); // Logging out the user
      navigate('/login'); // Redirect to login page after logout
    } catch (err) {
      console.log('Error logging out: ', err.message);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Save user details after editing
    setEditMode(false);
    // You can add a save logic here (e.g., update user data in a database)
  };

  const handleCancel = () => {
    setEditMode(false);
    fetchUserDetails(); // Reset to original values
  };

  const handleDeleteWishlistItem = (itemId) => {
    setWishlist(wishlist.filter(item => item.id !== itemId)); // Remove item from wishlist
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-800">Profile</h2>

            {/* User Information Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">User Information</h3>
                <button onClick={handleEdit} className="text-blue-600"><FaEdit /> Edit</button>
              </div>
              {editMode ? (
                <div className="mt-4">
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="border border-gray-300 p-2 w-full mb-2"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="border border-gray-300 p-2 w-full mb-2"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    className="border border-gray-300 p-2 w-full"
                    placeholder="Phone"
                  />
                  <div className="flex justify-between mt-4">
                    <button onClick={handleSave} className="py-2 px-4 bg-blue-600 text-white rounded-md">Save</button>
                    <button onClick={handleCancel} className="py-2 px-4 bg-gray-400 text-white rounded-md">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm"><strong>Name:</strong> {userDetails.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {userDetails.email}</p>
                  <p className="text-sm"><strong>Phone:</strong> {userDetails.phone}</p>
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">Order History</h3>
              <ul className="list-none mt-2">
                {orderHistory.map(order => (
                  <li key={order.id} className="p-2 border-b">
                    <p className="text-sm"><strong>Order ID:</strong> {order.id}</p>
                    <p className="text-sm"><strong>Date:</strong> {order.date}</p>
                    <p className="text-sm"><strong>Total:</strong> ${order.total}</p>
                    <p className="text-sm"><strong>Status:</strong> {order.status}</p>
                    <p className="text-sm"><strong>Tracking ID:</strong> {order.trackingId}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Wishlist */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">Wishlist</h3>
              <ul className="list-none mt-2">
                {wishlist.map(item => (
                  <li key={item.id} className="p-2 border-b flex justify-between items-center">
                    <p className="text-sm">{item.name}</p>
                    <button onClick={() => handleDeleteWishlistItem(item.id)} className="text-red-600"><FaTrashAlt /> Remove</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Logout Button */}
            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-md bg-blue-800 text-white hover:bg-blue-700 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
