import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Bike, TrendingUp, Clock, Calendar } from "lucide-react";
import cityBikeHero from "@/assets/city-bike-hero.jpg";

interface DashboardOverviewProps {
  userId: string;
}

const DashboardOverview = ({ userId }: DashboardOverviewProps) => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, [userId]);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for charts
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    demand: Math.floor(Math.random() * 300) + 50,
  }));

  const dailyData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    demand: Math.floor(Math.random() * 2000) + 500,
  }));

  const seasonData = [
    { name: "Spring", value: 25 },
    { name: "Summer", value: 35 },
    { name: "Fall", value: 20 },
    { name: "Winter", value: 20 },
  ];

  const COLORS = ["hsl(270, 70%, 60%)", "hsl(280, 80%, 65%)", "hsl(260, 60%, 55%)", "hsl(290, 70%, 65%)"];

  const totalPredictedToday = predictions
    .filter((p) => new Date(p.created_at).toDateString() === new Date().toDateString())
    .reduce((acc, p) => acc + p.predicted_demand, 0);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-64 rounded-xl overflow-hidden urban-shadow">
        <img src={cityBikeHero} alt="City Bike Path" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent flex items-center">
          <div className="px-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to RideWise
            </h1>
            <p className="text-muted-foreground text-lg">Your intelligent bike rental prediction dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Bike className="w-4 h-4 mr-2 text-primary" />
              Total Rides Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalPredictedToday || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-2 text-accent" />
              Peak Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">5 PM</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              Weather Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">+15%</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-accent" />
              Predictions Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{predictions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Hourly Demand</CardTitle>
            <CardDescription>Predicted bike rentals by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 30%, 25%)" />
                <XAxis dataKey="hour" stroke="hsl(270, 10%, 70%)" />
                <YAxis stroke="hsl(270, 10%, 70%)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(270, 40%, 12%)", border: "1px solid hsl(270, 30%, 25%)" }}
                />
                <Line type="monotone" dataKey="demand" stroke="hsl(270, 70%, 60%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Daily Demand</CardTitle>
            <CardDescription>Weekly rental patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 30%, 25%)" />
                <XAxis dataKey="day" stroke="hsl(270, 10%, 70%)" />
                <YAxis stroke="hsl(270, 10%, 70%)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(270, 40%, 12%)", border: "1px solid hsl(270, 30%, 25%)" }}
                />
                <Bar dataKey="demand" fill="hsl(280, 80%, 65%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Seasonal Distribution</CardTitle>
            <CardDescription>Rental patterns by season</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={seasonData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {seasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Recent Predictions</CardTitle>
            <CardDescription>Your last 5 predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.slice(0, 5).map((pred) => (
                <div key={pred.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground capitalize">{pred.prediction_type} Prediction</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(pred.created_at).toLocaleDateString()} at{" "}
                      {new Date(pred.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{pred.predicted_demand}</p>
                    <p className="text-xs text-muted-foreground">rides</p>
                  </div>
                </div>
              ))}
              {predictions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No predictions yet. Try the prediction tool!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;