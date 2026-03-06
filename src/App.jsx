import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "./ThemeContext";
import LinkToast from "./components/LinkToast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SettingsPage from "./pages/Settings";
import Billing from "./pages/Billing";
import Features from "./pages/Features";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function PrivateRoute({ children, session }) {
  if (session === undefined) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 dark:text-white">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const location = useLocation();
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <LinkToast />
      <Navbar session={session} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home session={session} /></PageWrapper>} />
          <Route path="/features" element={<PageWrapper><Features /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><Pricing session={session} /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
          <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="/dashboard" element={
            <PrivateRoute session={session}>
              <PageWrapper><Dashboard session={session} /></PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute session={session}>
              <PageWrapper><SettingsPage session={session} /></PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/billing" element={
            <PrivateRoute session={session}>
              <PageWrapper><Billing session={session} /></PageWrapper>
            </PrivateRoute>
          } />
        </Routes>
      </AnimatePresence>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
