import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage";
import MovieDetails from "./components/MovieDetails";
import MovieSeatBooking from "./components/MovieSeatBooking";
import TicketPage from "./components/TiketPage";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/book/:id" element={<MovieSeatBooking />} />
        <Route path="/ticket" element={<TicketPage />} />
      </Routes>
    </div>
  );
};

export default App;
