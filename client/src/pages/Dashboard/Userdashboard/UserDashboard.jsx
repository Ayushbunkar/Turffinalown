import React, { useEffect, useState } from "react";
import api from "../../../config/Api";

import { Link } from "react-router-dom";
import TurfBookingChart from "../../../components/TurfBookingChart";
import UserSidebar from "../../../components/Sidebar/UserSidebar";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: "spring", stiffness: 80 },
  }),
};

const UserDashboard = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ bookings: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    api.get("/bookings/my-bookings").then((res) => {
      setData(res.data);
      setStats({
        bookings: res.data.length,
        upcoming: res.data.filter((b) => b.status === "upcoming").length,
        completed: res.data.filter((b) => b.status === "completed").length,
      });
    });
  }, []);

  const cards = [
    {
      label: "Total Bookings",
      value: stats.bookings,
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      ),
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      color: "from-green-400 to-green-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      ),
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 animate-fade-in">
      <UserSidebar />
      <main className="flex-1 p-6 md:ml-56">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-extrabold mb-8 text-gray-800 text-center tracking-tight"
        >
          Welcome to Your Dashboard
        </motion.h1>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className={`rounded-xl shadow-lg p-6 bg-gradient-to-br ${card.color} text-white flex flex-col items-center hover:scale-105 transition-transform duration-300`}
            >
              {card.icon}
              <div className="mt-4 text-lg font-semibold">{card.label}</div>
              <div className="text-3xl font-bold mt-2 animate-pulse">{card.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center">
          <Link to="/dashboard/user/my-bookings">
            <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">My Bookings</button>
          </Link>
          <Link to="/dashboard/user/profile">
            <button className="px-6 py-3 rounded-lg bg-gray-700 text-white font-semibold shadow hover:bg-gray-800 transition">Profile</button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="bg-white rounded-xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-700">Booking Trends</h2>
          <TurfBookingChart data={data} />
        </motion.div>
      </main>
    </div>
  );
};

export default UserDashboard;
