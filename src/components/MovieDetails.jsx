import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, Calendar, Star, Film, Users, Award, Globe, DollarSign, Trophy, ArrowLeft } from "lucide-react";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie || movie.Response === "False") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center">
          <Film className="w-20 h-20 text-gray-700 mx-auto mb-4" />
          <p className="text-xl mb-4">Movie not found</p>
          <Link to="/" className="text-red-500 hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

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
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </nav>

      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
          style={{
            backgroundImage: movie.Poster !== "N/A" ? `url(${movie.Poster})` : 'none',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/80 to-gray-950"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
                alt={movie.Title}
                className="w-64 rounded-xl shadow-2xl border-2 border-gray-800 hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {movie.Title}
              </h1>
              
              {/* Rating Badge */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 px-3 py-1.5 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-lg">{movie.imdbRating || "N/A"}</span>
                  <span className="text-sm text-gray-400">/10</span>
                </div>
                {movie.imdbVotes && (
                  <span className="text-sm text-gray-400">
                    {parseInt(movie.imdbVotes.replace(/,/g, '')).toLocaleString()} votes
                  </span>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                {movie.Genre && movie.Genre.split(", ").map((genre, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-red-500" />
                  <span>{movie.Runtime || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <span>{movie.Released || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Globe className="w-5 h-5 text-red-500" />
                  <span>{movie.Language || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Award className="w-5 h-5 text-red-500" />
                  <span>{movie.Rated || "Not Rated"}</span>
                </div>
              </div>

              {/* Plot */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed">
                  {movie.Plot || "No plot available."}
                </p>
              </div>

              {/* Cast & Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {movie.Actors && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" /> CAST
                    </h3>
                    <p className="text-gray-200">{movie.Actors}</p>
                  </div>
                )}
                {movie.Director && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">DIRECTOR</h3>
                    <p className="text-gray-200">{movie.Director}</p>
                  </div>
                )}
                {movie.Writer && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">WRITER</h3>
                    <p className="text-gray-200">{movie.Writer}</p>
                  </div>
                )}
              </div>

              {/* Book Button */}
              <Link
                to={`/book/${movie.imdbID}`}
                state={{ movieTitle: movie.Title }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-red-600/50"
              >
                <span>🎟️</span>
                <span>Book Tickets</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {(movie.Awards || movie.BoxOffice || movie.Production) && (
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {movie.Awards && movie.Awards !== "N/A" && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-sm font-semibold text-gray-400">AWARDS</h3>
                  </div>
                  <p className="text-gray-200">{movie.Awards}</p>
                </div>
              )}
              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h3 className="text-sm font-semibold text-gray-400">BOX OFFICE</h3>
                  </div>
                  <p className="text-gray-200">{movie.BoxOffice}</p>
                </div>
              )}
              {movie.Production && movie.Production !== "N/A" && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition">
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-gray-400">PRODUCTION</h3>
                  </div>
                  <p className="text-gray-200">{movie.Production}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;