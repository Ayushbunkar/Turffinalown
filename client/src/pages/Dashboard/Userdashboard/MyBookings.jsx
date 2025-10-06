
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../config/Api";
import UserSidebar from "../../../components/Sidebar/UserSidebar";

const tableVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/my-bookings").then((res) => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

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
          My Bookings
        </motion.h1>

        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6"
        >
          {loading ? (
            <div className="text-blue-500 text-center py-10 animate-pulse">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-gray-500 text-center py-10">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Turf</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {bookings.map((b, i) => (
                    <motion.tr
                      key={b._id || i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-blue-900">{b.turfName || "-"}</td>
                      <td className="px-4 py-3 text-blue-700">{b.date || "-"}</td>
                      <td className="px-4 py-3 text-blue-700">{b.time || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === "completed" ? "bg-green-100 text-green-700" : b.status === "upcoming" ? "bg-yellow-100 text-yellow-700" : "bg-gray-200 text-gray-600"}`}>{b.status || "-"}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default MyBookings;
