import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Ava Mitchell",
      business: "Author, 'The Clarity Code'",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2e6ae95?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Within 6 weeks, I had over 45 honest reviews across multiple Amazon regions. That credibility bump alone pushed me into the Top 20 of my category. This ARC community is gold.",
      results: "+45 verified reviews, category rank jump",
      package: "Silver Package (Verified Reviews)",
      badge: "🏷 Silver Plan (Verified)"
    },
    {
      name: "Isabella Moore",
      business: "Romance Writer, Kindle Unlimited",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I've never seen such engagement. Readers not only left thoughtful reviews but also shared excerpts on social media. My downloads went up 300% in 2 months.",
      results: "300% boost in downloads",
      package: "Bronze Package (Unverified Reviews + Text Only)",
      badge: "🏷 Bronze Plan (Unverified)"
    },
    {
      name: "Daniel Reyes",
      business: "Author, 'Neon Dreams'",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "As a debut author, building credibility was everything. The unverified text reviews helped me get 50+ early opinions and built momentum for launch day.",
      results: "50+ early reviews, successful launch",
      package: "Silver Package (Unverified Reviews – Prelaunch)",
      badge: "🏷 Silver Plan (Unverified)"
    },
    {
      name: "Liam Harris",
      business: "Publisher – Productivity Books",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "We bought the 95-review Gold Package for a new productivity title and were amazed by how genuine the reviews felt. Sales doubled after week 3.",
      results: "95 verified reviews, 2x weekly sales",
      package: "Gold Package (Verified Reviews)",
      badge: "🏷 Gold Plan (Verified)"
    },
    {
      name: "Maya Thompson",
      business: "Children's Book Author",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Verified reviews were posted consistently over 10 days, just like promised. We hit Amazon's 'Hot New Releases' badge within the first week.",
      results: "Hit Hot New Release badge",
      package: "Starter Trial (Verified Reviews – Launch Support)",
      badge: "🏷 Starter Plan (Verified)"
    },
    {
      name: "Jaxon Lee",
      business: "Author of 'Thorneborn Chronicles'",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I used their text + image review bundle for my fantasy series relaunch. The reader quality was insane. 4.9-star avg across 3 books.",
      results: "4.9-star average, 3-book series",
      package: "Silver Package (Unverified Reviews – Bundle)",
      badge: "🏷 Silver Plan (Bundle)"
    }
  ];

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
            <div className={`w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-accent' : i % 3 === 1 ? 'bg-primary' : 'bg-secondary'}`} />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Real Results from Real Authors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join hundreds of successful authors who transformed their book success with our ARC community.
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card relative group hover:shadow-glow transition-all duration-300 border-primary/30">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-accent mb-4 opacity-50" />
                
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                {/* Results Badge */}
                <div className="bg-success/10 text-success border border-success/20 rounded-full px-3 py-1 text-xs font-medium mb-4 inline-block">
                  🟢 {testimonial.results}
                </div>
                
                {/* Package Badge */}
                <div className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium mb-4 inline-block">
                  📦 Plan Used: {testimonial.package}
                </div>
                
                {/* Plan Badge */}
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground">{testimonial.badge}</span>
                </div>
                
                {/* Author */}
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-foreground">👤 {testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};