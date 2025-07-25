import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

// ProtectedRoute component to verify authentication and role
const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const { user, loading } = useSelector(state => state.auth);
  const [isVerifying, setIsVerifying] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const previousUser = useRef(user);

  useEffect(() => {
    // Simulate token verification
    const verifyToken = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found');
        }

        // In a real app, you might want to verify the token with the server here
        // For now, we'll just check if it exists and if the user is in Redux state

        // Verification complete
        setIsVerifying(false);
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, []);

  // Handle user state changes (including logout)
  useEffect(() => {
    // If user was previously logged in and now is null (logout scenario)
    if (previousUser.current && !user && !loading) {
      // Add a small delay to allow any logout animations to complete
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 100);

      return () => clearTimeout(timer);
    }

    // Update previous user reference
    previousUser.current = user;
  }, [user, loading]);

  // Show loading spinner while verifying
  if (loading || isVerifying) {
    return <LoadingSpinner />;
  }

  // If user is not authenticated, redirect to login
  if (!user || shouldRedirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user's actual role
    if (user.role === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else {
      const userId = user._id || user.id;
      return <Navigate to={`/business/${userId}`} replace />;
    }
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;