import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { Calculator, Clock, CheckCircle, Star, Video, Camera, Shield, Zap, Info, AlertTriangle } from "lucide-react";
import { PayPalButton } from "./PayPalButton";
import { useAuth } from "@/hooks/useAuth";

export const Pricing = () => {
  const { user } = useAuth();
  const [wordCount, setWordCount] = useState<number>(50000);
  const [bookPrice, setBookPrice] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<'verified' | 'unverified'>('verified');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
  const [showBookPriceDialog, setShowBookPriceDialog] = useState<boolean>(false);
  const [hasShownPriceDialog, setHasShownPriceDialog] = useState<boolean>(false);
  
  const calculateTurnaroundTime = (baseTime: number, words: number) => {
    const extraWords = Math.max(0, words - 5000);
    const extraDays = Math.ceil(extraWords / 5000);
    return baseTime + extraDays;
  };

  const handleBookPriceDialogOpen = () => {
    if (!hasShownPriceDialog) {
      setShowBookPriceDialog(true);
      setHasShownPriceDialog(true);
    }
  };

  const packages = {
    verified: [
      {
        name: "Starter Trial",
        reviews: "10 reviews",
        originalPrice: 230,
        discountedPrice: 170,
        discount: "26% OFF",
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
        originalPrice: 450,
        discountedPrice: 350,
        discount: "22% OFF",
        baseTurnaround: 5,
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
        originalPrice: 870,
        discountedPrice: 700,
        discount: "20% OFF",
        baseTurnaround: 8,
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
        originalPrice: 1290,
        discountedPrice: 1050,
        discount: "19% OFF",
        baseTurnaround: 15,
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
    ],
    unverified: [
      {
        name: "Starter Trial",
        reviews: "10 reviews",
        originalPrice: 170,
        discountedPrice: 130,
        discount: "24% OFF",
        baseTurnaround: 2,
        features: [
          "Text reviews only",
          "Fast delivery",
          "Genre-matched readers",
          "Quality guarantee"
        ]
      },
      {
        name: "Bronze Package",
        reviews: "20–25 reviews",
        originalPrice: 280,
        discountedPrice: 230,
        discount: "18% OFF",
        baseTurnaround: 3,
        features: [
          "Text reviews only",
          "Fast delivery",
          "Genre-matched readers",
          "Quality guarantee",
          "Review analytics"
        ]
      },
      {
        name: "Silver Package",
        reviews: "45–50 reviews",
        originalPrice: 560,
        discountedPrice: 450,
        discount: "20% OFF",
        baseTurnaround: 5,
        features: [
          "Text reviews only",
          "Fast delivery",
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
        originalPrice: 980,
        discountedPrice: 790,
        discount: "19% OFF",
        baseTurnaround: 8,
        features: [
          "Text reviews only",
          "Fast delivery",
          "Genre-matched readers",
          "Quality guarantee",
          "Review analytics",
          "Priority support",
          "Dedicated account manager"
        ]
      }
    ]
  };

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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Get authentic, honest reviews from our verified ARC community. All packages include quality guarantee and genre-matched readers.
          </p>
          
          {/* Important Cost Notice for Verified Reviews */}
          {selectedType === 'verified' && (
            <Alert className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-left">
                <div className="space-y-2">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    💡 Important: Total Cost for Verified Reviews
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    <strong>Your total payment = Plan Cost + Book Purchase Cost</strong>
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    📊 <strong>Use the Investment Calculator below first</strong> to determine your total cost before purchasing. This helps you budget for both the service fee and book copies our reviewers will purchase.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Review Type Selection */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {/* Verified Reviews Card */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-medium ${
                selectedType === 'verified' ? 'border-success shadow-soft bg-success/5' : ''
              }`}
              onClick={() => setSelectedType('verified')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">✅ Verified Reviews</h3>
                    <p className="text-sm text-muted-foreground">Amazon verified purchase</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Text Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Video Reviews (Coming Soon)</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">Image Reviews (Coming Soon)</span>
                  </div>
                </div>
                
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Higher credibility & trust</li>
                  <li>• Amazon algorithm boost</li>
                  <li>• Verified purchase badge</li>
                  <li>• Premium pricing</li>
                </ul>
                
                {selectedType === 'verified' && (
                  <div className="mt-4 text-center">
                    <Badge className="bg-success text-success-foreground">Selected</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Unverified Reviews Card */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-medium ${
                selectedType === 'unverified' ? 'border-primary shadow-soft bg-primary/5' : ''
              }`}
              onClick={() => setSelectedType('unverified')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">🔓 Unverified Reviews</h3>
                    <p className="text-sm text-muted-foreground">Fast & affordable</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Text Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Video Reviews (Coming Soon)</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">Image Reviews (Coming Soon)</span>
                  </div>
                </div>
                
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Faster delivery</li>
                  <li>• Budget-friendly pricing</li>
                  <li>• Great for pre-launch</li>
                  <li>• Build initial momentum</li>
                </ul>
                
                {selectedType === 'unverified' && (
                  <div className="mt-4 text-center">
                    <Badge className="bg-primary text-primary-foreground">Selected</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review Type Tabs */}
        <Tabs defaultValue="text" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="text" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Text Reviews
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

          <TabsContent value="text" className="space-y-8">
            {/* Calculators */}
            <div className={`grid gap-6 max-w-4xl mx-auto mb-8 ${selectedType === 'verified' ? 'md:grid-cols-2' : 'justify-center'}`}>
              {/* Turnaround Calculator */}
              <Card className={selectedType === 'unverified' ? 'max-w-md mx-auto' : ''}>
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
                      Estimated Turnaround: {calculateTurnaroundTime(packages[selectedType][0].baseTurnaround, wordCount)} days
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Base {packages[selectedType][0].baseTurnaround} days + 1 day per 5,000 words above 5,000
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Calculator for Verified Reviews */}
              {selectedType === 'verified' && (
                <div className="max-w-4xl mx-auto">
                  <Card className="bg-gradient-subtle border-primary/20">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                        <Calculator className="w-6 h-6 text-primary" />
                        Investment Calculator
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Calculate your total cost including book purchases
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="calculatorPlan" className="text-sm font-medium">Choose Your Plan</Label>
                          <div className="relative">
                            <select 
                              id="calculatorPlan"
                              value={selectedPlanIndex}
                              onChange={(e) => setSelectedPlanIndex(parseInt(e.target.value))}
                              className="w-full p-3 border border-input rounded-lg bg-background/50 backdrop-blur-sm appearance-none cursor-pointer hover:border-primary/50 transition-colors"
                            >
                              {packages[selectedType].map((pkg, index) => (
                                <option key={index} value={index} className="bg-background">
                                  {pkg.name} - {pkg.reviews} (${pkg.discountedPrice})
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="bookPriceCalc" className="text-sm font-medium">Your Book Price ($)</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowBookPriceDialog(true)}
                              className="h-auto p-1 text-muted-foreground hover:text-foreground"
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            id="bookPriceCalc"
                            type="number"
                            step="0.01"
                            min="0"
                            value={bookPrice}
                            onChange={(e) => setBookPrice(parseFloat(e.target.value) || 0)}
                            onFocus={handleBookPriceDialogOpen}
                            placeholder="e.g., 12.99"
                            className="p-3 bg-background/50 backdrop-blur-sm border-input hover:border-primary/50 transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-primary/5 via-success/5 to-accent/5 p-6 rounded-xl border border-primary/10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center space-y-2">
                            <div className="text-sm text-muted-foreground font-medium">Service Fee</div>
                            <div className="text-3xl font-bold text-primary">
                              ${packages[selectedType][selectedPlanIndex]?.discountedPrice || 0}
                            </div>
                          </div>
                          <div className="text-center space-y-2">
                            <div className="text-sm text-muted-foreground font-medium">Book Copies</div>
                            <div className="text-3xl font-bold text-success">
                              ${bookPrice > 0 ? (bookPrice * (parseInt(packages[selectedType][selectedPlanIndex]?.reviews.split('–')[0] || '0') || parseInt(packages[selectedType][selectedPlanIndex]?.reviews.split(' ')[0] || '0'))).toFixed(2) : '0.00'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {bookPrice > 0 ? `${parseInt(packages[selectedType][selectedPlanIndex]?.reviews.split('–')[0] || '0') || parseInt(packages[selectedType][selectedPlanIndex]?.reviews.split(' ')[0] || '0')} copies × $${bookPrice}` : 'Enter book price'}
                            </div>
                          </div>
                          <div className="text-center space-y-2 md:border-l border-primary/20">
                            <div className="text-sm text-muted-foreground font-medium">Total Investment</div>
                            <div className="text-4xl font-bold text-foreground">
                              ${bookPrice > 0 ? ((packages[selectedType][selectedPlanIndex]?.discountedPrice || 0) + (bookPrice * (parseInt(packages[selectedType][selectedPlanIndex]?.reviews.split('–')[0] || '0') || parseInt(packages[selectedType][selectedPlanIndex]?.reviews.split(' ')[0] || '0')))).toFixed(2) : (packages[selectedType][selectedPlanIndex]?.discountedPrice || 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Pricing Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages[selectedType].map((pkg, index) => (
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
                    
                    {user ? (
                      selectedType === 'verified' && bookPrice <= 0 ? (
                        <div className="text-center p-4 border border-dashed rounded-lg bg-amber-50 dark:bg-amber-950/20">
                          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                            📊 Please use the Investment Calculator above to set your book price first
                          </p>
                        </div>
                      ) : (
                        <PayPalButton
                          planType={selectedType}
                          planName={pkg.name}
                          amount={selectedType === 'verified' ? 
                            pkg.discountedPrice + (bookPrice * (parseInt(pkg.reviews.split('–')[0] || '0') || parseInt(pkg.reviews.split(' ')[0] || '0'))) : 
                            pkg.discountedPrice
                          }
                          bookPrice={selectedType === 'verified' ? bookPrice : 0}
                        />
                      )
                    ) : (
                      <Button 
                        variant={pkg.popular ? "accent" : "default"} 
                        className="w-full"
                        size="lg"
                        onClick={() => window.location.href = '/auth'}
                      >
                        Sign In to Purchase
                      </Button>
                    )}
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

      {/* Book Price Information Dialog */}
      <Dialog open={showBookPriceDialog} onOpenChange={setShowBookPriceDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Book Price Information
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 text-left">
                <p className="text-base">
                  <strong>Notice:</strong> You can set any price you want for your book purchase calculation.
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    📖 Example Book Formats:
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• <strong>Kindle Edition:</strong> $0.99</li>
                    <li>• <strong>Paperback:</strong> $12.99</li>
                    <li>• <strong>Hardcover:</strong> $24.99</li>
                  </ul>
                </div>

                <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">Important:</p>
                    <p className="text-sm">
                      If you set your book price at <strong>$12.99</strong> and select that price in the calculator, 
                      our reviewers will specifically purchase and review the <strong>Paperback version</strong> of your book. 
                      The review format will match the price point you specify.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    💡 <strong>Pro Tip:</strong> Choose the format that best aligns with your marketing goals and target audience preferences.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowBookPriceDialog(false)}>
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};