import React from 'react';
import MovieCard from '../components/MovieCard';

const WatchlistPage = ({ watchlist, toggleWatchlist }) => {
  if (!watchlist.length) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-400">
        <p>Your watchlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {watchlist.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
        />
      ))}
    </div>
  );
};

export default WatchlistPage;
