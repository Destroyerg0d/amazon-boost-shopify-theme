import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { BookOpen, Users, TrendingUp, ChevronDown } from "lucide-react";

export const ReaderCommunity = () => {
  const [animatedCounts, setAnimatedCounts] = useState<{ [key: string]: number }>({});
  const [countsVisible, setCountsVisible] = useState(false);

  const categoryData = {
    "📖 Fiction": [
      { name: "Romance", percentage: 13, readers: 130000 },
      { name: "Mystery, Thriller & Suspense", percentage: 12, readers: 120000 },
      { name: "Science Fiction & Fantasy", percentage: 10, readers: 100000 },
      { name: "Literature & Fiction", percentage: 5, readers: 50000 },
      { name: "Teen & Young Adult", percentage: 5, readers: 50000 },
      { name: "Comics & Manga", percentage: 4, readers: 40000 },
      { name: "LGBTQIA+ (Fiction)", percentage: 2, readers: 20000 }
    ],
    "🧠 Nonfiction": [
      { name: "Self-Help", percentage: 7, readers: 70000 },
      { name: "Biographies & Memoirs", percentage: 4, readers: 40000 },
      { name: "Business & Money", percentage: 4, readers: 40000 },
      { name: "Health, Fitness & Dieting", percentage: 3, readers: 30000 },
      { name: "Religion & Spirituality", percentage: 3, readers: 30000 },
      { name: "History", percentage: 3, readers: 30000 },
      { name: "Politics & Social Sciences", percentage: 2, readers: 20000 },
      { name: "Education & Teaching", percentage: 2, readers: 20000 },
      { name: "Science & Math", percentage: 2, readers: 20000 },
      { name: "Computers & Technology", percentage: 2, readers: 20000 },
      { name: "Law", percentage: 1, readers: 10000 },
      { name: "Medical Books", percentage: 1, readers: 10000 },
      { name: "Reference", percentage: 1, readers: 10000 },
      { name: "Parenting & Relationships", percentage: 1, readers: 10000 },
      { name: "Humor & Entertainment", percentage: 1, readers: 10000 },
      { name: "Arts & Photography", percentage: 1, readers: 10000 },
      { name: "Travel", percentage: 1, readers: 10000 },
      { name: "Crafts, Hobbies & Home", percentage: 1, readers: 10000 },
      { name: "Calendars", percentage: 0.5, readers: 5000 },
      { name: "Engineering & Transportation", percentage: 0.5, readers: 5000 }
    ],
    "🍳 Cookbooks, Food & Wine": [
      { name: "All Categories", percentage: 3, readers: 30000 }
    ],
    "👶 Children's Books": [
      { name: "All Categories", percentage: 6, readers: 60000 }
    ],
    "📝 Shorts & Kindle Singles": [
      { name: "All Categories", percentage: 1.5, readers: 15000 }
    ],
    "🌐 Diverse Voices Categories": [
      { name: "All Categories", percentage: 2, readers: 20000 }
    ],
    "📚 Other / Unlisted / Niche": [
      { name: "All Categories", percentage: 1.5, readers: 15000 }
    ]
  };

  const animateCounter = (targetValue: number, key: string) => {
    let current = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(timer);
      }
      setAnimatedCounts(prev => ({ ...prev, [key]: Math.floor(current) }));
    }, 30);
  };

  useEffect(() => {
    // Trigger count animations when component mounts
    setTimeout(() => {
      setCountsVisible(true);
      Object.entries(categoryData).forEach(([category, subcategories]) => {
        subcategories.forEach((sub, index) => {
          setTimeout(() => {
            animateCounter(sub.readers, `${category}-${sub.name}`);
          }, index * 200);
        });
      });
    }, 1000);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
            <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-accent' : i % 3 === 1 ? 'bg-primary' : 'bg-secondary'}`} />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Our Reader Community</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            1 Million+ Verified ARC Readers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Built through strategic Facebook and Google advertising, our community represents authentic readers across every genre and category.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="glass-card text-center p-6 border-primary/30 hover:shadow-glow transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">10,000+</h3>
            <p className="text-muted-foreground">Books Successfully Reviewed</p>
          </Card>
          <Card className="glass-card text-center p-6 border-accent/30 hover:shadow-glow transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">1M+</h3>
            <p className="text-muted-foreground">Active Reader Community</p>
          </Card>
          <Card className="glass-card text-center p-6 border-success/30 hover:shadow-glow transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center shadow-glow">
                <TrendingUp className="w-6 h-6 text-success-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">30+</h3>
            <p className="text-muted-foreground">Genre Categories Covered</p>
          </Card>
        </div>

        {/* Reader Demographics Accordion */}
        <Card className="glass-card border-primary/30 shadow-glow overflow-hidden">
          <CardHeader className="bg-gradient-card">
            <CardTitle className="text-2xl font-bold text-center text-foreground">Reader Demographics by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="multiple" className="space-y-4">
              {Object.entries(categoryData).map(([category, subcategories]) => (
                <AccordionItem key={category} value={category} className="border border-primary/20 rounded-lg glass-card mb-2">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline glass-hover">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg font-semibold text-foreground">{category}</span>
                      <div className="flex items-center gap-4 mr-4">
                        <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 backdrop-blur-sm">
                          {subcategories.reduce((sum, sub) => sum + sub.percentage, 0)}%
                        </Badge>
                        <span className="font-bold text-accent">
                          {formatNumber(subcategories.reduce((sum, sub) => sum + sub.readers, 0))}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3">
                      {subcategories.map((subcategory, index) => (
                        <div 
                          key={subcategory.name}
                          className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-primary/10"
                        >
                          <span className="font-medium text-foreground">{subcategory.name}</span>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                              {subcategory.percentage}%
                            </Badge>
                            <span className="font-semibold text-accent min-w-[80px] text-right">
                              {countsVisible 
                                ? formatNumber(animatedCounts[`${category}-${subcategory.name}`] || 0)
                                : "0"
                              }
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {/* Total Summary */}
            <div className="mt-6 p-4 bg-gradient-accent rounded-lg border border-accent/30 shadow-glow">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-accent-foreground">Total Community</span>
                <div className="flex items-center gap-4">
                  <Badge className="bg-accent text-accent-foreground shadow-glow">100%</Badge>
                  <span className="text-2xl font-bold text-accent-foreground">1,000,000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};