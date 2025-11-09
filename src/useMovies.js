/**
 * useMovies - Custom React Hook for Movie Search
 * 
 * This custom hook handles fetching movies from the OMDb API based on a search query.
 * It provides a clean interface for components to search for movies with built-in
 * loading states, error handling, and request cancellation.
 * 
 * Features:
 * - Debounced search (only searches when query is 3+ characters)
 * - Loading state management
 * - Error handling
 * - Request cancellation (aborts previous requests when query changes)
 * - Optional callback function (e.g., to close movie details when searching)
 * 
 * @param {string} query - The search query string
 * @param {Function} callback - Optional callback function to execute when query changes
 * @returns {Object} Object containing movies array, isLoading boolean, and error string
 * 
 * @example
 * const { movies, isLoading, error } = useMovies("inception", handleCloseMovie);
 */

import { useEffect, useState } from "react";

// OMDb API key for movie search
// Note: In production, this should be in an environment variable
const key = "99496f8d";

/**
 * Custom hook to fetch movies from OMDb API
 * 
 * How it works:
 * 1. Listens for changes in the query parameter
 * 2. Only fetches if query is 3+ characters (reduces unnecessary API calls)
 * 3. Cancels previous requests when query changes (prevents race conditions)
 * 4. Manages loading and error states
 * 5. Returns movies, loading state, and error state
 * 
 * @param {string} query - Search query string
 * @param {Function} callback - Optional callback to execute when query changes
 * @returns {Object} { movies: Array, isLoading: boolean, error: string }
 */
export function useMovies(query, callback) {
  // State to store the fetched movies array
  const [movies, setMovies] = useState([]);
  
  // State to track if movies are currently being fetched
  const [isLoading, setIsLoading] = useState(false);
  
  // State to store any error messages from the API
  const [error, setError] = useState(null);

  /**
   * Effect that runs whenever the query changes
   * 
   * This effect:
   * - Calls the optional callback (e.g., to close movie details)
   * - Creates an AbortController to cancel requests
   * - Fetches movies from API if query is valid
   * - Cleans up by aborting the request if component unmounts or query changes
   */
  useEffect(
    function () {
      // Execute callback if provided (e.g., close movie details when searching)
      // Optional chaining (?.) safely calls callback only if it exists
      callback?.();

      // Create AbortController to cancel fetch requests
      // This prevents race conditions when user types quickly
      // Old requests are cancelled when a new one starts
      const controller = new AbortController();

      /**
       * Async function to fetch movies from OMDb API
       * 
       * Why async/await instead of .then()?
       * - More readable and easier to handle errors
       * - Better error handling with try/catch
       */
      async function fetchMovies() {
        try {
          // Set loading state to true (shows loading spinner)
          setIsLoading(true);
          // Clear any previous errors
          setError("");

          // Fetch movies from OMDb API
          // 's' parameter is for search query
          // signal: controller.signal allows us to cancel the request
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );

          // Check if the HTTP response was successful
          // If not, throw an error
          if (!response.ok)
            throw new Error("Something went wrong with fetching movies");

          // Parse the JSON response
          const data = await response.json();
          
          // OMDb API returns { Response: "False" } when no movies are found
          // Check for this and throw an error
          if (data.Response === "False") throw new Error("Movie not found");

          // If successful, set the movies array
          // data.Search contains the array of movies
          setMovies(data.Search);

          // Note: We don't need to clear error here because we already set it to ""
          // at the start of the function. This ensures errors are cleared before
          // each new search attempt.
        } catch (error) {
          // Only set error if it's not an AbortError
          // AbortError occurs when we cancel a request (which is expected behavior)
          // We don't want to show an error message for cancelled requests
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          // Always set loading to false, even if there was an error
          // This ensures the loading spinner is hidden
          setIsLoading(false);
        }
      }

      // Don't search if query is less than 3 characters
      // This reduces unnecessary API calls and improves performance
      // Also provides better UX (no flickering results while typing)
      if (query.length < 3) {
        setMovies([]);  // Clear movies
        setError("");   // Clear errors
        return;         // Exit early
      }

      // Fetch movies for the current query
      fetchMovies();

      // Cleanup function: runs when component unmounts or query changes
      // This cancels the ongoing request to prevent memory leaks and race conditions
      return function () {
        controller.abort();
      };
    },
    [query] // Only run effect when query changes
    // Note: callback is intentionally not in dependencies
    // This prevents infinite loops if callback is recreated on each render
  );

  // Return movies, loading state, and error state
  // Components can destructure these values: { movies, isLoading, error }
  return { movies, isLoading, error };
}
