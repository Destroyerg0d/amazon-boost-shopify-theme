import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, TrendingUp, Zap, Search, Users } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Eye,
      title: "Product Visibility Optimization",
      description: "Advanced SEO strategies, keyword optimization, and listing enhancements to make your products discoverable by your ideal customers.",
      features: ["Keyword Research & Analysis", "Listing Optimization", "A+ Content Creation", "Backend Search Terms"]
    },
    {
      icon: MessageSquare,
      title: "Review Management System",
      description: "Comprehensive review acquisition and management strategies to build trust and improve your product rankings.",
      features: ["Review Campaign Setup", "Automated Follow-ups", "Feedback Management", "Review Analysis"]
    },
    {
      icon: TrendingUp,
      title: "Sales Growth Acceleration",
      description: "Data-driven strategies to increase conversion rates, boost sales velocity, and maximize your profit margins.",
      features: ["Conversion Optimization", "Pricing Strategy", "Inventory Management", "Sales Analytics"]
    },
    {
      icon: Search,
      title: "Amazon PPC Management",
      description: "Expert advertising campaigns that reduce ACoS while maximizing visibility and profitable growth.",
      features: ["Campaign Setup", "Bid Optimization", "Keyword Expansion", "Performance Tracking"]
    },
    {
      icon: Zap,
      title: "Brand Protection",
      description: "Comprehensive brand protection strategies to maintain your reputation and market position on Amazon.",
      features: ["Brand Registry Setup", "Counterfeit Monitoring", "IP Protection", "Brand Analytics"]
    },
    {
      icon: Users,
      title: "Competitor Analysis",
      description: "In-depth competitive intelligence to identify opportunities and stay ahead of market trends.",
      features: ["Market Research", "Competitor Tracking", "Pricing Analysis", "Opportunity Identification"]
    }
  ];

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-15"
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
            Comprehensive Amazon Success Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proven strategies have helped hundreds of sellers achieve consistent growth and dominate their Amazon categories.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="glass-card relative group hover:shadow-glow transition-all duration-300 border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow">
                  <service.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4">
            Start Your Amazon Success Journey
          </Button>
        </div>
      </div>
    </section>
  );
};