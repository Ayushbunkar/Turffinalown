import React, { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import {
  Search,
  Calendar,
  Filter,
  DownloadCloud,
  AlertTriangle
} from "lucide-react";

// === MOCK DATA & SERVICES ===
const mockTurfs = [
  { _id: "t1", name: "The Green Arena" },
  { _id: "t2", name: "City Futsal Court" },
  { _id: "t3", name: "Victory Stadium" }
];

const mockBookings = [
  { _id: "b1", user: { name: "Alice Smith", email: "alice@example.com" }, turf: mockTurfs[0], date: "2025-10-20", timeSlot: "10:00 - 11:00", duration: 1, amount: 1500, status: "pending" },
  { _id: "b2", user: { name: "Bob Johnson", email: "bob@example.com" }, turf: mockTurfs[1], date: "2025-10-21", timeSlot: "18:00 - 20:00", duration: 2, amount: 3000, status: "confirmed" },
  { _id: "b3", user: { name: "Charlie Day", email: "charlie@example.com" }, turf: mockTurfs[0], date: "2025-10-15", timeSlot: "14:00 - 15:30", duration: 1.5, amount: 2250, status: "completed" },
  { _id: "b4", user: { name: "Diana Prince", email: "diana@example.com" }, turf: mockTurfs[2], date: "2025-10-25", timeSlot: "09:00 - 10:00", duration: 1, amount: 1800, status: "cancelled" },
  { _id: "b5", user: { name: "Eve Adams", email: "eve@example.com" }, turf: mockTurfs[1], date: "2025-10-26", timeSlot: "16:00 - 17:00", duration: 1, amount: 1600, status: "pending" },
  { _id: "b6", user: { name: "Frank Miller", email: "frank@example.com" }, turf: mockTurfs[2], date: "2025-10-27", timeSlot: "20:00 - 21:00", duration: 1, amount: 2000, status: "confirmed" }
];

const fetchTurfsService = () => new Promise(resolve => setTimeout(() => resolve(mockTurfs), 100));
const fetchBookingsService = params => new Promise(resolve => setTimeout(() => {
  let filtered = mockBookings;
  const searchParams = new URLSearchParams(params);
  const status = searchParams.get("status");
  const turfId = searchParams.get("turfId");
  const search = searchParams.get("search")?.toLowerCase();

  if (status && status !== "all") filtered = filtered.filter(b => b.status === status);
  if (turfId && turfId !== "all") filtered = filtered.filter(b => b.turf._id === turfId);
  if (search) filtered = filtered.filter(b =>
    b.user.name.toLowerCase().includes(search) ||
    b.user.email.toLowerCase().includes(search)
  );
  resolve(filtered);
}, 500));
const updateBookingStatus = (id, payload) => new Promise(resolve => setTimeout(() => resolve({ id, status: payload.status }), 200));
const exportBookingsService = params => new Promise(resolve => setTimeout(() => resolve("id,user,turf,date,status\nb1,Alice,Green Arena,2025-10-20,pending"), 200));

// === HELPER FUNCTIONS ===
const getStatusClasses = status => {
  switch (status) {
    case "confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  }
};

// === BOOKING ROW COMPONENT ===
const BookingRow = React.memo(({ booking, handleStatusChange }) => {
  const { user, turf, date, timeSlot, amount, duration, status, _id } = booking;
  return (
    <tr className="bg-white dark:bg-gray-900 text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-700 flex items-center justify-center">
            <span className="text-green-700 dark:text-green-200 font-medium">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || "Unknown"}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "No email"}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{turf?.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col space-y-1 mt-1">
          <span className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(date).toLocaleDateString()}
          </span>
          <span>{timeSlot} ({duration} hr)</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">₹{amount}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {_id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${getStatusClasses(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          {status === "pending" && (
            <>
              <button onClick={() => handleStatusChange(_id, "confirmed")} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors">Confirm</button>
              <button onClick={() => handleStatusChange(_id, "cancelled")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors">Cancel</button>
            </>
          )}
          {status === "confirmed" && (
            <button onClick={() => handleStatusChange(_id, "completed")} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors">Mark Completed</button>
          )}
          {(status === "completed" || status === "cancelled") && <span className="text-gray-400 dark:text-gray-500">No actions</span>}
        </div>
      </td>
    </tr>
  );
});

// === MAIN COMPONENT ===
export default function TurfAdminBookings() {
  const { darkMode } = useOutletContext() || {};
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "all", search: "", from: "", to: "", turfId: "all" });
  const [turfs, setTurfs] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all" && value) params.append(key, value);
      });
      const data = await fetchBookingsService(params.toString());
      setBookings(data);
    } catch (err) {
      toast.error("Could not fetch bookings");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const fetchTurfData = async () => {
      try {
        const data = await fetchTurfsService();
        setTurfs(data);
      } catch {
        toast.error("Could not fetch turfs");
      }
    };
    fetchTurfData();
    fetchBookings();
  }, [fetchBookings]);

  const handleFilterChange = e => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const applyFilters = () => setCurrentPage(1) || fetchBookings();
  const resetFilters = () => setFilters({ status: "all", search: "", from: "", to: "", turfId: "all" }) || setCurrentPage(1);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, { status: newStatus });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const exportBookings = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all" && value) params.append(key, value);
      });
      const data = await exportBookingsService(params.toString());
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bookings-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export successful");
    } catch {
      toast.error("Failed to export bookings");
    }
  };

  const { currentBookings, totalPages, indexOfFirstBooking, indexOfLastBooking } = useMemo(() => {
    const last = currentPage * bookingsPerPage;
    const first = last - bookingsPerPage;
    return { currentBookings: bookings.slice(first, last), totalPages: Math.ceil(bookings.length / bookingsPerPage), indexOfFirstBooking: first, indexOfLastBooking: last };
  }, [bookings, currentPage]);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Use transparent backgrounds so page cards match other dashboard pages
  const themeClass = darkMode ? "dark bg-transparent text-white min-h-screen" : "bg-transparent text-gray-900";


  // ===== RENDER =====
  return (
    <div className={`p-6 ${themeClass}`}>
      <div className="max-w-7xl mx-auto">
  <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Bookings</h1>
          <div className="flex space-x-3">
            <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-transparent border rounded-lg flex items-center space-x-2 hover:bg-gray-100/10 dark:hover:bg-gray-700/40">
              <Filter className="h-4 w-4" /> <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
            <button onClick={exportBookings} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700">
              <DownloadCloud className="h-4 w-4" /> <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-transparent p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm  mb-1">Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full  text-white rounded-lg p-2 dark:bg-gray-700">
                <option value="all " className="text-white">All Statuses</option>
                {["pending", "confirmed", "completed", "cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Turf */}
            <div>
              <label className="block text-sm mb-1">Turf</label>
              <select name="turfId" value={filters.turfId} onChange={handleFilterChange} className="w-full text-white bo rounded-lg p-2 dark:bg-gray-700">
                <option value="all" className="text-white">All Turfs</option>
                {turfs.map(t => <option key={t._id} value={t._id} className="text-white">{t.name}</option>)}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm mb-1">From Date</label>
              <input type="date" name="from" value={filters.from} onChange={handleFilterChange} className="w-full text-white rounded-lg p-2 dark:bg-gray-700" />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm mb-1">To Date</label>
              <input type="date" name="to" value={filters.to} onChange={handleFilterChange} className="w-full  text-white rounded-lg p-2 dark:bg-gray-700" />
            </div>

            {/* Search */}
            <div className="col-span-full">
              <label className="block text-sm mb-1">Search</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400"><Search className="h-4 w-4" /></span>
                <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by user or email" className="w-full pl-10 border rounded-lg p-2 dark:bg-gray-700" />
              </div>
            </div>

            <div className="col-span-full flex justify-end space-x-3">
              <button onClick={resetFilters} className="px-4 py-2 bg-gray-200/20 dark:bg-gray-700/40 rounded-lg">Reset</button>
              <button onClick={applyFilters} className="px-4 py-2 bg-green-600 text-white rounded-lg">Apply Filters</button>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {isLoading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div></div>
        ) : (
          <div className="bg-transparent rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-transparent">
                <tr>
                  {["User", "Turf & Time", "Details", "Status", "Actions"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentBookings.map(b => <BookingRow key={b._id} booking={b} handleStatusChange={handleStatusChange} />)}
              </tbody>
            </table>

            {/* Empty State */}
            {bookings.length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <AlertTriangle className="mx-auto h-6 w-6 mb-2" />
                No bookings found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
