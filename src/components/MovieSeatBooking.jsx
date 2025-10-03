import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MovieSeatBooking = ({
  layout = { rows: 8, seatsPerRow: 12, aislePosition: 5 },
  seatTypes = {
    regular: { name: "Regular", price: 150, rows: [0, 1, 2] },
    premium: { name: "Premium", price: 250, rows: [3, 4, 5] },
    vip: { name: "VIP", price: 350, rows: [6, 7] },
  },
  bookedSeats = [],
  currency = "$",
  title = "Movie Seat Booking",
  subtitle = "Select your preferred seats",
}) => {
  const navigate = useNavigate();
  const colors = ["blue", "purple", "yellow", "green", "red", "indigo", "pink", "gray"];

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

  const getColorClass = (colorName) => {
    const colorMap = {
      blue: "bg-blue-700 border-blue-600 text-white hover:bg-blue-800",
      purple: "bg-purple-700 border-purple-600 text-white hover:bg-purple-800",
      yellow: "bg-yellow-400 border-yellow-300 text-black hover:bg-yellow-500",
      green: "bg-green-500 border-green-600 text-white hover:bg-green-600",
      red: "bg-red-600 border-red-500 text-white hover:bg-red-700",
      indigo: "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700",
      pink: "bg-pink-500 border-pink-400 text-white hover:bg-pink-600",
      gray: "bg-gray-600 border-gray-500 text-white hover:bg-gray-700",
    };
    return colorMap[colorName] || colorMap.blue;
  };

  const getSeatClassName = (seat) => {
    const baseClass =
      "w-10 h-10 m-1 rounded-t-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-sm font-bold";
    if (seat.status === "booked")
      return `${baseClass} bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed`;
    if (seat.selected) return `${baseClass} bg-green-500 border-green-600 text-white transform scale-110`;
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

    setSeats((prev) =>
      prev.map((row) =>
        row.map((seat) =>
          selectedSeats.some((s) => s.id === seat.id) ? { ...seat, status: "booked", selected: false } : seat
        )
      )
    );

    const ticketInfo = {
      movieTitle: title,
      seats: selectedSeats.map((s) => s.id),
      totalPrice: getTotalPrice(),
      date: new Date().toLocaleString(),
    };

    setSelectedSeats([]);

    // redirect to ticket page with ticket info
    navigate("/ticket", { state: ticketInfo });
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 p-4 text-white">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-2 text-yellow-400">{title}</h1>
        <p className="text-center text-gray-300 mb-6">{subtitle}</p>

        {/* Screen */}
        <div className="mb-6">
          <div className="w-full h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg mb-2 shadow-inner" />
          <p className="text-center text-sm text-gray-400 font-medium">SCREEN</p>
        </div>

        {/* Seat Map */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex flex-col items-center min-w-max">
            {seats.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center mb-2">
                <span className="w-8 text-center font-bold text-gray-400 mr-4">{String.fromCharCode(65 + rowIndex)}</span>
                {renderSeatSection(row, 0, layout.aislePosition)}
                <div className="w-8"></div>
                {renderSeatSection(row, layout.aislePosition, layout.seatsPerRow)}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 p-4 bg-gray-700 rounded-lg">
          {Object.entries(seatTypes).map(([type, config], i) => (
            <div className="flex items-center" key={type}>
              <div className={`w-6 h-6 border-2 rounded-t-lg mr-2 ${getColorClass(colors[i % colors.length])}`} />
              <span className="text-sm">
                {config.name} ({currency}
                {config.price})
              </span>
            </div>
          ))}

          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded-t-lg mr-2" />
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-600 border-2 border-gray-700 rounded-t-lg mr-2" />
            <span className="text-sm">Booked</span>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-lg mb-2">Booking Summary</h3>
          {selectedSeats.length ? (
            <>
              <p className="mb-2">
                Selected Seats:{" "}
                <span className="font-medium">{selectedSeats.map((s) => s.id).join(", ")}</span>
              </p>
              <p className="mb-2">
                Number of Seats: <span className="font-medium">{selectedSeats.length}</span>
              </p>
              <p className="text-xl font-bold text-green-400">
                Total: {currency}
                {getTotalPrice()}
              </p>
            </>
          ) : (
            <p className="text-gray-400">No seats selected</p>
          )}
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={!selectedSeats.length}
          className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
            selectedSeats.length
              ? "bg-red-600 hover:bg-red-700 text-white transform hover:scale-105"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          {selectedSeats.length
            ? `Book ${selectedSeats.length} Seat(s) - ${currency}${getTotalPrice()}`
            : "Select Seats to Book"}
        </button>
      </div>
    </div>
  );
};

export default MovieSeatBooking;
