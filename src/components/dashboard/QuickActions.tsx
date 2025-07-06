import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  Plus, 
  Star, 
  Settings
} from 'lucide-react';

interface QuickActionsProps {
  onAddBook: () => void;
  onViewReviews: () => void;
  onViewSettings: () => void;
}

const QuickActions = ({ onAddBook, onViewReviews, onViewSettings }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={onAddBook}
            className="h-20 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Plus className="w-6 h-6" />
            Add New Book
          </Button>
          <Button 
            onClick={onViewReviews}
            className="h-20 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Star className="w-6 h-6" />
            View Reviews
          </Button>
          <Button 
            onClick={onViewSettings}
            className="h-20 flex flex-col items-center justify-center gap-2"
            variant="outline"
          >
            <Settings className="w-6 h-6" />
            Account Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;