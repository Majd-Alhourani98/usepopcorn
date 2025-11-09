/**
 * usePopcorn - Movie Search and Rating Application
 * 
 * This is the main application component that manages the entire movie search
 * and rating functionality. It allows users to:
 * - Search for movies using the OMDb API
 * - View movie details
 * - Rate movies with a star rating system
 * - Save watched movies to localStorage
 * - View statistics about watched movies
 * 
 * @component
 * @author Your Name
 * @description Main App component for the usePopcorn movie application
 */

import { useState, useEffect, useRef } from "react";

import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";

// OMDb API key for fetching movie data
// Note: In a production app, this should be stored in an environment variable
const key = "99496f8d";

/**
 * Calculates the average of an array of numbers
 * 
 * @param {number[]} arr - Array of numbers to calculate average for
 * @returns {number} The average value of all numbers in the array
 * @example
 * average([1, 2, 3, 4, 5]) // returns 3
 */
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

/**
 * Main App Component
 * 
 * This is the root component that orchestrates the entire application.
 * It manages:
 * - Search query state
 * - Selected movie state
 * - Watched movies list (persisted in localStorage)
 * - Movie search results (fetched from API)
 * 
 * @returns {JSX.Element} The main application UI
 */
export default function App() {
  // State for the search query input
  // This triggers the movie search when changed
  const [query, setQuery] = useState("");

  // State for the currently selected movie ID
  // null means no movie is selected (shows watched list)
  // When a movie ID is set, it shows the movie details
  const [selectedId, setSelectedId] = useState(null);

  // Custom hook that fetches movies from OMDb API based on the query
  // Returns: movies array, loading state, and error state
  // Also calls handleCloseMovie callback when query changes (closes movie details)
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  // Custom hook that manages watched movies in localStorage
  // Automatically syncs state with localStorage
  // Initial value is empty array, stored under key "watched"
  const [watched, setWatched] = useLocalStorage([], "watched");

  /**
   * Handles movie selection/deselection
   * 
   * @param {string} id - The IMDb ID of the movie to select
   * 
   * How it works:
   * - If clicking the same movie, it deselects (sets to null)
   * - If clicking a different movie, it selects that movie
   * - This toggles between movie list and movie details view
   */
  function handleSelectMovie(id) {
    setSelectedId(selectedId === id ? null : id);
  }

  /**
   * Closes the movie details view
   * 
   * Sets selectedId to null, which causes the app to show
   * the watched movies list instead of movie details
   */
  function handleCloseMovie() {
    setSelectedId(null);
  }

  /**
   * Adds a movie to the watched list
   * 
   * @param {Object} movie - The movie object to add to watched list
   * 
   * Why we use functional update:
   * - We use (watched) => [...watched, movie] instead of [...watched, movie]
   * - This ensures we're using the latest state value
   * - Direct state access can be stale in async operations
   * 
   * Note: localStorage sync is handled automatically by useLocalStorage hook
   */
  function handleAddWatached(movie) {
    setWatched((watched) => [...watched, movie]);
    // ❌ Don't do this - causes stale state issues:
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  /**
   * Removes a movie from the watched list
   * 
   * @param {string} id - The IMDb ID of the movie to remove
   * 
   * Uses filter to create a new array without the movie
   * This ensures React detects the state change
   */
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // Main render - conditionally renders different views based on state
  return (
    <>
      {/* Navigation bar with logo, search, and results count */}
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>

      {/* Main content area with two boxes */}
      <Main>
        {/* Left box: Movie search results */}
        <Box>
          {/* Show loader while fetching movies */}
          {isLoading && <Loader />}
          {/* Show movie list if loaded successfully */}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {/* Show error message if API call failed */}
          {error && <ErrorMessage message={error} />}
        </Box>

        {/* Right box: Movie details OR watched list */}
        <Box>
          {/* If a movie is selected, show its details */}
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatached}
              watched={watched}
            />
          ) : (
            /* Otherwise, show watched movies list with summary */
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

/**
 * Navigation Bar Component
 * 
 * A simple container component that wraps navigation elements
 * Uses CSS Grid for layout (defined in index.css)
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
function Navbar({ movies, children }) {
  return <nav className="nav-bar">{children}</nav>;
}

/**
 * Logo Component
 * 
 * Displays the application logo with popcorn emoji
 * 
 * @returns {JSX.Element} Logo with emoji and text
 */
function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="popcorn">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

/**
 * Search Input Component
 * 
 * Provides a search input field with keyboard shortcut support
 * 
 * Features:
 * - Press Enter key to focus the input and clear it
 * - Controlled input (value is controlled by parent state)
 * - Real-time search as user types
 * 
 * @param {Object} props - Component props
 * @param {string} props.query - Current search query value
 * @param {Function} props.setQuery - Function to update search query
 */
function Search({ setQuery, query }) {
  // useRef to get direct reference to the input DOM element
  // This allows us to programmatically focus the input
  const inputElement = useRef(null);

  // Custom hook that listens for Enter key press
  // When Enter is pressed (and input is not already focused):
  // 1. Focus the input field
  // 2. Clear the search query
  useKey("Enter", function () {
    // Don't do anything if the input is already focused
    // This prevents clearing the query while user is typing
    if (document.activeElement === inputElement.current) return;
    inputElement.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputElement}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

/**
 * Number of Results Component
 * 
 * Displays the count of search results
 * 
 * @param {Object} props - Component props
 * @param {Array} props.movies - Array of movies from search results
 */
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

/**
 * Main Content Container
 * 
 * A wrapper component for the main content area
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
function Main({ movies, children }) {
  return <main className="main">{children}</main>;
}

/**
 * Movie List Component
 * 
 * Displays a list of movies from search results
 * Each movie is clickable and shows movie details when clicked
 * 
 * @param {Object} props - Component props
 * @param {Array} props.movies - Array of movie objects to display
 * @param {Function} props.onSelectMovie - Callback when a movie is clicked
 */
function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {/* Optional chaining (?.) prevents error if movies is undefined */}
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

/**
 * Individual Movie Item Component
 * 
 * Displays a single movie in the search results list
 * Shows poster, title, and year
 * 
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object with Poster, Title, Year, imdbID
 * @param {Function} props.onSelectMovie - Callback when movie is clicked
 */
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

/**
 * Collapsible Box Component
 * 
 * A container component that can be collapsed/expanded
 * Used for the movie list and watched list sections
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display when box is open
 */
function Box({ children }) {
  // State to track whether the box is open or closed
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      {/* Toggle button that switches between open (-) and closed (+) */}
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {/* Only render children when box is open */}
      {isOpen && children}
    </div>
  );
}

/**
 * Watched Movies Summary Component
 * 
 * Displays statistics about watched movies:
 * - Total number of movies watched
 * - Average IMDb rating
 * - Average user rating
 * - Average runtime
 * 
 * @param {Object} props - Component props
 * @param {Array} props.watched - Array of watched movie objects
 */
function WatchedSummary({ watched }) {
  // Calculate averages using the average helper function
  // .map() extracts the specific property from each movie
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          {/* toFixed(2) formats number to 2 decimal places */}
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Watched Movies List Component
 * 
 * Displays a list of all watched movies
 * 
 * @param {Object} props - Component props
 * @param {Array} props.watched - Array of watched movie objects
 * @param {Function} props.onDeleteWatched - Callback to delete a movie from watched list
 */
function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

/**
 * Individual Watched Movie Component
 * 
 * Displays a single movie in the watched list
 * Shows poster, title, ratings, runtime, and delete button
 * 
 * @param {Object} props - Component props
 * @param {Object} props.movie - Watched movie object
 * @param {Function} props.onDeleteWatched - Callback to delete this movie
 */
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        {/* Delete button to remove movie from watched list */}
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          x
        </button>
      </div>
    </li>
  );
}

/**
 * Loading Spinner Component
 * 
 * Simple loading indicator shown while fetching data
 * 
 * @returns {JSX.Element} Loading message
 */
function Loader() {
  return <p className="loader">Loading...</p>;
}

/**
 * Error Message Component
 * 
 * Displays error messages when API calls fail
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 */
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🔥</span>
      {message}
    </p>
  );
}

/**
 * Movie Details Component
 * 
 * Displays detailed information about a selected movie
 * Features:
 * - Fetches full movie details from OMDb API
 * - Shows movie poster, plot, cast, director, etc.
 * - Allows user to rate the movie
 * - Adds movie to watched list with rating
 * - Updates browser tab title
 * - Supports Escape key to close
 * 
 * @param {Object} props - Component props
 * @param {string} props.selectedId - IMDb ID of the selected movie
 * @param {Array} props.watched - Array of watched movies
 * @param {Function} props.onCloseMovie - Callback to close movie details
 * @param {Function} props.onAddWatched - Callback to add movie to watched list
 */
function MovieDetails({ selectedId, watched, onCloseMovie, onAddWatched }) {
  // State for the full movie details object from API
  const [movie, setMovie] = useState({});

  // Loading state for movie details fetch
  const [isLoading, setIsLoading] = useState(false);

  // User's rating for this movie (0-10)
  const [userRating, setUserRating] = useState(0);

  // useRef to track number of rating changes without causing re-renders
  // Why useRef? Because we don't need to re-render when this changes
  // We just want to track how many times the user changed their rating
  const countRef = useRef(0);

  // Effect to count rating changes
  // Runs every time userRating changes
  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  // Check if this movie is already in the watched list
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  // Get the user's previous rating if movie was already watched
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  /**
   * Handles adding movie to watched list
   * 
   * Creates a new watched movie object with:
   * - Movie ID, title, year, poster
   * - IMDb rating (converted to number)
   * - User's rating
   * - Runtime (extracted from string like "120 min")
   * - Count of rating changes (for analytics)
   */
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      // Extract number from runtime string (e.g., "120 min" -> "120")
      runtime: runtime.split(" ").at(0),
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // Destructure movie object with renaming for cleaner code
  // API returns properties with capital letters, we rename to lowercase
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Director: director,
    Genre: genre,
    Actors: actors,
  } = movie;

  /**
   * Effect to fetch movie details from API
   * 
   * Runs when selectedId changes
   * Fetches full movie details using the IMDb ID
   */
  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);

          // Fetch movie details from OMDb API
          // Using 'i' parameter for IMDb ID lookup
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
          );

          const data = await response.json();
          setMovie(data);
        } finally {
          // Always set loading to false, even if there's an error
          setIsLoading(false);
        }
      }

      getMovieDetails();
    },
    [selectedId] // Only run when selectedId changes
  );

  /**
   * Effect to update browser tab title
   * 
   * Changes document title to show current movie
   * Cleans up by restoring original title when component unmounts
   */
  useEffect(
    function () {
      // Don't update title if movie data isn't loaded yet
      if (!title) return;

      // Update browser tab title
      document.title = `Movie | ${title}`;

      // Cleanup function: restore original title when component unmounts
      return function () {
        document.title = "UsePopCorn";
      };
    },
    [title] // Run when title changes
  );

  // Use custom hook to handle Escape key press
  // Closes movie details when Escape is pressed
  useKey("Escape", onCloseMovie);

  // Render movie details UI
  return (
    <div className="details">
      {/* Show loader while fetching movie details */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Movie header with back button, poster, and overview */}
          <header>
            {/* Back button to close movie details */}
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>

            {/* Movie poster image */}
            <img src={poster} alt={`Poster of ${title} movie`} />

            {/* Movie overview section */}
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐ {imdbRating} IMDb Rating</span>
              </p>
            </div>
          </header>

          {/* Movie details section */}
          <section>
            <div className="rating">
              {/* If movie is not watched, show rating interface */}
              {!isWatched ? (
                <>
                  {/* Star rating component (1-10 stars) */}
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetMovieRating={setUserRating}
                  />
                  {/* Show "Add to list" button only after user has rated */}
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                /* If movie is already watched, show previous rating */
                <p>
                  You rated this movie {watchedUserRating} <span>🌟</span>
                </p>
              )}
            </div>
            {/* Movie plot/summary */}
            <p>
              <em>{plot}</em>
            </p>
            {/* Cast information */}
            <p>Starring {actors}</p>
            {/* Director information */}
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
