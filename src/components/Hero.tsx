import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Amazon Success Strategy" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Proven Amazon Success Strategies</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Dominate Amazon with 
            <span className="bg-gradient-accent bg-clip-text text-transparent"> Expert</span> Strategies
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Comprehensive strategies to enhance product visibility, boost reviews, and skyrocket your Amazon sales with proven methods used by top sellers.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="accent" size="lg" className="text-lg px-8 py-4">
              Get Your Free Strategy Call
              <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20">
              View Case Studies
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="font-semibold">500+ Successful Sellers</span>
            </div>
            <div className="text-2xl font-bold">
              $50M+ <span className="text-lg font-normal opacity-80">in Client Revenue Generated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};