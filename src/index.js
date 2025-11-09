/**
 * index.js - Application Entry Point
 * 
 * This is the main entry point of the React application.
 * It renders the root App component into the DOM.
 * 
 * What happens here:
 * 1. Imports React and ReactDOM
 * 2. Imports global CSS styles
 * 3. Imports the main App component
 * 4. Gets the root DOM element (div with id="root" in public/index.html)
 * 5. Renders the App component wrapped in StrictMode
 * 
 * StrictMode:
 * - Helps identify potential problems in the application
 * - Highlights deprecated features and unsafe lifecycles
 * - Double-invokes certain functions to detect side effects
 * - Only runs in development mode, not in production
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Get the root DOM element from public/index.html
// This is where our React app will be rendered
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component
// StrictMode wraps the app to help catch potential issues during development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
