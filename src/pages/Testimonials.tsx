import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsPage = () => {
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
    },
    {
      name: "Carlos Rodriguez",
      business: "Self-Published Author",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The best platform for indie authors to get noticed! Professional reviewers who understand the market and provide genuine feedback.",
      results: "Top 10 in category",
      package: "Gold Package (Premium Reviews)",
      badge: "🏷 Gold Plan (Premium)"
    },
    {
      name: "Sarah Kim",
      business: "YA Fiction Author",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      text: "Quality reviews that actually helped improve my writing. The feedback was constructive and the reviews authentic.",
      results: "Improved craft & sales",
      package: "Bronze Package (Development Reviews)",
      badge: "🏷 Bronze Plan (Development)"
    },
    {
      name: "Michael Chen",
      business: "Business Book Author",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Fantastic service with genuine reader feedback. My book's credibility improved dramatically with quality reviews.",
      results: "500% increase in sales",
      package: "Silver Package (Business Reviews)",
      badge: "🏷 Silver Plan (Business)"
    },
    {
      name: "Emma Wilson",
      business: "Historical Fiction Writer",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      text: "Helped me understand my target audience better. The reviews provided insights I couldn't get anywhere else.",
      results: "Better audience targeting",
      package: "Bronze Package (Insight Reviews)",
      badge: "🏷 Bronze Plan (Insights)"
    },
    {
      name: "David Park",
      business: "Sci-Fi Author",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Professional and thorough review process. The quality of feedback exceeded my expectations completely.",
      results: "Award nomination",
      package: "Gold Package (Professional Reviews)",
      badge: "🏷 Gold Plan (Professional)"
    },
    {
      name: "Lisa Garcia",
      business: "Memoir Writer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      text: "Great platform for getting honest feedback on manuscripts. Helped refine my story before publication.",
      results: "Refined storytelling",
      package: "Bronze Package (Manuscript Reviews)",
      badge: "🏷 Bronze Plan (Manuscript)"
    },
    {
      name: "James Wright",
      business: "Thriller Author",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Exceeded my expectations with quality reviews. The engagement and detail in each review was remarkable.",
      results: "Genre bestseller list",
      package: "Gold Package (Premium Thriller Reviews)",
      badge: "🏷 Gold Plan (Thriller)"
    },
    {
      name: "Rachel Green",
      business: "Poetry Author",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      text: "The reviews were detailed and constructive. Perfect for understanding how readers connect with poetry.",
      results: "Literary award winner",
      package: "Silver Package (Poetry Reviews)",
      badge: "🏷 Silver Plan (Poetry)"
    },
    {
      name: "Alex Johnson",
      business: "Fantasy Author",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Amazing service that helped launch my book successfully. The community truly understands fantasy readers.",
      results: "Successful series launch",
      package: "Gold Package (Fantasy Community)",
      badge: "🏷 Gold Plan (Fantasy)"
    },
    {
      name: "Sophia Martinez",
      business: "Self-Help Author",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      text: "Professional reviewers who understand the market. Their insights helped position my book perfectly.",
      results: "Market positioning success",
      package: "Silver Package (Self-Help Reviews)",
      badge: "🏷 Silver Plan (Self-Help)"
    },
    {
      name: "Daniel Lee",
      business: "Technical Author",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Top-notch service with quick turnaround times. Perfect for technical books that need expert review.",
      results: "Industry recognition",
      package: "Gold Package (Technical Reviews)",
      badge: "🏷 Gold Plan (Technical)"
    },
    {
      name: "Amanda Taylor",
      business: "Contemporary Fiction",
      image: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      text: "Helpful feedback that improved my storytelling. The quality of reviews matched my expectations perfectly.",
      results: "Improved storytelling",
      package: "Bronze Package (Fiction Development)",
      badge: "🏷 Bronze Plan (Development)"
    },
    {
      name: "Robert Brown",
      business: "Non-Fiction Author",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Excellent platform for connecting with readers. The community engagement was beyond what I expected.",
      results: "Strong reader community",
      package: "Silver Package (Community Building)",
      badge: "🏷 Silver Plan (Community)"
    },
    {
      name: "Kelly Davis",
      business: "Biography Writer",
      image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      text: "Great way to get unbiased opinions on my work. The feedback helped me understand my audience better.",
      results: "Better audience connection",
      package: "Bronze Package (Audience Research)",
      badge: "🏷 Bronze Plan (Research)"
    },
    {
      name: "Thomas White",
      business: "Adventure Author",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Highly recommend for any serious author. The quality and authenticity of reviews is unmatched.",
      results: "Series contract signed",
      package: "Gold Package (Adventure Reviews)",
      badge: "🏷 Gold Plan (Adventure)"
    },
    {
      name: "Jennifer Clark",
      business: "Horror Author",
      image: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=150&h=150&fit=crop&crop=face",
      rating: 4,
      text: "Quality reviews that helped refine my manuscript. The horror community here really understands the genre.",
      results: "Genre recognition",
      package: "Silver Package (Horror Community)",
      badge: "🏷 Silver Plan (Horror)"
    },
    {
      name: "Mark Anderson",
      business: "Mystery Author",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Outstanding service with professional reviewers. Perfect for mystery authors who need discerning feedback.",
      results: "Mystery award finalist",
      package: "Gold Package (Mystery Reviews)",
      badge: "🏷 Gold Plan (Mystery)"
    },
    {
      name: "Helen Zhang",
      business: "Literary Fiction Author",
      image: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Transformed my manuscript with insightful feedback. The literary community here is incredibly sophisticated.",
      results: "Literary prize winner",
      package: "Gold Package (Literary Reviews)",
      badge: "🏷 Gold Plan (Literary)"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Real Results from Real Authors
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join hundreds of successful authors who transformed their book success with our ARC community.
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
    </div>
  );
};

export default TestimonialsPage;