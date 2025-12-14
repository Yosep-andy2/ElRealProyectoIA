import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import DocumentDetail from './pages/DocumentDetail';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="library" element={<Library />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="documents/:id" element={<DocumentDetail />} />
                </Route>
              </Routes>
            </Router>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
