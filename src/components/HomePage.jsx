import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Film, MapPin, Filter, TrendingUp, Clock, Star } from "lucide-react";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("now-showing");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [city, setCity] = useState("Chennai");

  const genres = ["all", "action", "comedy", "drama", "thriller", "horror", "romance", "sci-fi"];
  const cities = ["Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Kolkata"];

  // Fetch movies from OMDB API
  const fetchMovies = (query = "avengers") => {
    setLoading(true);
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&type=movie`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.Search || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchMovies(searchTerm);
    }
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    if (genre !== "all") {
      fetchMovies(genre);
    } else {
      fetchMovies();
    }
  };

  const MovieCard = ({ movie }) => (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
          alt={movie.Title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition">
              Book Now
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1 truncate group-hover:text-red-500 transition">
          {movie.Title}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{movie.Year}</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-white">8.5</span>
          </div>
        </div>
      </div>
    </Link>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="aspect-[2/3] bg-gray-700"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation Bar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                MovieBook
              </h1>
            </div>
            
            {/* City Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <MapPin className="w-4 h-4 text-red-500" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c} value={c} className="bg-gray-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1950&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/60 to-gray-950"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-red-200 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            Book Movies
          </h1>
          <p className="text-gray-300 mb-8 text-xl md:text-2xl font-light">
            Find your favorite movies & book tickets instantly
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl">
            <div className="flex bg-white rounded-full shadow-2xl overflow-hidden border-2 border-gray-200 hover:border-red-500 transition">
              <div className="flex items-center pl-6 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-4 py-4 text-gray-900 focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-gray-900 border-y border-gray-800 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-5 h-5" />
              <span className="font-semibold whitespace-nowrap">Filters:</span>
            </div>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedGenre === genre
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab("now-showing")}
            className={`pb-3 px-2 font-semibold transition flex items-center gap-2 ${
              activeTab === "now-showing"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Clock className="w-5 h-5" />
            Now Showing
          </button>
          <button
            onClick={() => setActiveTab("coming-soon")}
            className={`pb-3 px-2 font-semibold transition flex items-center gap-2 ${
              activeTab === "coming-soon"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Coming Soon
          </button>
        </div>

        {/* Movies Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            {searchTerm ? `Results for "${searchTerm}"` : "Popular Movies"}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Film className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No movies found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">© 2025 MovieBook. All rights reserved.</p>
            <p className="text-sm">Made with ❤️ for movie lovers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;