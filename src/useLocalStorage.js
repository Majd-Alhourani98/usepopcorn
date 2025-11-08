import { useState, useEffect } from "react";

export function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    // we do not have to create any new array [...watched, movie] becuase the effect will run after watched is laready the new state
    function () {
      localStorage.setItem(key, JSON.stringify([...value]));
    },
    [value, key]
  );

  return [value, setValue];
}
