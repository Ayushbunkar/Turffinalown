import React from "react";
import UserSidebar from "../../../components/Sidebar/UserSidebar";

const HelpSupport = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in">
      <UserSidebar />
      <main className="flex-1 p-6 md:ml-64 flex flex-col items-center justify-start py-10">
        <h1 className="text-3xl font-extrabold mb-8 text-blue-800 text-center tracking-tight">Help & Support</h1>
        <div className="bg-white rounded-xl shadow p-6 max-w-2xl w-full">
          {/* Add help and support content here */}
          <div className="text-gray-500">Help & support coming soon.</div>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
