import React, { createContext, useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'

// Create Context
const ThemeContext = createContext()

// Custom Hook for using theme context
export const useTheme = () => useContext(ThemeContext)

// ThemeProvider Component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true")

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <motion.div
        key={darkMode ? 'dark' : 'light'}
        initial={{ opacity: 0 }} // Fade-in starts from 0
        animate={{
          opacity: 1, 
          backgroundColor: darkMode ? '#121212' : '#f5f5f5'
        }}
        transition={{
          opacity: { duration: 0.6 }, // Slow fade-in effect
          backgroundColor: { duration: 1 } // Longer background color transition
        }}
        style={{
          minHeight: '100vh',
          width: '100%',
          transition: 'background-color 1s ease', // Slow background color transition
        }}
      >
        {children}
      </motion.div>
    </ThemeContext.Provider>
  )
}
