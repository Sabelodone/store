"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import {
  FaEdit,
  FaCheck,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMoon,
  FaSun,
  FaShoppingBag,
  FaHistory,
  FaChevronRight,
  FaChevronDown,
  FaBell,
  FaCreditCard,
  FaSignOutAlt,
  FaUserCog,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

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

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your order #2 has been shipped!", date: "2 hours ago", read: false },
    {
      id: 2,
      message: "Welcome to our platform! Complete your profile to get started.",
      date: "2 days ago",
      read: true,
    },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    if (auth && auth.user) {
      setFormData((prevData) => ({
        ...prevData,
        name: auth.user.name || "",
        email: auth.user.email || "",
        shippingAddress: auth.user.shippingAddress || "",
      }))
    }

    // Check if user prefers dark mode
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode") === "true"
      setIsDarkMode(savedMode)
      if (savedMode) document.documentElement.classList.add("dark")
    }

    // Close notifications when clicking outside
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [auth])

  useEffect(() => {
    // Password strength checker
    if (formData.password) {
      let strength = 0
      // Length check
      if (formData.password.length >= 8) strength += 1
      // Contains number
      if (/\d/.test(formData.password)) strength += 1
      // Contains special char
      if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength += 1
      // Contains uppercase
      if (/[A-Z]/.test(formData.password)) strength += 1
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(0)
    }
  }, [formData.password])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", String(newMode))
      if (newMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

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
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))
        await auth.updateUser(formData)
        setSuccess("Profile updated successfully")
        setIsEditing(false)

        // Clear password fields after successful update
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }))
      } else {
        setError("Unable to update profile. Please try again later.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  if (!auth || !auth.user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2.5"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
        </div>
      </div>
    )
  }

  const renderPasswordStrengthMeter = () => {
    const getStrengthText = () => {
      if (passwordStrength === 0) return "Very Weak"
      if (passwordStrength === 1) return "Weak"
      if (passwordStrength === 2) return "Medium"
      if (passwordStrength === 3) return "Strong"
      return "Very Strong"
    }

    const getStrengthColor = () => {
      if (passwordStrength === 0) return "bg-red-500"
      if (passwordStrength === 1) return "bg-orange-500"
      if (passwordStrength === 2) return "bg-yellow-500"
      if (passwordStrength === 3) return "bg-green-500"
      return "bg-green-600"
    }

    return (
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength: {getStrengthText()}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(passwordStrength / 4) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }

  const tabVariants = {
    active: {
      borderColor: "#9333ea",
      color: isDarkMode ? "#e9d5ff" : "#9333ea",
      backgroundColor: isDarkMode ? "rgba(147, 51, 234, 0.1)" : "rgba(147, 51, 234, 0.05)",
    },
    inactive: {
      borderColor: "transparent",
      color: isDarkMode ? "#9ca3af" : "#6b7280",
      backgroundColor: "transparent",
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Profile
          </motion.h1>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm relative"
                aria-label="Notifications"
              >
                <FaBell className="text-gray-600 dark:text-gray-400" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${!notification.read ? "bg-purple-50 dark:bg-purple-900/10" : ""}`}
                          >
                            <div className="flex items-start">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 mr-2 ${!notification.read ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"}`}
                              ></div>
                              <div className="flex-1">
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.date}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={toggleDarkMode}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-indigo-600" />}
            </motion.button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex overflow-x-auto pb-2 space-x-4">
            {[
              { id: "profile", label: "Profile", icon: FaUser },
              { id: "orders", label: "Orders", icon: FaShoppingBag },
              { id: "settings", label: "Settings", icon: FaUserCog },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg border-2 flex items-center space-x-2 whitespace-nowrap transition-all duration-200`}
                variants={tabVariants}
                initial="inactive"
                animate={activeTab === tab.id ? "active" : "inactive"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Profile Section */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <img
                        src={auth.user.profilePicture || "/IMG_6067.JPG"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-700"
                      />
                      <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full shadow-md">
                        <FaUser size={14} />
                      </div>
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formData.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                      <FaEnvelope className="mr-2" size={14} />
                      {formData.email}
                    </p>
                    {formData.shippingAddress && (
                      <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                        <FaMapMarkerAlt className="mr-2" size={14} />
                        {formData.shippingAddress}
                      </p>
                    )}
                  </div>

                  <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isEditing ? <FaCheck className="mr-2" /> : <FaEdit className="mr-2" />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </motion.button>
                </div>
              </motion.div>

              {/* Profile Form or Account Summary */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form
                      onSubmit={handleSubmit}
                      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md transition-all duration-200"
                      key="edit-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                        Edit Your Information
                      </h2>

                      <div className="mb-6">
                        <label htmlFor="name" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="email" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="shippingAddress"
                          className="block font-medium mb-2 text-gray-700 dark:text-gray-300"
                        >
                          Shipping Address
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 pointer-events-none">
                            <FaMapMarkerAlt className="text-gray-400" />
                          </div>
                          <textarea
                            id="shippingAddress"
                            name="shippingAddress"
                            value={formData.shippingAddress}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="password" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <FaEyeSlash className="text-gray-400" />
                            ) : (
                              <FaEye className="text-gray-400" />
                            )}
                          </button>
                        </div>
                        {formData.password && renderPasswordStrengthMeter()}
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="confirmPassword"
                          className="block font-medium mb-2 text-gray-700 dark:text-gray-300"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-200"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <FaEyeSlash className="text-gray-400" />
                            ) : (
                              <FaEye className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 flex items-start"
                          >
                            <FaExclamationTriangle className="mr-3 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                          </motion.div>
                        )}

                        {success && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 flex items-start"
                          >
                            <FaCheck className="mr-3 mt-0.5 flex-shrink-0" />
                            <span>{success}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          "Update Profile"
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md transition-all duration-200"
                      key="account-summary"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-200">
                        <FaUserCog className="mr-2 text-purple-600 dark:text-purple-400" />
                        Account Summary
                      </h2>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Total Orders</h3>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{orders.length}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              Last order on {orders[0]?.date || "N/A"}
                            </p>
                          </motion.div>
                          <motion.div
                            className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Total Spent</h3>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                              R{orders.reduce((sum, order) => sum + order.total * 19, 0).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              Average R
                              {(orders.reduce((sum, order) => sum + order.total * 19, 0) / orders.length).toFixed(2)}{" "}
                              per order
                            </p>
                          </motion.div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">Account Activity</h3>

                          <motion.div
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-center">
                              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                                <FaHistory className="text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">Last Login</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Today at 9:30 AM</p>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-center">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                                <FaCreditCard className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">Payment Method</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Visa ending in 4242</p>
                              </div>
                            </div>
                            <button className="text-purple-600 dark:text-purple-400 text-sm hover:underline">
                              Update
                            </button>
                          </motion.div>

                          <motion.div
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-center">
                              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                                <FaDownload className="text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">Download Data</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Export your account data</p>
                              </div>
                            </div>
                            <button className="text-purple-600 dark:text-purple-400 text-sm hover:underline">
                              Export
                            </button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md transition-all duration-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-200">
                  <FaShoppingBag className="mr-2 text-purple-600 dark:text-purple-400" />
                  Order History
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -2 }}
                      >
                        <div
                          className="p-4 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center mb-2 md:mb-0">
                              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-4">
                                <FaShoppingBag className="text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end space-x-4">
                              <div className="text-right">
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  R{(order.total * 19).toFixed(2)}
                                </p>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-gray-400">
                                {expandedOrder === order.id ? <FaChevronDown /> : <FaChevronRight />}
                              </div>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedOrder === order.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750"
                            >
                              <div className="p-4">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Order Details</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Items</span>
                                    <span className="text-gray-800 dark:text-gray-200">{order.items}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-800 dark:text-gray-200">
                                      R{(order.total * 19 * 0.85).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                    <span className="text-gray-800 dark:text-gray-200">
                                      R{(order.total * 19 * 0.15).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between font-medium">
                                    <span className="text-gray-800 dark:text-gray-200">Total</span>
                                    <span className="text-purple-600 dark:text-purple-400">
                                      R{(order.total * 19).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                    View Full Details
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md transition-all duration-200">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-200">
                  <FaUserCog className="mr-2 text-purple-600 dark:text-purple-400" />
                  Account Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Email Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive emails about your account activity
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isDarkMode}
                          onChange={toggleDarkMode}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button className="flex items-center justify-center w-full p-3 border border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default UserProfilePage

