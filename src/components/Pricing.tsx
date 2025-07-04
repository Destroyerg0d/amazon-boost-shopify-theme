import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Calculator, Clock, CheckCircle, Star, Video, Camera } from "lucide-react";

export const Pricing = () => {
  const [wordCount, setWordCount] = useState<number>(50000);
  
  const calculateTurnaroundTime = (baseTime: number, words: number) => {
    const extraWords = Math.max(0, words - 5000);
    const extraDays = Math.ceil(extraWords / 5000);
    return baseTime + extraDays;
  };

  const packages = [
    {
      name: "Starter Trial",
      reviews: "10 reviews",
      originalPrice: 160,
      discountedPrice: 120,
      discount: "25% OFF",
      baseTurnaround: 3,
      features: [
        "Written reviews only",
        "Verified purchase reviews",
        "Genre-matched readers",
        "Quality guarantee"
      ]
    },
    {
      name: "Bronze Package",
      reviews: "20–25 reviews",
      originalPrice: 320,
      discountedPrice: 250,
      discount: "22% OFF",
      baseTurnaround: 3,
      features: [
        "Written reviews only",
        "Verified purchase reviews",
        "Genre-matched readers",
        "Quality guarantee",
        "Review analytics"
      ]
    },
    {
      name: "Silver Package",
      reviews: "45–50 reviews",
      originalPrice: 620,
      discountedPrice: 500,
      discount: "19% OFF",
      baseTurnaround: 3,
      features: [
        "Written reviews only",
        "Verified purchase reviews",
        "Genre-matched readers",
        "Quality guarantee",
        "Review analytics",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Gold Package",
      reviews: "95–100 reviews",
      originalPrice: 920,
      discountedPrice: 750,
      discount: "18% OFF",
      baseTurnaround: 3,
      features: [
        "Written reviews only",
        "Verified purchase reviews",
        "Genre-matched readers",
        "Quality guarantee",
        "Review analytics",
        "Priority support",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Advanced Review Packages</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Review Package
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get authentic, honest reviews from our verified ARC community. All packages include quality guarantee and genre-matched readers.
          </p>
        </div>

        {/* Review Type Tabs */}
        <Tabs defaultValue="written" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="written" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Written Reviews
            </TabsTrigger>
            <TabsTrigger value="video" disabled className="gap-2 opacity-50">
              <Video className="w-4 h-4" />
              Video Reviews
            </TabsTrigger>
            <TabsTrigger value="photo" disabled className="gap-2 opacity-50">
              <Camera className="w-4 h-4" />
              Photo Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="written" className="space-y-8">
            {/* Turnaround Calculator */}
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Turnaround Time Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="wordCount">Book Word Count</Label>
                  <Input
                    id="wordCount"
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(parseInt(e.target.value) || 0)}
                    placeholder="Enter word count"
                    className="mt-1"
                  />
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Clock className="w-4 h-4" />
                    Estimated Turnaround: {calculateTurnaroundTime(3, wordCount)} days
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Base 3 days + 1 day per 5,000 words above 5,000
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg, index) => (
                <Card key={index} className={`relative ${pkg.popular ? 'border-accent shadow-medium' : ''} hover:shadow-soft transition-all`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">
                      ${pkg.discountedPrice}
                      <div className="text-sm text-muted-foreground line-through">
                        ${pkg.originalPrice}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {pkg.discount}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="font-semibold text-lg">{pkg.reviews}</p>
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4" />
                        {calculateTurnaroundTime(pkg.baseTurnaround, wordCount)} days turnaround
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={pkg.popular ? "accent" : "default"} 
                      className="w-full"
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="video" className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Video review packages will be available soon. Stay tuned for exciting visual review options!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="photo" className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Photo review packages will be available soon. Get ready for engaging visual reviews!
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Trust Indicators */}
        <div className="text-center mt-16">
          <div className="flex flex-wrap justify-center gap-6 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Quality Guarantee
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Verified Readers
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Genre Matching
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              No Fake Reviews
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};