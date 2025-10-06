import React, { useState, useEffect } from "react";
import api from "../config/Api";

const Turfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/turfs");
        setTurfs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load turfs. Please try again later.");
        setLoading(false);
        console.error("Error fetching turfs:", err);
      }
    };

    fetchTurfs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading turf information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Turfs</h1>
      
      {turfs.length === 0 ? (
        <p className="text-center text-xl">No turfs available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf) => (
            <div
              key={turf._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {turf.image && (
                <img
                  src={turf.image}
                  alt={turf.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{turf.name}</h2>
                <p className="text-gray-600 mb-2">{turf.location}</p>
                <p className="mb-2">{turf.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-600">
                    ₹{turf.pricePerHour}/hour
                  </span>
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    onClick={() => window.location.href = `/turf/${turf._id}`}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Turfs;
