import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authApi';

/**
 * Wraps any route that requires authentication.
 * If no JWT is present, redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
