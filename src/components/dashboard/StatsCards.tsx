import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Star, 
  TrendingUp, 
  Calendar,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalBooks: number;
  totalReviews: number;
  averageRating: number;
  thisMonthBooks: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-medium transition-all hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Books</p>
              <p className="text-3xl font-bold text-primary">{stats.totalBooks}</p>
            </div>
            <div className="bg-gradient-primary p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-success mr-1" />
            <span className="text-success">+{stats.thisMonthBooks} this month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-medium transition-all hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-3xl font-bold text-accent">{stats.totalReviews}</p>
            </div>
            <div className="bg-gradient-accent p-3 rounded-full">
              <Star className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Eye className="w-4 h-4 text-muted-foreground mr-1" />
            <span className="text-muted-foreground">Across all books</span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-medium transition-all hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <p className="text-3xl font-bold text-success">{stats.averageRating}</p>
            </div>
            <div className="bg-gradient-success p-3 rounded-full">
              <Star className="w-6 h-6 text-success-foreground" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(stats.averageRating) ? 'fill-current' : ''}`} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-medium transition-all hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold text-primary">{stats.thisMonthBooks}</p>
            </div>
            <div className="bg-gradient-primary p-3 rounded-full">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(stats.thisMonthBooks / Math.max(stats.totalBooks, 1)) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;