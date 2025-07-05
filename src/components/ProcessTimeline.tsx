import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, Search, BookOpen, Users, TrendingUp } from "lucide-react";

export const ProcessTimeline = () => {
  const steps = [
    {
      icon: Mail,
      title: "Author buys a plan",
      description: "Choose from our verified or unverified review packages"
    },
    {
      icon: Search,
      title: "We verify book authenticity & credibility",
      description: "Our team reviews your book for quality and authenticity"
    },
    {
      icon: BookOpen,
      title: "Book is matched to relevant ARC readers",
      description: "Smart genre matching to connect with interested readers"
    },
    {
      icon: Users,
      title: "Readers voluntarily accept & review the book",
      description: "Genuine readers choose books they want to read and review"
    },
    {
      icon: TrendingUp,
      title: "Reviews are delivered within guaranteed timeline",
      description: "Honest, authentic reviews posted according to your package timeline"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-success/10 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Proven Review Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From purchase to delivery, we ensure authentic reviews through our verified process.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-primary/20 z-0"></div>
                )}
                
                {/* Step Card */}
                <Card className="relative z-10 hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <step.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="mt-2 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};