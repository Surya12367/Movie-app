import React, { useMemo, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Tag, Info } from "lucide-react";

const MovieSeatBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const movieTitle = location.state?.movieTitle || "Movie";
  
  // Configuration
  const layout = { rows: 8, seatsPerRow: 12, aislePosition: 6 };
  const seatTypes = {
    regular: { name: "Regular", price: 150, rows: [0, 1, 2] },
    premium: { name: "Premium", price: 250, rows: [3, 4, 5] },
    vip: { name: "VIP", price: 350, rows: [6, 7] },
  };
  const bookedSeats = ["C5", "C6", "D5", "D6", "E7", "E8"];
  const currency = "₹";

  const colors = ["blue", "purple", "yellow"];

  const getSeatType = (row) => {
    const seatTypeEntries = Object.entries(seatTypes);
    for (let i = 0; i < seatTypeEntries.length; i++) {
      const [type, config] = seatTypeEntries[i];
      if (config.rows.includes(row)) return { type, color: colors[i % colors.length], ...config };
    }
    const [firstType, firstConfig] = seatTypeEntries[0];
    return { type: firstType, color: colors[0], ...firstConfig };
  };

  const initializeSeats = useMemo(() => {
    const seats = [];
    for (let row = 0; row < layout.rows; row++) {
      const seatRow = [];
      const seatTypeInfo = getSeatType(row);
      for (let seat = 0; seat < layout.seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
        seatRow.push({
          id: seatId,
          row,
          seat,
          type: seatTypeInfo.type,
          price: seatTypeInfo.price,
          color: seatTypeInfo.color,
          status: bookedSeats.includes(seatId) ? "booked" : "available",
          selected: false,
        });
      }
      seats.push(seatRow);
    }
    return seats;
  }, [layout, seatTypes, bookedSeats]);

  const [seats, setSeats] = useState(initializeSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTime, setShowTime] = useState("7:00 PM");
  const [selectedDate, setSelectedDate] = useState("Today");

  const showTimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
  const dates = ["Today", "Tomorrow", "Day After"];

  const getColorClass = (colorName) => {
    const colorMap = {
      blue: "bg-blue-600 border-blue-500 text-white hover:bg-blue-700",
      purple: "bg-purple-600 border-purple-500 text-white hover:bg-purple-700",
      yellow: "bg-yellow-400 border-yellow-300 text-black hover:bg-yellow-500",
    };
    return colorMap[colorName] || colorMap.blue;
  };

  const getSeatClassName = (seat) => {
    const baseClass = "w-9 h-9 m-1 rounded-t-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold";
    if (seat.status === "booked")
      return `${baseClass} bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed opacity-50`;
    if (seat.selected) 
      return `${baseClass} bg-green-500 border-green-400 text-white transform scale-110 shadow-lg shadow-green-500/50`;
    return `${baseClass} ${getColorClass(seat.color)}`;
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seat = seats[rowIndex][seatIndex];
    if (seat.status === "booked") return;
    const isSelected = seat.selected;

    setSeats((prev) =>
      prev.map((row, rIdx) =>
        row.map((s, sIdx) => (rIdx === rowIndex && sIdx === seatIndex ? { ...s, selected: !s.selected } : s))
      )
    );

    if (isSelected) setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    else setSelectedSeats((prev) => [...prev, seat]);
  };

  const renderSeatSection = (seatRow, start, end) => (
    <div className="flex">
      {seatRow.slice(start, end).map((seat, index) => (
        <div
          key={seat.id}
          title={`${seat.id} - ${getSeatType(seat.row).name} - ${currency}${seat.price}`}
          className={getSeatClassName(seat)}
          onClick={() => handleSeatClick(seat.row, start + index)}
        >
          {start + index + 1}
        </div>
      ))}
    </div>
  );

  const getTotalPrice = () => selectedSeats.reduce((total, seat) => total + seat.price, 0);

  const handleBooking = () => {
    if (!selectedSeats.length) {
      alert("Please select at least one seat");
      return;
    }

    const ticketInfo = {
      movieTitle,
      seats: selectedSeats.map((s) => s.id),
      totalPrice: getTotalPrice(),
      showTime,
      date: selectedDate,
      bookingDate: new Date().toLocaleString(),
    };

    navigate("/ticket", { state: ticketInfo });
  };

  return (
    <div className="w-full min-h-screen bg-gray-950 p-4 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{movieTitle}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>PVR Cinemas, Chennai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>{showTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Select Date</h3>
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                  selectedDate === date
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {date}
              </button>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">Select Show Time</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {showTimes.map((time) => (
              <button
                key={time}
                onClick={() => setShowTime(time)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                  showTime === time
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Seat Selection */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Select Your Seats</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Info className="w-4 h-4" />
              <span>Click on seats to select</span>
            </div>
          </div>

          {/* Screen */}
          <div className="mb-8">
            <div className="w-full max-w-4xl mx-auto">
              <div className="h-2 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-lg mb-3 shadow-lg" />
              <p className="text-center text-sm text-gray-400 font-medium tracking-wider">
                ⬇️ SCREEN THIS WAY ⬇️
              </p>
            </div>
          </div>

          {/* Seat Map */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex flex-col items-center min-w-max mx-auto">
              {seats.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center mb-2">
                  <span className="w-8 text-center font-bold text-gray-400 mr-4 text-sm">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  {renderSeatSection(row, 0, layout.aislePosition)}
                  <div className="w-12"></div>
                  {renderSeatSection(row, layout.aislePosition, layout.seatsPerRow)}
                  <span className="w-8 text-center font-bold text-gray-400 ml-4 text-sm">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            {Object.entries(seatTypes).map(([type, config], i) => (
              <div className="flex items-center" key={type}>
                <div className={`w-6 h-6 border-2 rounded-t-lg mr-2 ${getColorClass(colors[i % colors.length])}`} />
                <span className="text-sm">
                  {config.name} ({currency}{config.price})
                </span>
              </div>
            ))}
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 border-2 border-green-400 rounded-t-lg mr-2" />
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-700 border-2 border-gray-600 rounded-t-lg mr-2 opacity-50" />
              <span className="text-sm">Booked</span>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-red-500" />
              Booking Summary
            </h3>
            {selectedSeats.length ? (
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Selected Seats:</span>
                  <span className="font-medium text-white">{selectedSeats.map((s) => s.id).join(", ")}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Number of Seats:</span>
                  <span className="font-medium text-white">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Show Time:</span>
                  <span className="font-medium text-white">{showTime}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Date:</span>
                  <span className="font-medium text-white">{selectedDate}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-400">
                      {currency}{getTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No seats selected</p>
            )}
          </div>

          {/* Book Button */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 flex flex-col justify-center">
            <button
              onClick={handleBooking}
              disabled={!selectedSeats.length}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
                selectedSeats.length
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transform hover:scale-105 shadow-lg hover:shadow-red-600/50"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedSeats.length
                ? `Proceed to Pay ${currency}${getTotalPrice()}`
                : "Select Seats to Continue"}
            </button>
            {selectedSeats.length > 0 && (
              <p className="text-center text-gray-400 text-sm mt-3">
                You're booking {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieSeatBooking;