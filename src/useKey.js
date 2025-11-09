/**
 * useKey - Custom React Hook for Keyboard Event Handling
 * 
 * This custom hook provides a clean way to listen for specific keyboard presses
 * and execute actions when those keys are pressed. It handles event listener
 * setup and cleanup automatically.
 * 
 * Features:
 * - Listens for specific key presses
 * - Automatically cleans up event listeners
 * - Case-insensitive key matching
 * - Easy to use in any component
 * 
 * Why use this hook?
 * - Manual event listener management is tedious
 * - Easy to forget to clean up listeners (memory leaks)
 * - This hook handles setup and cleanup automatically
 * - Provides a clean, reusable API
 * 
 * @param {string} key - The key code to listen for (e.g., "Enter", "Escape")
 * @param {Function} action - Function to execute when the key is pressed
 * 
 * @example
 * // Close movie details when Escape is pressed
 * useKey("Escape", onCloseMovie);
 * 
 * @example
 * // Focus search input when Enter is pressed
 * useKey("Enter", () => {
 *   inputRef.current.focus();
 * });
 */

import { useEffect } from "react";

/**
 * Custom hook to listen for keyboard key presses
 * 
 * How it works:
 * 1. Adds a keydown event listener to the document
 * 2. When the specified key is pressed, executes the action function
 * 3. Automatically removes the event listener on unmount or when dependencies change
 * 
 * Key matching:
 * - Uses event.code (e.g., "Enter", "Escape", "KeyA")
 * - Case-insensitive comparison
 * - Matches exact key codes
 * 
 * Cleanup:
 * - Automatically removes event listener to prevent memory leaks
 * - Runs cleanup when component unmounts or dependencies change
 * 
 * @param {string} key - The key code to listen for (e.g., "Enter", "Escape")
 * @param {Function} action - Function to execute when key is pressed
 * 
 * @example
 * useKey("Escape", () => console.log("Escape pressed!"));
 */
export function useKey(key, action) {
  /**
   * Effect that sets up and cleans up the keyboard event listener
   * 
   * This effect:
   * - Creates a callback function that checks if the pressed key matches
   * - Adds the event listener to the document
   * - Returns a cleanup function that removes the listener
   * 
   * Why document.addEventListener?
   * - Listens for keyboard events anywhere on the page
   * - Works even when focus is not on a specific element
   * - Global keyboard shortcuts
   */
  useEffect(
    function () {
      /**
       * Callback function that handles keyboard events
       * 
       * @param {KeyboardEvent} e - The keyboard event object
       */
      function callback(e) {
        // Compare the pressed key with the target key
        // Use toLowerCase() for case-insensitive matching
        // e.code gives us the physical key code (e.g., "Enter", "Escape")
        if (e.code.toLowerCase() === key.toLowerCase()) {
          // Execute the action function when key matches
          action();
        }
      }

      // Add event listener to document
      // Listens for keydown events (key is pressed down)
      document.addEventListener("keydown", callback);

      // Cleanup function: removes event listener
      // This prevents memory leaks and ensures we don't have multiple listeners
      // Runs automatically when:
      // - Component unmounts
      // - key or action dependencies change
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [key, action] // Re-run effect if key or action changes
  );
}
