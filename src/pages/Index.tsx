import { useState } from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Upload, TrendingUp, Shield, Download, Users } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleLogin = (userData: { name: string; email: string; role: string }) => {
    setUser(userData);
    setShowAuthModal(false);
    setShowDashboard(true);
  };

  const handleLogout = () => {
    setUser(null);
    setShowDashboard(false);
  };

  const handleHome = () => {
    setShowDashboard(false);
  };

  if (user && showDashboard) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          user={user} 
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onHome={handleHome}
        />
        <Dashboard user={user} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Header 
        user={null} 
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Excel Analytics 
              <span className="text-transparent bg-clip-text bg-gradient-primary"> Platform</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload Excel files, analyze data dynamically, and generate interactive 2D/3D charts. 
              Choose X and Y axes on the fly, download charts as PNG/PDF, and get AI-powered insights.
            </p>
            
            <div className="flex justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setShowAuthModal(true)}
                className="animate-bounce-gentle"
              >
                <Upload className="h-5 w-5 mr-2" />
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for comprehensive Excel data analysis and visualization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="shadow-card-custom hover:shadow-elegant transition-smooth transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Excel File Upload & Parsing
                </h3>
                <p className="text-gray-600">
                  Upload .xlsx and .xls files with automatic parsing using SheetJS. 
                  Supports complex spreadsheets with multiple columns.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card-custom hover:shadow-elegant transition-smooth transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  User & Admin Authentication
                </h3>
                <p className="text-gray-600">
                  JWT-based secure authentication system with user roles and 
                  personalized dashboard access.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card-custom hover:shadow-elegant transition-smooth transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Dynamic Data Mapping
                </h3>
                <p className="text-gray-600">
                  Choose X and Y axes dynamically from your data columns. 
                  Real-time chart updates as you change selections.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card-custom hover:shadow-elegant transition-smooth transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Multiple Chart Types
                </h3>
                <p className="text-gray-600">
                  Generate bar, line, pie, scatter plots, and 3D column charts. 
                  Interactive visualizations with Chart.js and Three.js.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card-custom hover:shadow-elegant transition-smooth transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Downloadable Charts
                </h3>
                <p className="text-gray-600">
                  Export your charts as high-quality PNG images or 
                  comprehensive PDF reports with one click.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card-custom hover:shadow-elegant transition-smooth transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload History & Dashboard
                </h3>
                <p className="text-gray-600">
                  Track all your uploads, save analysis history, and 
                  access your previous work with a comprehensive dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Built with Modern Technologies</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">R</span>
              </div>
              <span className="font-medium text-gray-700">React.js</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">N</span>
              </div>
              <span className="font-medium text-gray-700">Node.js</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">M</span>
              </div>
              <span className="font-medium text-gray-700">MongoDB</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-600">C</span>
              </div>
              <span className="font-medium text-gray-700">Chart.js</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Excel Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already creating stunning visualizations 
            from their Excel spreadsheets.
          </p>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
      <Footer />
    </div>
  );
};

export default Index;