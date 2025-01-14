import React, { useEffect, useContext } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { AddEditPost } from './pages/AddEditPost';
import { PwReset } from './pages/PwReset';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Header } from './components/Header';
import { NotFound } from './pages/NotFound';
import { Posts } from './pages/Posts';
import { Auth } from './pages/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import Detail from './pages/Detail';
import { ThemeProvider, useTheme } from './context/ThemeContext';  // Import ThemeProvider and useTheme

const router = createBrowserRouter([
  {
    element: <Header />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/posts', element: <Posts /> },
      { path: '/detail/:id', element: <Detail /> },
      { path: '/create', element: <AddEditPost /> },
      { path: '/update/:id', element: <AddEditPost /> },
      { path: '/auth/in', element: <Auth /> },
      { path: '/auth/up', element: <Auth /> },
      { path: '/pwreset', element: <PwReset /> },
      { path: '/profile', element: <Profile /> },
      { path: '/admin', element: <Admin /> },
      { path: '*', element: <NotFound /> },
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true,
    v7_fetcherPersist: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  }
});

function App() {
  const { darkMode } = useTheme(); // Access darkMode from context

  // Ensure the correct class is added to the body for dark/light mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ThemeProvider>
  );
}

export default App;
