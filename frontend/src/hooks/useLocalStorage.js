import { useState, useEffect } from 'react';

const PREFIX = 'personal-collection.';

// TODO: expire session
function getSavedValue(key, initialValue) {
  const parsedValue = JSON.parse(localStorage.getItem(key));
  if (parsedValue != null) return parsedValue;

  if (typeof initialValue === 'function') {
    return initialValue();
  } else {
    return initialValue;
  }
}

export default function useLocalStorage(key, intialValue) {
  const prefixedKey = `${PREFIX}.${key}`;
  const [value, setValue] = useState(() => {
    return getSavedValue(prefixedKey, intialValue);
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  return [value, setValue];
}
