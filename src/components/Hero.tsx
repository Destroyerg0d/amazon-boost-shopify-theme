import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [animatedTexts, setAnimatedTexts] = useState<string[]>([]);
  const [showMainContent, setShowMainContent] = useState(false);
  const [goldStars, setGoldStars] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  
  const heroTexts = [
    "Dominate Amazon Search Results",
    "Beat Competition", 
    "Reach Audience",
    "Get Reviews Dominance",
    "Create a Best Seller",
    "Become a Success Story"
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    // Generate gold stars positions
    const stars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setGoldStars(stars);
    
    // Animate texts sequentially without duplication
    let textIndex = 0;
    const textInterval = setInterval(() => {
      if (textIndex < heroTexts.length) {
        setAnimatedTexts(prev => [...prev, heroTexts[textIndex]]);
        textIndex++;
      } else {
        clearInterval(textInterval);
        // Show main content after text animation
        setTimeout(() => setShowMainContent(true), 500);
      }
    }, 400);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Premium Gold Stars Animation */}
      <div className="absolute inset-0 z-5">
        {goldStars.map((star) => (
          <div
            key={star.id}
            className="absolute animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: '3s'
            }}
          >
            <Star 
              className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-sparkle" 
              style={{ animationDelay: `${star.delay}s` }}
            />
          </div>
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-hero opacity-95"></div>
        
        {/* Premium Floating Elements */}
        <div className="absolute inset-0">
          {/* Floating Books with Enhanced Animation */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`book-${i}`}
              className="absolute opacity-10 animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.5}s`,
                transform: `translateY(${scrollY * 0.1 * (i + 1)}px)`,
              }}
            >
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
          ))}
          
          {/* Premium Review Stars Animation */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute opacity-20 animate-bounce"
              style={{
                left: `${5 + i * 12}%`,
                top: `${10 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            >
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            </div>
          ))}
          
          {/* Floating Orbs for Premium Feel */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"
              style={{
                width: `${20 + i * 10}px`,
                height: `${20 + i * 10}px`,
                left: `${80 - i * 20}%`,
                top: `${15 + i * 20}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">1M+ Active ARC Readers Community</span>
          </div>
          
          {/* Animated Text Lines */}
          <div className="mb-8 space-y-2">
            {animatedTexts.map((text, index) => (
              <div
                key={text}
                className="text-2xl md:text-4xl font-bold animate-slide-in-right opacity-0"
                style={{
                  animationDelay: `${index * 0.3}s`,
                  animationFillMode: 'forwards'
                }}
              >
                {index === 4 ? (
                  <span className="bg-gradient-accent bg-clip-text text-transparent">{text}</span>
                ) : (
                  text
                )}
              </div>
            ))}
          </div>
          
          {/* Main Headline - Show after text animation */}
          {showMainContent && (
            <>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in">
                Get Authentic Book Reviews from Our 
                <span className="bg-gradient-success bg-clip-text text-transparent"> Million+ Reader</span> Community
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Built through Facebook and Google advertising, our verified ARC community delivers honest, authentic reviews to help your book succeed on Amazon.
              </p>
              
              {/* Auth Section */}
              <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                {user ? (
                  <div className="flex items-center gap-4 bg-background/10 backdrop-blur-sm rounded-full px-6 py-3">
                    <span className="text-sm text-primary-foreground/80">
                      Welcome, {user.email}
                    </span>
                    <Button variant="outline" size="sm" onClick={signOut} className="bg-background/20 border-primary-foreground/20 text-primary-foreground hover:bg-background/30">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20">
                    Sign In / Sign Up
                  </Button>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="text-lg px-8 py-4 hover:scale-105 transition-transform duration-200"
                  onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
                >
                  {user ? 'Go to Dashboard' : 'Get Reviews Now'}
                  <ArrowRight className="ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20 hover:scale-105 transition-transform duration-200"
                  onClick={() => navigate('/community-signup')}
                >
                  View Our Community
                </Button>
              </div>
              
              {/* Social Proof with Premium Animation */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-primary-foreground/80 animate-fade-in" style={{ animationDelay: '1.2s' }}>
                <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" 
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">10,000+ Books Reviewed</span>
                </div>
                <div className="text-2xl font-bold hover:scale-105 transition-transform duration-200">
                  1M+ <span className="text-lg font-normal opacity-80">Active ARC Readers</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};