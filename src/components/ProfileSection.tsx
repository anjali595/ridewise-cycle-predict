import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, History, Save } from "lucide-react";
import { format } from "date-fns";

interface ProfileSectionProps {
  userId: string;
  userEmail: string;
  onLogout: () => void;
}

interface Profile {
  username: string | null;
  email: string | null;
  created_at: string | null;
}

interface Prediction {
  id: string;
  created_at: string;
  prediction_type: string;
  predicted_demand: number;
  input_data: any;
}

const ProfileSection = ({ userId, userEmail, onLogout }: ProfileSectionProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
    loadRecentPredictions();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setProfile(data);
        setUsername(data.username || "");
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
    }
  };

  const loadRecentPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentPredictions(data || []);
    } catch (error: any) {
      console.error("Error loading predictions:", error);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          username,
          email: userEmail,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
      });
      loadProfile();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Info Card */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow glow-hover">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <User className="w-6 h-6 mr-2 text-primary" />
            Your Profile
          </CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                value={userEmail}
                disabled
                className="bg-secondary/50 border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-secondary/50 border-primary/30"
              />
            </div>

            {profile?.created_at && (
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member Since
                </Label>
                <Input
                  value={format(new Date(profile.created_at), "MMMM d, yyyy")}
                  disabled
                  className="bg-secondary/50 border-primary/30"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={saveProfile}
              disabled={loading}
              className="bike-gradient hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
            <Button onClick={onLogout} variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Predictions */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow glow-hover">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <History className="w-5 h-5 mr-2 text-primary" />
            Recent Predictions
          </CardTitle>
          <CardDescription>Your last 5 demand predictions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPredictions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No predictions yet. Try the Prediction tool!
            </p>
          ) : (
            <div className="space-y-3">
              {recentPredictions.map((pred) => (
                <div
                  key={pred.id}
                  className="p-4 rounded-lg bg-secondary/30 border border-primary/10 hover:border-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground">
                        {pred.prediction_type === "hourly" ? "Hourly" : "Daily"} Demand
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(pred.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {pred.predicted_demand}
                      </p>
                      <p className="text-xs text-muted-foreground">bikes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
