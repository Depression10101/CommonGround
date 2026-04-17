import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { initializeDefaultUsers } from './data/defaultUsers';
import { initializeDefaultReviews } from './data/defaultReviews';

export default function App() {
  useEffect(() => {
    // Initialize default users and reviews on app load
    initializeDefaultUsers();
    initializeDefaultReviews();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}