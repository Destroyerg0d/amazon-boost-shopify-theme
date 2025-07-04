import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      business: "Premium Kitchen Accessories",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2e6ae95?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "In just 6 months, our product visibility increased by 340% and we went from struggling to break even to generating $50K monthly revenue. The review strategies alone transformed our business.",
      results: "340% visibility increase, $50K monthly revenue"
    },
    {
      name: "Michael Rodriguez",
      business: "Sports & Fitness Equipment",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The team's expertise in Amazon PPC and keyword optimization helped us reduce our advertising costs by 60% while doubling our sales. Their strategies are game-changing.",
      results: "60% lower ad costs, 2x sales growth"
    },
    {
      name: "Emily Thompson",
      business: "Home & Garden Products",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "From 20 reviews to over 500 positive reviews in 4 months. The systematic approach to review acquisition and management completely transformed our product credibility.",
      results: "From 20 to 500+ reviews in 4 months"
    },
    {
      name: "David Park",
      business: "Electronics & Tech",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Their competitor analysis revealed opportunities we never knew existed. We launched 3 new products based on their insights and each one hit bestseller status within weeks.",
      results: "3 bestselling product launches"
    },
    {
      name: "Lisa Anderson",
      business: "Beauty & Personal Care",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The brand protection strategies saved us from counterfeit sellers and helped us maintain premium pricing. Our profit margins increased by 45% while sales volume grew.",
      results: "45% higher profit margins"
    },
    {
      name: "James Wilson",
      business: "Automotive Accessories",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Outstanding results! Their systematic approach to Amazon optimization took us from page 3 to the first page for our main keywords. Sales increased by 8x in the first quarter.",
      results: "8x sales increase in Q1"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Real Results from Real Sellers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join hundreds of successful Amazon sellers who transformed their business with our proven strategies.
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative group hover:shadow-soft transition-all duration-300 bg-card">
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
                  {testimonial.results}
                </div>
                
                {/* Author */}
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
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