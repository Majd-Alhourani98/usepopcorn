import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";

import StartRating from "./StartRating";

function Test() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <StartRating
        messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
        onSetMovieRating={setMovieRating}
      />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>
);
