"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const UserProfilePage = () => {
  const auth = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    shippingAddress: "",
  })

  const [orders, setOrders] = useState([
    { id: "1", date: "2023-05-01", total: 99.99, status: "Delivered", items: 3 },
    { id: "2", date: "2023-05-15", total: 149.99, status: "Processing", items: 5 },
  ])

  const [contextMenu, setContextMenu] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (auth && auth.user) {
      setFormData((prevData) => ({
        ...prevData,
        name: auth.user.name || "",
        email: auth.user.email || "",
        shippingAddress: auth.user.shippingAddress || "",
      }))
    }
  }, [auth])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      if (auth && auth.updateUser) {
        await auth.updateUser(formData)
        setSuccess("Profile updated successfully")
      } else {
        setError("Unable to update profile. Please try again later.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContextMenu = (e, orderId) => {
    e.preventDefault()
    setContextMenu({ orderId, x: e.pageX, y: e.pageY })
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  if (!auth || !auth.user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-300 transition-colors"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="flex items-center space-x-6">
          <img
            src={auth.user.profilePicture || "/default-profile.jpg"} // Display user's profile picture or default image
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
          <div>
            <h2 className="text-xl font-semibold text-purple-600">{formData.name}</h2>
            <p>{formData.email}</p>
            <p>{formData.shippingAddress}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-6">
            <label htmlFor="name" className="block font-semibold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="shippingAddress" className="block font-semibold mb-2">Shipping Address</label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-semibold mb-2">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block font-semibold mb-2">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isLoading ? <AiOutlineLoading3Quarters className="animate-spin inline-block mr-2" /> : null}
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {/* Order History */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Order History</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer relative transition-all"
                onContextMenu={(e) => handleContextMenu(e, order.id)}
                onClick={handleCloseContextMenu}
              >
                <p className="font-bold text-gray-800">Order #{order.id}</p>
                <p className="text-gray-600">Date: {order.date}</p>
                <p className="text-gray-600">Total: R{(order.total * 19).toFixed(2)}</p> {/* Conversion to ZAR */}
                <p className="text-gray-600">Status: {order.status}</p>

                {contextMenu && contextMenu.orderId === order.id && (
                  <div
                    className="absolute bg-white border border-gray-200 shadow-lg rounded-lg w-48 p-2 mt-2"
                    style={{
                      left: contextMenu.x,
                      top: contextMenu.y,
                      zIndex: 9999,
                    }}
                  >
                    <p className="p-2 hover:bg-gray-100 rounded-lg">View Order Details</p>
                    <p className="p-2 hover:bg-gray-100 rounded-lg">Track Shipment</p>
                    <p className="p-2 hover:bg-gray-100 rounded-lg">Request Return</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
