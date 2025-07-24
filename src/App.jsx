import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "use-debounce";
import { updateSearchCount } from "./appwrite";
import Navbar from "./components/Navbar";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedValue] = useDebounce(searchTerm, 500); // debounce 500ms

  // State to store the current trailer key to show in modal
  const [trailerToShow, setTrailerToShow] = useState(null);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to Fetch Movies");
      }

      const data = await response.json();

      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to fetch Movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error Fetching Movies: ${error}`);
      setErrorMessage("Error Fetching Movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedValue);
  }, [debouncedValue]);

  return (
    <main className="transition-all">
      <div className="pattern" />
      <Navbar />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-Movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul className="grid grid-flow-col grid-rows-5 gap-4 mt-4">
              {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  openTrailer={(key) => setTrailerToShow(key)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Trailer Modal */}
      {trailerToShow && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative w-full max-w-3xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailerToShow}`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
            <button
              onClick={() => setTrailerToShow(null)}
              className="absolute top-2 right-2 bg-red-600 px-4 py-2 rounded text-white"
              aria-label="Close trailer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
