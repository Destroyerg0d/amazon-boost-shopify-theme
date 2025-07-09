import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Star, Users, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [animatedTexts, setAnimatedTexts] = useState<string[]>([]);
  
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
    
    // Animate texts on load - only once
    if (animatedTexts.length === 0) {
      heroTexts.forEach((text, index) => {
        setTimeout(() => {
          setAnimatedTexts(prev => [...prev, text]);
        }, index * 300);
      });
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animatedTexts.length]);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-hero opacity-95"></div>
        
        {/* Floating Books Animation */}
        <div className="absolute inset-0">
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
        </div>

        {/* Floating Stars Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute animate-star-twinkle"
              style={{
                left: `${5 + i * 8}%`,
                top: `${10 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <Star className="w-3 h-3 text-accent fill-accent opacity-60" />
            </div>
          ))}
        </div>

        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute animate-sparkle"
              style={{
                left: `${15 + i * 12}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            >
              <Sparkles className="w-4 h-4 text-accent opacity-40" />
            </div>
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
          
          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: '2s' }}>
            Get Authentic Book Reviews from Our 
            <span className="bg-gradient-success bg-clip-text text-transparent"> Million+ Reader</span> Community
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '2.5s' }}>
            Built through Facebook and Google advertising, our verified ARC community delivers honest, authentic reviews to help your book succeed on Amazon.
          </p>
          
          {/* Auth Section */}
          <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '2.8s' }}>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '3s' }}>
            <Button 
              variant="accent" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
            >
              {user ? 'Go to Dashboard' : 'Get Reviews Now'}
              <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20">
              View Our Community
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-primary-foreground/80 animate-fade-in" style={{ animationDelay: '3.5s' }}>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 fill-accent text-accent animate-star-twinkle" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="font-semibold">10,000+ Books Reviewed</span>
            </div>
            <div className="text-2xl font-bold">
              1M+ <span className="text-lg font-normal opacity-80">Active ARC Readers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};