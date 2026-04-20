import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { FamiliesPage } from './pages/FamiliesPage';
import { FamilyDetailPage } from './pages/FamilyDetailPage';
import { ProtectedRoute } from './guards/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0D4A2A', // Verde ReViDa
    },
    secondary: {
      main: '#1B6B3A',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/families"
            element={
              <ProtectedRoute>
                <FamiliesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/families/:id"
            element={
              <ProtectedRoute>
                <FamilyDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;