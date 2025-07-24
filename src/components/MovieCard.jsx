import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWatchlistStore from "../store/watchlistStore";

const MovieCard = ({ movie, openTrailer }) => {
  const {
    id,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    overview,
    video_url,
  } = movie;

  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();

  const [showFullOverview, setShowFullOverview] = useState(false);
  const [isFullMovieOpen, setIsFullMovieOpen] = useState(false);

  const isInWatchlist = watchlist.some((m) => m.id === id);

  const fetchTrailer = async () => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      if (trailer) {
        openTrailer(trailer.key); // Tell parent to open trailer modal
      } else {
        alert("No trailer available");
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
      alert("Failed to fetch trailer");
    }
  };

  const handleWatchlistToggle = () => {
    if (!isInWatchlist) {
      addToWatchlist(movie);
      navigate("/watchlist");
    } else {
      removeFromWatchlist(id);
    }
  };

  return (
    <li className="movie-card bg-[#1f2937] text-white p-4 rounded-lg shadow-lg flex flex-col w-[300px]">
      {/* Poster Image */}
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "no-movie.png"
        }
        alt={title}
        className="rounded-lg w-full h-[420px] object-cover"
      />

      {/* Title & Info */}
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="text-sm text-gray-400">
          ⭐ {vote_average?.toFixed(1) || "N/A"} |{" "}
          {original_language?.toUpperCase() || "N/A"} |{" "}
          {release_date?.split("-")[0] || "N/A"}
        </div>

        {/* Overview */}
        {overview && (
          <>
            {showFullOverview && (
              <p className="text-sm text-gray-300 mt-2">{overview}</p>
            )}
            <button
              onClick={() => setShowFullOverview(!showFullOverview)}
              className="text-blue-400 hover:underline mt-2 text-sm text-left w-fit"
              aria-label={
                showFullOverview ? "Show less overview" : "Show more overview"
              }
            >
              {showFullOverview ? "Show Less" : "Show More"}
            </button>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={fetchTrailer}
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium"
          >
            Watch Trailer
          </button>

          {video_url && (
            <button
              onClick={() => setIsFullMovieOpen(!isFullMovieOpen)}
              className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-md text-sm font-medium"
            >
              {isFullMovieOpen ? "Close Movie" : "Watch Full Movie"}
            </button>
          )}

          <button
            onClick={handleWatchlistToggle}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              isInWatchlist
                ? "bg-red-600 hover:bg-red-700"
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </button>
        </div>

        {/* Full Movie Video */}
        {isFullMovieOpen && video_url && (
          <div className="mt-4">
            <video controls className="w-full rounded-md">
              <source src={video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </li>
  );
};

export default MovieCard;
