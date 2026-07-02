// ============================================================
// Hook to redirect unauthenticated users to the login page
// ============================================================
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * Redirects to /rh/login if the user is not authenticated.
 * Returns true if authenticated, false otherwise.
 */
export const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/rh/login');
    }
  }, [navigate]);

  return authService.isAuthenticated();
};
