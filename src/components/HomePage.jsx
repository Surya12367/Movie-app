import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(true); // default dark mode

  // Fetch movies from OMDB API (default: Avengers)
  const fetchMovies = (query = "avengers") => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
      .then((res) => res.json())
      .then((data) => setMovies(data.Search || []));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") fetchMovies(searchTerm);
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      {/* Navbar with mode toggle */}
      <nav className={`flex justify-between items-center px-6 py-4 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h1 className="text-2xl font-bold text-red-600">🎬 My Movie App</h1>
        <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>

      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] w-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1608889173092-02f01a14e9f3?auto=format&fit=crop&w=1950&q=80')",
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Book Movies, Events & Plays
          </h1>
          <p className="text-gray-300 mb-6 text-lg md:text-xl drop-shadow-sm">
            Find your favorite movies & book tickets instantly
          </p>

          {/* Floating Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-2xl shadow-xl rounded-full overflow-hidden border border-gray-200"
          >
            <input
              type="text"
              placeholder="Search for Movies, Events, Plays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-grow px-6 py-3 focus:outline-none ${
                darkMode ? "text-black bg-white caret-black" : "text-gray-900 bg-white caret-black"
              }`}
              style={{ caretColor: darkMode ? "black" : "black" }} // ensure cursor visible
            />
            <button
              className={`px-6 py-3 font-semibold transition ${
                darkMode
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          {searchTerm ? `Results for "${searchTerm}"` : "Now Showing"}
        </h2>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className={`rounded-lg shadow-lg hover:scale-105 transition transform ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300x400?text=No+Image"
                  }
                  alt={movie.Title}
                  className="w-full h-72 object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <h3 className={`text-lg font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {movie.Title}
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{movie.Year}</p>
                  <Link
                    to={`/movie/${movie.imdbID}`}
                    className="mt-2 inline-block w-full text-center bg-red-600 text-white py-1 rounded hover:bg-red-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No movies found</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
