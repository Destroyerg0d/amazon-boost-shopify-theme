import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingCart, 
  UserPlus, 
  FileCheck, 
  Target, 
  Mail, 
  Clock, 
  Star, 
  BarChart3 
} from "lucide-react";

interface TimelineStep {
  id: number;
  icon: any;
  title: string;
  description: string;
}

export const AuthorJourney = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const steps: TimelineStep[] = [
    {
      id: 1,
      icon: ShoppingCart,
      title: "Author Places an Order",
      description: "The author selects and purchases a review package (verified or unverified)."
    },
    {
      id: 2,
      icon: UserPlus,
      title: "Creates an Author Dashboard Account",
      description: "Immediately after purchase, the author is prompted to create a dedicated account to track review progress and submit books."
    },
    {
      id: 3,
      icon: FileCheck,
      title: "Submits Book for Verification",
      description: "The author uploads their manuscript. Our team reviews the book for credibility, quality, and compliance before it's shared with readers."
    },
    {
      id: 4,
      icon: Target,
      title: "Book is Approved & Genre Matched",
      description: "Once approved, the book is intelligently matched with interested ARC readers based on genre preferences."
    },
    {
      id: 5,
      icon: Mail,
      title: "Review Invitations Sent to Readers",
      description: "Relevant readers from our vetted ARC community are offered the book. Only those genuinely interested will accept to review."
    },
    {
      id: 6,
      icon: Clock,
      title: "Waiting Period Begins",
      description: "The author now waits as per the selected turnaround time. Duration depends on the book's word count and review type (verified/unverified)."
    },
    {
      id: 7,
      icon: Star,
      title: "Reviews Start Coming In",
      description: "Reviews are posted to Amazon gradually and organically, starting within the defined timeframe."
    },
    {
      id: 8,
      icon: BarChart3,
      title: "Track Progress in Dashboard",
      description: "The author can monitor review activity, track progress, and get updates in real time through their account dashboard."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisibleSteps(prev => [...new Set([...prev, stepId])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements = document.querySelectorAll('[data-step]');
    stepElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
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
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Author Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Path to Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Follow the complete journey from purchase to reviews with our streamlined process
          </p>
        </div>

        {/* S-Curve Timeline */}
        <div ref={timelineRef} className="relative max-w-6xl mx-auto">
          {/* SVG S-Curve Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 800 1600"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M 150 50 Q 400 100 400 250 Q 400 400 650 450 Q 400 500 400 650 Q 400 800 150 850 Q 400 900 400 1050 Q 400 1200 650 1250 Q 400 1300 400 1450 Q 400 1550 650 1600"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              fill="none"
              className="drop-shadow-soft"
            />
          </svg>

          {/* Timeline Steps */}
          <div className="relative space-y-32 py-12">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              const isVisible = visibleSteps.includes(step.id);
              const StepIcon = step.icon;

              return (
                <div
                  key={step.id}
                  data-step={step.id}
                  className={`relative flex items-center ${
                    isLeft ? 'justify-start pl-8' : 'justify-end pr-8'
                  }`}
                >
                  {/* Content Card */}
                  <Card
                    className={`glass-card w-80 transform transition-all duration-700 ease-out border-primary/30 ${
                      isVisible
                        ? 'translate-x-0 opacity-100'
                        : isLeft
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                    } hover:shadow-glow hover:scale-105`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                            <StepIcon className="w-6 h-6 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Center Node */}
                  <div
                    className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 delay-300 ${
                      isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full border-4 border-background shadow-strong flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {step.id}
                        </span>
                      </div>
                      {/* Pulse animation */}
                      <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-success/20 backdrop-blur-sm border border-success/30 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Ready to Start?</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Join thousands of successful authors who've transformed their book's visibility
          </p>
        </div>
      </div>
    </section>
  );
};