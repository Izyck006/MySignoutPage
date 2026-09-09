import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CookieConsent from "./components/CookieConsent";

// Statically import core entry points
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Lazy load heavy 3D components and secondary pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PublicSignOutPage = lazy(() => import("./pages/PublicSignOutPage"));
const TermsOfService = lazy(() => import("./pages/Legal/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/Legal/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/Legal/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback UI
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
    <p className="text-gray-500 font-medium">Preparing your shirt...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <CookieConsent />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/:slug" element={<PublicSignOutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
