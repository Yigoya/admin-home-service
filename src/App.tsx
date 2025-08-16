import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/users/CustomersPage';
import RegisterTechnicianPage from './pages/users/RegisterTechnicianPage';
import RegisterOperatorPage from './pages/users/RegisterOperatorPage';
import ServicesPage from './pages/services/ServicesPage';
import './App.css';
import TechniciansPage from './pages/users/TechniciansPage';
import OperatorsPage from './pages/users/OperatorsPage';
import BookingsPage from './pages/bookings/BookingsPage';
import BookingDetailsPage from './pages/bookings/BookingDetailsPage';

// Create a client
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Users */}
        <Route path="/users">
          <Route index element={<Navigate to="/users/customers" replace />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="technicians" element={<TechniciansPage />} />
          <Route path="technicians/register" element={<RegisterTechnicianPage />} />
          <Route path="operators" element={<OperatorsPage />} />
          <Route path="operators/register" element={<RegisterOperatorPage />} />
          <Route path="pending-verifications" element={<div>Pending Verifications</div>} />
        </Route>
        
        {/* Services */}
        <Route path="/services" element={<ServicesPage />} />
        
        {/* Bookings */}
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/admin/bookings/:id" element={<BookingDetailsPage />} />
        
        {/* Disputes */}
        <Route path="/disputes" element={<div>Disputes Management</div>} />
        
        {/* Tenders */}
        <Route path="/tenders" element={<div>Tenders Management</div>} />
        
        {/* Businesses */}
        <Route path="/businesses" element={<div>Businesses Management</div>} />
        
        {/* Settings */}
        <Route path="/settings" element={<div>Settings</div>} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App; 