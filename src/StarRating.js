/**
 * StarRating - Interactive Star Rating Component
 * 
 * A reusable star rating component that allows users to rate items by clicking stars.
 * Features hover effects, customizable appearance, and optional message display.
 * 
 * Features:
 * - Clickable stars for rating
 * - Hover effects (shows temporary rating on hover)
 * - Customizable number of stars, color, and size
 * - Optional custom messages for each rating level
 * - Callback function to notify parent component of rating changes
 * - Accessible (uses role="button" for screen readers)
 * 
 * @component
 * @description Interactive star rating component with hover effects
 */

import { useState } from "react";

// Inline styles for the container
// Using inline styles for component-specific styling
const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px", // Space between stars and text
};

// Inline styles for the star container
const starContainerStyle = {
  display: "flex", // Display stars in a row
};

/**
 * StarRating Component
 * 
 * Main component that renders a set of clickable stars for rating.
 * 
 * How it works:
 * 1. Renders a specified number of stars (default: 5)
 * 2. User can click a star to set a rating
 * 3. Hovering over stars shows a temporary rating (preview)
 * 4. Moving mouse away resets to the actual rating
 * 5. Can display custom messages or numeric rating
 * 
 * @param {Object} props - Component props
 * @param {number} props.maxRating - Maximum number of stars (default: 5)
 * @param {string} props.color - Color of the stars (default: "#fcc419" - gold)
 * @param {number} props.size - Size of stars in pixels (default: 24)
 * @param {string} props.className - Additional CSS classes
 * @param {string[]} props.messages - Optional array of messages for each rating level
 * @param {number} props.defaultRating - Initial rating value (default: 3)
 * @param {Function} props.onSetMovieRating - Callback function called when rating changes
 * 
 * @example
 * <StarRating
 *   maxRating={10}
 *   size={24}
 *   onSetMovieRating={(rating) => console.log(rating)}
 * />
 */
function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 24,
  className = "",
  messages = [],
  defaultRating = 3,
  onSetMovieRating,
}) {
  // State for the current rating (the actual selected rating)
  const [rating, setRating] = useState(defaultRating);
  
  // State for temporary rating (shown on hover)
  // When user hovers over stars, this shows what rating they're about to select
  // When they move mouse away, it resets to 0 and shows the actual rating
  const [tempRating, setTempRating] = useState(0);

  /**
   * Handles when a star is clicked
   * 
   * @param {number} rating - The rating value (1 to maxRating)
   * 
   * Updates both local state and calls the parent callback if provided
   */
  function handleRating(rating) {
    setRating(rating);
    // Optional chaining (?.) safely calls the callback only if it exists
    // This allows the component to work with or without a callback
    onSetMovieRating?.(rating);
  }

  // Dynamic style for the rating text
  // Font size is calculated based on star size for proportional scaling
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color: color,
    fontSize: `${size - 8}px`, // Slightly smaller than stars
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Container for all the stars */}
      <div style={starContainerStyle}>
        {/* Create an array of stars based on maxRating */}
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            // If user is hovering, show tempRating; otherwise show actual rating
            // Check if star at index i+1 should be filled
            isFull={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            color={color}
            size={size}
            // When star is clicked, set rating to i+1 (stars are 1-indexed)
            onRating={() => handleRating(i + 1)}
            // When hovering over a star, set tempRating to i+1
            onHoverIn={() => setTempRating(i + 1)}
            // When mouse leaves, reset tempRating to 0
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>

      {/* Display rating text or message */}
      <p style={textStyle}>
        {/* If custom messages are provided and match maxRating, show message */}
        {/* Otherwise, show the numeric rating */}
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1] // Array is 0-indexed
          : tempRating || rating || ""} {/* Show tempRating if hovering, otherwise rating */}
      </p>
    </div>
  );
}

/**
 * Star Component
 * 
 * Individual star element that can be clicked or hovered over.
 * 
 * Features:
 * - Filled star (when selected/hovered) or empty star (when not selected)
 * - Click handler to set rating
 * - Hover handlers to show preview rating
 * - Accessible (role="button" for screen readers)
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isFull - Whether the star should be filled or empty
 * @param {string} props.color - Color of the star
 * @param {number} props.size - Size of the star in pixels
 * @param {Function} props.onRating - Callback when star is clicked
 * @param {Function} props.onHoverIn - Callback when mouse enters star
 * @param {Function} props.onHoverOut - Callback when mouse leaves star
 */
function Star({ isFull, color, size, onRating, onHoverIn, onHoverOut }) {
  // Inline styles for the star container
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer", // Show pointer cursor on hover
  };
  
  return (
    <span
      style={starStyle}
      role="button" // Accessibility: indicate this is a clickable element
      aria-label={isFull ? "Filled star" : "Empty star"} // Accessibility: describe the star
      onClick={onRating}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {/* Render filled star if isFull is true, otherwise render empty star */}
      {isFull ? (
        // Filled star SVG (solid fill)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        // Empty star SVG (outline only)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

export default StarRating;

/*
FULL STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>


EMPTY STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#000"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>

*/
