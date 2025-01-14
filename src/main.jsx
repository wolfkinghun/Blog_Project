import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { CategProvider } from './context/Context.jsx';
import { ConfirmProvider } from 'material-ui-confirm';
import { ThemeProvider } from './context/ThemeContext'; // Import the ThemeProvider

createRoot(document.getElementById('root')).render(
  <ConfirmProvider>
    <CategProvider>
      <UserProvider>
        <ThemeProvider> {/* Wrap everything with ThemeProvider */}
          <App />
        </ThemeProvider>
      </UserProvider>
    </CategProvider>
  </ConfirmProvider>
);
