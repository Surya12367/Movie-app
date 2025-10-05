import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Film, Calendar, Clock, MapPin, Ticket, Trash2, Download, Search, Filter, ChevronDown } from "lucide-react";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("movieBookings") || "[]");
    setBookings(savedBookings);
    setFilteredBookings(savedBookings);
  }, []);

  // Filter and search bookings
  useEffect(() => {
    let result = [...bookings];

    // Search filter
    if (searchTerm) {
      result = result.filter((booking) =>
        booking.movieTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    const today = new Date();
    if (filterStatus === "upcoming") {
      result = result.filter((booking) => new Date(booking.bookingDate) >= today);
    } else if (filterStatus === "past") {
      result = result.filter((booking) => new Date(booking.bookingDate) < today);
    }

    // Sort
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.totalPrice - b.totalPrice);
    }

    setFilteredBookings(result);
  }, [searchTerm, filterStatus, sortBy, bookings]);

  const deleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const updatedBookings = bookings.filter((b) => b.bookingId !== bookingId);
      setBookings(updatedBookings);
      localStorage.setItem("movieBookings", JSON.stringify(updatedBookings));
    }
  };

  const downloadTicket = (booking) => {
    alert(`Downloading ticket for ${booking.movieTitle}...`);
    // In a real app, this would generate and download a PDF
  };

  const getStatusBadge = (bookingDate) => {
    const today = new Date();
    const booking = new Date(bookingDate);
    
    if (booking > today) {
      return (
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/40">
          Upcoming
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold border border-gray-500/40">
          Completed
        </span>
      );
    }
  };

  const BookingCard = ({ booking }) => (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800 hover:border-red-500/50 transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Film className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-bold text-white">{booking.movieTitle}</h3>
            </div>
            <p className="text-sm text-gray-500">Booking ID: {booking.bookingId}</p>
          </div>
          {getStatusBadge(booking.bookingDate)}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-semibold">{booking.date || "Today"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm font-semibold">{booking.showTime || "7:00 PM"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Theater</p>
              <p className="text-sm font-semibold">PVR Cinemas</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Ticket className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Seats</p>
              <p className="text-sm font-semibold">{booking.seats.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-400">₹{booking.totalPrice}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => downloadTicket(booking)}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
              title="Download Ticket"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteBooking(booking.bookingId)}
              className="p-2 bg-gray-800 hover:bg-red-600 text-white rounded-lg transition"
              title="Delete Booking"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Film className="w-6 h-6 text-red-600" />
            <span className="text-xl font-bold">MovieBook</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Back
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-gray-400">View and manage all your movie bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-white">{bookings.length}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-green-400">
              ₹{bookings.reduce((sum, b) => sum + b.totalPrice, 0)}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Upcoming Shows</p>
            <p className="text-3xl font-bold text-blue-400">
              {bookings.filter((b) => new Date(b.bookingDate) >= new Date()).length}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by movie name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Ticket className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-gray-300">
              {searchTerm || filterStatus !== "all" ? "No bookings found" : "No bookings yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Start booking your favorite movies now!"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link
                to="/"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Browse Movies
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;