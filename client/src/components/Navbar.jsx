
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, role } = useContext(AuthContext);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  let dashboardPath = "/";
  if (role === "admin") dashboardPath = "/dashboard/admin";
  else if (role === "superadmin") dashboardPath = "/dashboard/superadmin";
  else if (role === "user") dashboardPath = "/dashboard/user";

  return (
    <nav className="fixed w-full z-50 bg-white py-2">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo - Shown on both desktop and mobile */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          TurfTime
        </Link>

        {/* Desktop Links + Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Desktop navigation links */}
          <Link to="/" className="font-medium text-black hover:text-green-600 transition">Home</Link>
          <Link to="/about" className="font-medium text-black hover:text-green-600 transition">About</Link>
          <Link to="/turfs" className="font-medium text-black hover:text-green-600 transition">Turfs</Link>
          <Link to="/contact" className="font-medium text-black hover:text-green-600 transition">Contact</Link>

          {/* Desktop auth/dashboard button */}
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <motion.button whileHover={{ scale: 1.02 }} className="px-4 py-2 rounded-md font-medium bg-white text-green-600 border border-green-600">Login</motion.button>
              </Link>
              <Link to="/signup">
                <motion.button whileHover={{ scale: 1.02 }} className="px-4 py-2 rounded-md font-medium bg-green-600 text-white">Sign Up</motion.button>
              </Link>
            </>
          ) : (
            <Link to={dashboardPath}>
              <motion.button whileHover={{ scale: 1.02 }} className="px-4 py-2 rounded-md font-medium bg-green-600 text-white">Dashboard</motion.button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="md:hidden">
          {/* Mobile hamburger button */}
          <button onClick={() => setIsOpen(p => !p)} className="p-2 rounded-md text-black">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown - Only appears on mobile when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="md:hidden bg-white rounded-xl shadow-xl border border-gray-200">
            {/* Mobile navigation links and auth/dashboard button */}
            <div className="flex flex-col px-4 py-5 space-y-3">
              <Link to="/" className="font-medium text-black hover:text-green-600">Home</Link>
              <Link to="/about" className="font-medium text-black hover:text-green-600">About</Link>
              <Link to="/turfs" className="font-medium text-black hover:text-green-600">Turfs</Link>
              <Link to="/contact" className="font-medium text-black hover:text-green-600">Contact</Link>

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login">
                      <motion.button whileHover={{ scale: 1.02 }} className="px-4 py-2 rounded-md font-medium bg-white text-green-600 border border-green-600 w-full">Login</motion.button>
                    </Link>
                    <Link to="/signup">
                      <motion.button whileHover={{ scale: 1.02 }} className="px-4 py-2 rounded-md font-medium bg-green-600 text-white w-full">Sign Up</motion.button>
                    </Link>
                  </>
                ) : (
                  <Link to={dashboardPath}>
                    <motion.button whileHover={{ scale: 1.02 }} className="px-4 py-2 rounded-md font-medium bg-green-600 text-white w-full">Dashboard</motion.button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
