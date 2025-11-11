import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Bike, Brain, MessageSquare, BarChart3, Sparkles, TrendingUp, Cloud, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Bike className="w-32 h-32 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 blur-3xl bg-primary/30 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-glow animate-fade-in">
            RideWise
          </h1>
          
          <p className="text-2xl md:text-3xl text-foreground/90 font-medium">
            Smart Bike Demand Prediction Platform
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Harness the power of machine learning to predict bike rental demand with precision. 
            Optimize urban mobility, reduce wait times, and revolutionize bike-sharing operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/auth">
              <Button size="lg" className="bike-gradient hover:opacity-90 text-lg px-10 py-6 glow-hover">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Predicting
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-primary/50 hover:bg-primary/10 glow-hover">
                <Brain className="w-5 h-5 mr-2" />
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          Powerful Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow glow-hover">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">ML Predictions</h3>
              <p className="text-muted-foreground">
                Advanced hourly & daily demand forecasting using trained neural networks
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow glow-hover">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <BarChart3 className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Real-time insights with interactive charts and demand heatmaps
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow glow-hover">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <MessageSquare className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">AI Chatbot</h3>
              <p className="text-muted-foreground">
                Get instant answers about predictions, cycling tips, and optimal ride times
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow glow-hover">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Smart Presets</h3>
              <p className="text-muted-foreground">
                Save and reuse prediction configurations for common scenarios
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          How RideWise Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">1. Input Parameters</h3>
            <p className="text-muted-foreground">
              Enter time, weather, and seasonal data or use smart presets
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">2. ML Processing</h3>
            <p className="text-muted-foreground">
              Our models analyze patterns and predict demand accurately
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">3. Get Insights</h3>
            <p className="text-muted-foreground">
              Receive precise predictions and actionable recommendations
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/50 to-accent/10 backdrop-blur max-w-4xl mx-auto neon-glow">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <Cloud className="w-16 h-16 text-primary mx-auto animate-pulse" />
            <h2 className="text-4xl font-bold text-foreground">
              Ready to Optimize Your Bike Fleet?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join RideWise today and transform how you manage bike rental demand with cutting-edge ML technology.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bike-gradient hover:opacity-90 text-lg px-12 py-6 mt-4">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-primary/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © 2024 RideWise. Powered by Machine Learning & Urban Innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
