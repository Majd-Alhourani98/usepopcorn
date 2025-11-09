/**
 * useLocalStorage - Custom React Hook for LocalStorage Synchronization
 * 
 * This custom hook provides a way to store state in the browser's localStorage
 * and automatically sync it. It works just like useState, but persists data
 * across page refreshes.
 * 
 * Features:
 * - Automatically loads initial value from localStorage on mount
 * - Automatically saves to localStorage whenever value changes
 * - Works seamlessly with React state updates
 * - Handles JSON serialization/deserialization automatically
 * 
 * Why use this hook?
 * - Regular useState doesn't persist data across page refreshes
 * - Manual localStorage.setItem/getItem is tedious and error-prone
 * - This hook provides a clean API that works like useState
 * 
 * @param {any} initialState - Initial value if nothing is stored in localStorage
 * @param {string} key - localStorage key to store the value under
 * @returns {Array} [value, setValue] - Same API as useState
 * 
 * @example
 * const [watched, setWatched] = useLocalStorage([], "watched");
 * // Now watched movies persist across page refreshes!
 */

import { useState, useEffect } from "react";

/**
 * Custom hook to synchronize state with localStorage
 * 
 * How it works:
 * 1. On initial render, checks localStorage for existing value
 * 2. If found, uses that value; otherwise uses initialState
 * 3. Whenever value changes, automatically saves to localStorage
 * 4. Returns [value, setValue] just like useState
 * 
 * Important notes:
 * - The value must be JSON-serializable (objects, arrays, primitives)
 * - Functions cannot be stored in localStorage
 * - Updates are synchronous (no async operations)
 * 
 * @param {any} initialState - Default value if localStorage is empty
 * @param {string} key - Key to store value in localStorage
 * @returns {Array} [value, setValue] - Same as useState hook
 */
export function useLocalStorage(initialState, key) {
  /**
   * Initialize state from localStorage
   * 
   * We use a function in useState() to compute the initial value
   * This function only runs once on mount (lazy initialization)
   * 
   * Why use a function?
   * - localStorage.getItem() is synchronous but can be expensive
   * - Using a function ensures it only runs when needed
   * - Prevents unnecessary computations on every render
   */
  const [value, setValue] = useState(function () {
    // Try to get the stored value from localStorage
    const storedValue = localStorage.getItem(key);
    
    // If a value exists, parse it from JSON and use it
    // Otherwise, use the provided initialState
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  /**
   * Effect to save value to localStorage whenever it changes
   * 
   * This effect runs after every render where 'value' or 'key' changes
   * 
   * Important: We don't need to manually create a new array like [...watched, movie]
   * because this effect runs AFTER the state has already been updated.
   * The 'value' parameter here is already the new state value.
   * 
   * Why useEffect?
   * - We want to save to localStorage after state updates
   * - useEffect runs after the DOM has been updated
   * - This ensures we're always saving the latest state
   */
  useEffect(
    function () {
      // Save the current value to localStorage
      // JSON.stringify converts the value to a string
      // We spread the value into an array to ensure it's an array
      // (This works for arrays; for objects, you'd use {...value})
      localStorage.setItem(key, JSON.stringify([...value]));
    },
    [value, key] // Run effect when value or key changes
  );

  // Return the same API as useState
  // This makes it a drop-in replacement for useState
  return [value, setValue];
}
