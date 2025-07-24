// src/store/watchlistStore.js
import { create } from 'zustand';

const useWatchlistStore = create((set) => ({
  watchlist: [],
  addToWatchlist: (movie) =>
    set((state) => {
      const exists = state.watchlist.some((m) => m.id === movie.id);
      if (exists) return state;
      return { watchlist: [...state.watchlist, movie] };
    }),
  removeFromWatchlist: (movieId) =>
    set((state) => ({
      watchlist: state.watchlist.filter((movie) => movie.id !== movieId),
    })),
}));

export default useWatchlistStore;
