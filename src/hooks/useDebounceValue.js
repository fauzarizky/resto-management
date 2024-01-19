import { useEffect, useState } from "react";

export const useDebounceValue = (value, time = 350) => {
  const [debounceValue, setDebounceValue] = useState(value);

  // useEffect hook to manage the debouncing logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, time);

    // Clean up function: clears the timer if the value or time changes before the timer expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, time]);

  return debounceValue;
};
