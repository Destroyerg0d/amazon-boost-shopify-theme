import { Button } from '@/components/ui/button';
import { 
  Activity,
  BookOpen, 
  Star, 
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ activeTab, setActiveTab }: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'books', label: 'My Books', icon: BookOpen },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex w-64 min-h-screen bg-card border-r border-border flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-full">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Review Pro Max</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" onClick={signOut} className="w-full justify-start">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;