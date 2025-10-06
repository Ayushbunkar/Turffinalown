import React from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "My Turfs", to: "/dashboard/admin", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10l1.553-4.66A2 2 0 016.447 4h11.106a2 2 0 011.894 1.34L21 10M3 10v10a2 2 0 002 2h14a2 2 0 002-2V10M3 10h18" /></svg>
  ) },
  { label: "My Bookings", to: "/dashboard/admin/my-bookings", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ) },
  { label: "Profile", to: "/dashboard/admin/profile", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ) },
  { label: "Bookings", to: "/dashboard/admin/bookings", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ) },
  { label: "Add Turf", to: "/dashboard/admin/add-turf", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
  ) },
];

const AdminSidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-64 h-full bg-gray-800 text-white rounded-r-xl shadow-lg flex flex-col">
      <div className="py-6 px-4 border-b border-gray-700">
        <h2 className="font-bold text-2xl tracking-tight text-green-400">Admin Menu</h2>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center px-4 py-2 rounded-lg transition font-medium hover:bg-green-600 hover:text-white ${location.pathname === item.to ? 'bg-green-700 text-white' : 'text-gray-200'}`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
