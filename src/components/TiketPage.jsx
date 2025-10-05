import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Download, Share2, Calendar, Clock, MapPin, Ticket, Home } from "lucide-react";

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state;
  const [downloadStatus, setDownloadStatus] = useState("");
  const [bookingId] = useState(`BK${Date.now().toString().slice(-8)}`);

  // Save booking to localStorage when component mounts
  useEffect(() => {
    if (ticket) {
      const bookingData = {
        ...ticket,
        bookingId,
        bookingDate: new Date().toISOString(),
      };

      // Get existing bookings
      const existingBookings = JSON.parse(localStorage.getItem("movieBookings") || "[]");
      
      // Add new booking
      existingBookings.unshift(bookingData);
      
      // Save back to localStorage
      localStorage.setItem("movieBookings", JSON.stringify(existingBookings));
    }
  }, [ticket, bookingId]);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <Ticket className="w-20 h-20 text-gray-700 mx-auto mb-4" />
          <p className="text-xl mb-4">No ticket found</p>
          <p className="text-gray-400 mb-6">Please book your seats first.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    setDownloadStatus("Downloading...");
    setTimeout(() => {
      setDownloadStatus("Downloaded ✓");
      setTimeout(() => setDownloadStatus(""), 2000);
    }, 1000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Movie Ticket',
        text: `${ticket.movieTitle} - Booking confirmed!`,
      }).catch(() => {});
    } else {
      alert("Share feature not supported on this browser");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4 animate-pulse">
            <Check className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your tickets have been booked successfully</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm mb-1">Booking ID</p>
                <p className="text-white font-bold text-xl">{bookingId}</p>
              </div>
              <Ticket className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Movie Details */}
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4">{ticket.movieTitle}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="text-white font-semibold">{ticket.date || "Today"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Show Time</p>
                  <p className="text-white font-semibold">{ticket.showTime || "7:00 PM"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Theater</p>
                  <p className="text-white font-semibold">PVR Cinemas, Chennai</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">Seats</p>
                  <p className="text-white font-semibold">{ticket.seats.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-6 border-b border-gray-800 flex flex-col items-center">
            <p className="text-gray-400 text-sm mb-4">Scan QR code at the theater</p>
            <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center mb-4 p-4">
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-xs text-gray-600 font-mono">{bookingId}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Show this QR code at the entrance</p>
          </div>

          {/* Payment Details */}
          <div className="p-6 bg-gray-800/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Number of Tickets</span>
              <span className="text-white font-semibold">{ticket.seats.length}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Booking Date</span>
              <span className="text-white font-semibold">{ticket.bookingDate || new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-lg font-semibold text-white">Total Paid</span>
              <span className="text-2xl font-bold text-green-400">₹{ticket.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-lg font-semibold transition border border-gray-700"
          >
            <Download className="w-5 h-5" />
            {downloadStatus || "Download Ticket"}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-lg font-semibold transition border border-gray-700"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        {/* Important Information */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Important Information</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Please arrive at least 15 minutes before the show time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Carry a valid ID proof for verification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Show this ticket (QR code) at the theater entrance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>No refunds or cancellations allowed after booking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Outside food and beverages are not permitted</span>
            </li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-lg font-bold transition transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() => navigate("/booking-history")}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-lg font-bold transition border border-gray-700"
          >
            View All Bookings
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Thank you for booking with MovieBook! 🎬
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Enjoy your movie experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;