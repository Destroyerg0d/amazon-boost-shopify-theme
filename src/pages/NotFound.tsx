import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Premium floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="text-center relative z-10 glass-card p-12 rounded-2xl border-primary/20 backdrop-blur-xl shadow-strong">
        <div className="mb-6">
          <h1 className="text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">404</h1>
          <div className="flex justify-center mb-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-accent rounded-full animate-sparkle"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-sparkle" style={{ animationDelay: '1s' }}></div>
              <div className="w-3 h-3 bg-secondary rounded-full animate-sparkle" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
        <p className="text-2xl text-primary-foreground/80 mb-8">Oops! Page not found</p>
        <p className="text-primary-foreground/60 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-8 py-3 bg-gradient-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all shadow-soft hover:shadow-medium"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
