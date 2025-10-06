import React from "react";
import { motion } from "framer-motion";
import UserSidebar from "../../../components/Sidebar/UserSidebar";

const Profile = () => {
  // Example user data (replace with real user data from context or API)
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User Name", email: "user@email.com", role: "user" };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in">
      <UserSidebar />
      <main className="flex-1 p-6 md:ml-56 flex flex-col items-center justify-start py-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-extrabold mb-8 text-blue-800 text-center tracking-tight"
        >
          My Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700 mb-4 shadow">
            {user.name ? user.name[0] : "U"}
          </div>
          <div className="text-xl font-semibold text-blue-900 mb-2">{user.name}</div>
          <div className="text-blue-700 mb-2">{user.email}</div>
          <div className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold mb-4">{user.role}</div>
          <div className="text-gray-500">Profile details coming soon.</div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
