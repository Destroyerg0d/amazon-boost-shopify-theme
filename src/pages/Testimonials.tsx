import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsPage = () => {
  const testimonials = [
    {
      name: "Maya Thompson",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2e6ae95?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Lovable helped me reach real readers effortlessly!"
    },
    {
      name: "Rajeev Deshmukh", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "My book reviews skyrocketed in a week!"
    },
    {
      name: "Anita Borges",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", 
      rating: 5,
      review: "I never imagined getting such helpful feedback."
    },
    {
      name: "Omar Alvi",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Perfect for new authors like me. Recommended!"
    },
    {
      name: "Jessica Miller",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Finally a place where reviews feel authentic."
    },
    {
      name: "Carlos Rodriguez",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "The best platform for indie authors to get noticed!"
    },
    {
      name: "Sarah Kim",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Quality reviews that actually helped improve my writing."
    },
    {
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Fantastic service with genuine reader feedback."
    },
    {
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Helped me understand my target audience better."
    },
    {
      name: "David Park",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Professional and thorough review process."
    },
    {
      name: "Lisa Garcia",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Great platform for getting honest feedback on manuscripts."
    },
    {
      name: "James Wright",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Exceeded my expectations with quality reviews."
    },
    {
      name: "Rachel Green",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "The reviews were detailed and constructive."
    },
    {
      name: "Alex Johnson",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Amazing service that helped launch my book successfully."
    },
    {
      name: "Sophia Martinez",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Professional reviewers who understand the market."
    },
    {
      name: "Daniel Lee",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Top-notch service with quick turnaround times."
    },
    {
      name: "Amanda Taylor",
      image: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Helpful feedback that improved my storytelling."
    },
    {
      name: "Robert Brown",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Excellent platform for connecting with readers."
    },
    {
      name: "Kelly Davis",
      image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Great way to get unbiased opinions on my work."
    },
    {
      name: "Thomas White",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Highly recommend for any serious author."
    },
    {
      name: "Jennifer Clark",
      image: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Quality reviews that helped refine my manuscript."
    },
    {
      name: "Mark Anderson",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Outstanding service with professional reviewers."
    },
    {
      name: "Nancy Lopez",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      review: "Helped me identify weak points in my story."
    },
    {
      name: "Christopher Moore",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Perfect for getting honest reader perspectives."
    },
    {
      name: "Helen Zhang",
      image: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review: "Transformed my manuscript with insightful feedback."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            What Authors Say About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of successful authors who have transformed their books with our review platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-strong transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-muted-foreground/30" />
                  ))}
                </div>
                
                {/* Review Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.review}"
                </p>
                
                {/* Author */}
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;