import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Star, Users, Sparkles, TrendingUp, Award, Zap, HelpCircle, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export const Hero = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(0);
  
  const slogans = [
    { text: "Dominate Amazon Search Results", icon: TrendingUp },
    { text: "Beat Your Competition", icon: Award },
    { text: "Reach Million+ Readers", icon: Users },
    { text: "Get Reviews Dominance", icon: Star },
    { text: "Create a Best Seller", icon: BookOpen },
    { text: "Become a Success Story", icon: Sparkles }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    // Initial load animation
    setTimeout(() => setIsLoaded(true), 300);
    
    // Cycle through slogans
    const sloganInterval = setInterval(() => {
      setCurrentSlogan(prev => (prev + 1) % slogans.length);
    }, 3000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(sloganInterval);
    };
  }, []);

  const CurrentIcon = slogans[currentSlogan].icon;

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-slate-900">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-900/50 to-transparent" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 w-full">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">ReviewProMax</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/help')}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help Center
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/community')}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Community
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('#pricing')}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Pricing
              </Button>
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              {user ? (
                <Button 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className={`w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-yellow-400' : i % 3 === 1 ? 'bg-blue-400' : 'bg-purple-400'}`} />
          </div>
        ))}
      </div>

      {/* Premium Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Books */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`book-${i}`}
            className="absolute opacity-10 animate-float"
            style={{
              left: `${5 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`,
              transform: `translateY(${scrollY * 0.05 * (i + 1)}px) rotate(${i * 15}deg)`,
            }}
          >
            <BookOpen className="w-6 h-6 text-white/30" />
          </div>
        ))}
        
        {/* Glowing Orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${30 + i * 15}px`,
              height: `${30 + i * 15}px`,
              left: `${80 - i * 15}%`,
              top: `${10 + i * 15}%`,
              background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(147, 51, 234, 0.3)'} 0%, transparent 70%)`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: '6s'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="container mx-auto px-6 relative z-10">
          <div className="w-full max-w-6xl mx-auto">
            {/* Split Layout */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className={`text-white transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white/90">1M+ Active ARC Readers</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>

              {/* Dynamic Slogan */}
              <div className="mb-6 h-20 flex items-center">
                <div className="flex items-center gap-4 text-4xl md:text-5xl font-bold">
                  <CurrentIcon className="w-12 h-12 text-yellow-400 animate-pulse" />
                  <span 
                    key={currentSlogan}
                    className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-in-right"
                  >
                    {slogans[currentSlogan].text}
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Get Authentic
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                  Book Reviews
                </span>
                <span className="block text-4xl md:text-5xl text-white/90">
                  from Our Million+ Reader Community
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-lg">
                Built through Facebook and Google advertising, our verified ARC community delivers 
                <span className="text-yellow-400 font-semibold"> honest, authentic reviews</span> to help your book succeed on Amazon.
              </p>

              {/* Auth Section */}
              <div className="mb-8">
                {user ? (
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/90 font-medium">
                      Welcome back, {user.email?.split('@')[0]}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={signOut} 
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/auth')} 
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-2xl px-6 py-3"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Sign In / Sign Up
                  </Button>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300"
                  onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {user ? 'Go to Dashboard' : 'Get Reviews Now'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg" 
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/community-signup')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  View Our Community
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-white">10,000+ Books Reviewed</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-lg font-bold text-white">1M+ Active Readers</span>
                </div>
              </div>

              {/* Affiliate CTA */}
              <div className="mt-8 p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white text-lg font-bold">💰 Earn with ReviewProMax</span>
                </div>
                <p className="text-white/90 text-base mb-4 leading-relaxed">
                  <span className="font-semibold text-green-400">20% commission rate</span> • 
                  <span className="font-semibold text-blue-400"> Real-time tracking</span> • 
                  <span className="font-semibold text-purple-400"> Monthly payouts</span>
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  onClick={() => navigate('/affiliate')}
                >
                  Join Affiliate Program →
                </Button>
              </div>
            </div>

            {/* Right Visual Section */}
            <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              
              {/* Central Glowing Card */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
                
                <div className="relative z-10">
                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-1">1M+</div>
                      <div className="text-sm text-white/70">ARC Readers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">10K+</div>
                      <div className="text-sm text-white/70">Books Reviewed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-1">4.9</div>
                      <div className="text-sm text-white/70">Avg Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-1">24h</div>
                      <div className="text-sm text-white/70">Response Time</div>
                    </div>
                  </div>

                  {/* Sample Review Card */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-white/90 text-sm font-medium">Verified Reader</span>
                    </div>
                    <p className="text-white/80 text-sm italic">
                      "Absolutely loved this book! The characters were so well-developed and the plot kept me hooked until the very end. Highly recommend!"
                    </p>
                    <div className="mt-3 text-white/60 text-xs">
                      - Sarah M., Verified ARC Reader
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements around the card */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`float-${i}`}
                  className="absolute animate-bounce"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${5 + (i % 2) * 80}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3s'
                  }}
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};