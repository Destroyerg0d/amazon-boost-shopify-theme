import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { BookOpen, Users, TrendingUp } from "lucide-react";

export const ReaderCommunity = () => {
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const [countsVisible, setCountsVisible] = useState(false);

  const readerData = [
    { category: "📖 Fiction", subcategory: "Romance", percentage: 13, readers: 130000 },
    { category: "", subcategory: "Mystery, Thriller & Suspense", percentage: 12, readers: 120000 },
    { category: "", subcategory: "Science Fiction & Fantasy", percentage: 10, readers: 100000 },
    { category: "", subcategory: "Literature & Fiction", percentage: 5, readers: 50000 },
    { category: "", subcategory: "Teen & Young Adult", percentage: 5, readers: 50000 },
    { category: "", subcategory: "Comics & Manga", percentage: 4, readers: 40000 },
    { category: "", subcategory: "LGBTQIA+ (Fiction)", percentage: 2, readers: 20000 },
    { category: "🧠 Nonfiction", subcategory: "Self-Help", percentage: 7, readers: 70000 },
    { category: "", subcategory: "Biographies & Memoirs", percentage: 4, readers: 40000 },
    { category: "", subcategory: "Business & Money", percentage: 4, readers: 40000 },
    { category: "", subcategory: "Health, Fitness & Dieting", percentage: 3, readers: 30000 },
    { category: "", subcategory: "Religion & Spirituality", percentage: 3, readers: 30000 },
    { category: "", subcategory: "History", percentage: 3, readers: 30000 },
    { category: "", subcategory: "Politics & Social Sciences", percentage: 2, readers: 20000 },
    { category: "", subcategory: "Education & Teaching", percentage: 2, readers: 20000 },
    { category: "", subcategory: "Science & Math", percentage: 2, readers: 20000 },
    { category: "", subcategory: "Computers & Technology", percentage: 2, readers: 20000 },
    { category: "", subcategory: "Law", percentage: 1, readers: 10000 },
    { category: "", subcategory: "Medical Books", percentage: 1, readers: 10000 },
    { category: "", subcategory: "Reference", percentage: 1, readers: 10000 },
    { category: "", subcategory: "Parenting & Relationships", percentage: 1, readers: 10000 },
    { category: "", subcategory: "Humor & Entertainment", percentage: 1, readers: 10000 },
    { category: "", subcategory: "Arts & Photography", percentage: 1, readers: 10000 },
    { category: "", subcategory: "Travel", percentage: 1, readers: 10000 },
    { category: "", subcategory: "Crafts, Hobbies & Home", percentage: 1, readers: 10000 },
    { category: "", subcategory: "Calendars", percentage: 0.5, readers: 5000 },
    { category: "", subcategory: "Engineering & Transportation", percentage: 0.5, readers: 5000 },
    { category: "🍳 Cookbooks, Food & Wine", subcategory: "", percentage: 3, readers: 30000 },
    { category: "👶 Children's Books", subcategory: "", percentage: 6, readers: 60000 },
    { category: "📝 Shorts & Kindle Singles", subcategory: "", percentage: 1.5, readers: 15000 },
    { category: "🌐 Diverse Voices Categories", subcategory: "", percentage: 2, readers: 20000 },
    { category: "📚 Other / Unlisted / Niche", subcategory: "", percentage: 1.5, readers: 15000 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rowIndex = parseInt(entry.target.getAttribute('data-row-index') || '0');
            setVisibleRows(prev => [...prev, rowIndex]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const rows = document.querySelectorAll('[data-row-index]');
    rows.forEach(row => observer.observe(row));

    // Trigger count animation
    setTimeout(() => setCountsVisible(true), 1000);

    return () => observer.disconnect();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Reader Community</span>
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
          <Card className="text-center p-6 border-primary/20 hover:shadow-soft transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">10,000+</h3>
            <p className="text-muted-foreground">Books Successfully Reviewed</p>
          </Card>
          <Card className="text-center p-6 border-accent/20 hover:shadow-soft transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">1M+</h3>
            <p className="text-muted-foreground">Active Reader Community</p>
          </Card>
          <Card className="text-center p-6 border-success/20 hover:shadow-soft transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">30+</h3>
            <p className="text-muted-foreground">Genre Categories Covered</p>
          </Card>
        </div>

        {/* Reader Demographics Table */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Reader Demographics by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Main Category</TableHead>
                    <TableHead className="font-semibold">Subcategory</TableHead>
                    <TableHead className="font-semibold text-center">Percentage</TableHead>
                    <TableHead className="font-semibold text-right">Readers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readerData.map((row, index) => (
                    <TableRow 
                      key={index}
                      data-row-index={index}
                      className={`transition-all duration-500 ${
                        visibleRows.includes(index) 
                          ? 'opacity-100 translate-x-0' 
                          : 'opacity-0 translate-x-8'
                      } hover:bg-muted/30`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium">
                        {row.category && (
                          <span className="text-lg">{row.category}</span>
                        )}
                      </TableCell>
                      <TableCell className={row.category ? "pl-6" : ""}>
                        {row.subcategory || "All Categories"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {row.percentage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <span className={`${countsVisible ? 'animate-count-up' : 'opacity-0'}`}>
                          {formatNumber(row.readers)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-accent/10 font-bold text-lg">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-accent text-accent-foreground">100%</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xl font-bold text-accent">
                      1,000,000
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};