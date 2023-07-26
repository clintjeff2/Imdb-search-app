import {useState, useEffect} from 'react'

function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function() {
    const storedValue = localStorage.getItem(key);

    return JSON.parse(storedValue) || initialState;
  })

  useEffect(function() {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

export {useLocalStorageState}