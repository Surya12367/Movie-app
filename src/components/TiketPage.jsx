import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state;

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>No ticket found. Please book your seats first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-yellow-400">
          🎫 Booking Confirmed
        </h1>

        <div className="flex flex-col gap-2 mb-4 text-gray-200">
          <p>
            <span className="font-semibold">Movie:</span> {ticket.movieTitle}
          </p>
          <p>
            <span className="font-semibold">Seats:</span> {ticket.seats.join(", ")}
          </p>
          <p>
            <span className="font-semibold">Total Paid:</span> ${ticket.totalPrice}
          </p>
          <p>
            <span className="font-semibold">Date & Time:</span> {ticket.date}
          </p>
        </div>

        {/* QR code placeholder */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 bg-white flex items-center justify-center text-gray-800 font-bold">
            QR
          </div>
        </div>

        <button
          className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default TicketPage;
