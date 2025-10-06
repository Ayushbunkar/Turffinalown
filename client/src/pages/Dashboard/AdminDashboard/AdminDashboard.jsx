
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../../../config/Api";
import AdminSidebar from "../../../components/Sidebar/AdminSidebar";

const AdminDashboard = () => {
  const [turfs, setTurfs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.get("/api/turfs/my-turfs").then((res) => setTurfs(res.data));
  }, []);

  // Example stats (replace with real API data if available)
  const stats = [
    { label: "Total Turfs", value: turfs.length },
    { label: "Bookings", value: 120 },
    { label: "Revenue", value: "₹45,000" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Sidebar overlay for mobile */}
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
      <div className={`fixed z-50 inset-y-0 left-0 w-64 transform bg-gray-800 text-white p-4 transition-transform duration-200 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="mb-4 text-right w-full" onClick={() => setSidebarOpen(false)}>
          <span className="text-2xl">×</span>
        </button>
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar for mobile */}
        <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-bold text-lg text-green-600">Admin Dashboard</span>
          <div />
        </div>

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 hidden md:block">Admin Dashboard</h1>


          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                <div className="text-gray-500 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to="/dashboard/admin/my-bookings">
              <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">My Bookings</button>
            </Link>
            <Link to="/dashboard/admin/profile">
              <button className="px-6 py-3 rounded-lg bg-gray-700 text-white font-semibold shadow hover:bg-gray-800 transition">Profile</button>
            </Link>
          </div>

          {/* Turf cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4">My Turfs</h2>
            {turfs.length === 0 ? (
              <div className="text-gray-500">No turfs found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {turfs.map((turf) => (
                  <div key={turf._id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col">
                    <div className="h-36 bg-gray-200 rounded mb-4 flex items-center justify-center">
                      {/* Turf image if available */}
                      {turf.imageUrl ? (
                        <img src={turf.imageUrl} alt={turf.name} className="h-full w-full object-cover rounded" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="font-bold text-lg mb-1">{turf.name}</div>
                    <div className="text-gray-500 mb-2">{turf.location}</div>
                    <div className="flex-1" />
                    <button className="mt-3 px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition">View Details</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
