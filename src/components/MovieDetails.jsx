import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  if (!movie) return <p className="p-6 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Poster */}
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.Title}
          className="w-full md:w-72 rounded-lg shadow-lg"
        />

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{movie.Title}</h1>
          <p className="text-gray-400 mb-4">{movie.Plot}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-red-600 px-3 py-1 rounded">{movie.Genre}</span>
            <span className="bg-red-600 px-3 py-1 rounded">
              Released: {movie.Released}
            </span>
            <span className="bg-red-600 px-3 py-1 rounded">Rating: {movie.imdbRating}</span>
          </div>
          <p className="mb-6"><b>Actors:</b> {movie.Actors}</p>

          <Link
            to={`/book/${movie.imdbID}`}
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-bold transition transform hover:scale-105"
          >
            🎟 Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
