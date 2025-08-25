import { Button } from "@/components/ui/button";
import { BarChart3, Upload, User, LogOut, Home } from "lucide-react";

interface HeaderProps {
  user?: { name: string; email: string } | null;
  onLogin: () => void;
  onLogout: () => void;
  onHome?: () => void;
}

export const Header = ({ user, onLogin, onLogout, onHome }: HeaderProps) => {
  return (
    <header className="bg-gradient-primary shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white">Excel Analytics Platform</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {onHome && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onHome}
                    className="border-white text-white hover:bg-white hover:text-analytics-blue"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:block ml-2">Home</span>
                  </Button>
                )}
                <div className="flex items-center space-x-2 text-white">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="border-white text-white hover:bg-white hover:text-analytics-blue"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block ml-2">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={onLogin}
                className="border-white text-white hover:bg-white hover:text-analytics-blue"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};