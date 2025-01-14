import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const ThemeContext = createContext();

// Custom Hook for using theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider Component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    // Apply the background color based on the darkMode value
    if (darkMode) {
      document.body.style.backgroundColor = '#121212'; // Dark background
    } else {
      document.body.style.backgroundColor = '#f5f5f5'; // Light background
    }
    
    // Save dark mode to localStorage to persist across sessions
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
