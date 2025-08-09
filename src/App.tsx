import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useReferralTracking } from "@/hooks/useReferralTracking";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Affiliate from "./pages/Affiliate";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/TermsOfService";
import ShippingPolicy from "./pages/ShippingPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CommunitySignup from "./pages/CommunitySignup";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import { HelpCenter } from "./pages/HelpCenter";
import { Community } from "./pages/Community";
import { HelpArticle } from "./pages/HelpArticle";
import { CommunityPost } from "./pages/CommunityPost";
import { CommunityNew } from "./pages/CommunityNew";
import BooksList from "./pages/BooksList";
import { HelmetProvider } from "react-helmet-async";
import DefaultSEO from "@/components/DefaultSEO";

const queryClient = new QueryClient();

const AppContent = () => {
  useReferralTracking(); // Initialize referral tracking
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/shipping-policy" element={<ShippingPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/community-signup" element={<CommunitySignup />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/help/article/:id" element={<HelpArticle />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/post/:id" element={<CommunityPost />} />
      <Route 
        path="/community/new" 
        element={
          <ProtectedRoute>
            <CommunityNew />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/books" 
        element={
          <ProtectedRoute>
            <BooksList 
              onBack={() => window.history.back()} 
              onAddBook={() => window.location.href = '/dashboard?tab=books&action=add'} 
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/thank-you" 
        element={
          <ProtectedRoute>
            <ThankYou />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <RoleProtectedRoute requiredRole="admin">
            <Admin />
          </RoleProtectedRoute>
        } 
      />
      <Route 
        path="/affiliate" 
        element={
          <ProtectedRoute>
            <Affiliate />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HelmetProvider>
          <BrowserRouter>
            <DefaultSEO />
            <AppContent />
          </BrowserRouter>
        </HelmetProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
