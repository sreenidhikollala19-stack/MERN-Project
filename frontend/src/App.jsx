import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CompareDrawer from './components/CompareDrawer';

// Pages
import Home from './pages/Home';
import ExploreServices from './pages/ExploreServices';
import SearchResults from './pages/SearchResults';
import VendorProfile from './pages/VendorProfile';
import CompareVendors from './pages/CompareVendors';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CompareProvider>
          <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-slate-800">
            {/* Global Toaster */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '16px',
                  background: '#0F172A',
                  color: '#fff',
                  fontSize: '13px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                },
                success: {
                  iconTheme: {
                    primary: '#D97706',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Navbar />

            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<ExploreServices />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/vendors/:id" element={<VendorProfile />} />
                <Route path="/compare" element={<CompareVendors />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Role Protected Dashboard Routes */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['vendor']}>
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <CompareDrawer />
            <Footer />
          </div>
        </CompareProvider>
      </AuthProvider>
    </Router>
  );
}

