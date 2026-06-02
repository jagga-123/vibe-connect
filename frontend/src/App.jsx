import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages Import
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route: Redirects unauthorized users to Login
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <h3>Loading your vibe...</h3>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

// Public Route: Redirects authenticated users to Feed
const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return null;

  return !token ? children : <Navigate to="/" replace />;
};

function AppContent() {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('vibeconnect_theme') || 'dark';
  });

  // Sync theme with HTML data-theme attribute for custom CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('vibeconnect_theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Material UI Custom Theme setup to match Glassmorphism styles
  const muiTheme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#06B6D4',
      },
      secondary: {
        main: '#8B5CF6',
      },
      background: {
        default: 'transparent',
        paper: themeMode === 'dark' ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.7)',
      },
      text: {
        primary: themeMode === 'dark' ? '#F8FAFC' : '#0F172A',
        secondary: themeMode === 'dark' ? '#94A3B8' : '#475569',
      },
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: 'var(--bg-color)',
          },
          '#root': {
            minHeight: '100vh',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Protected Social Feed */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Feed themeMode={themeMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          {/* Protected Profile Page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile themeMode={themeMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          {/* Public Auth Pages */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
