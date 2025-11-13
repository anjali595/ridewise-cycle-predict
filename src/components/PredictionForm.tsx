import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Bike, Calendar, Clock, CloudRain, Thermometer, Wind, Save, BookmarkPlus, Download, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";

const presetSchema = z.object({
  name: z.string().min(1).max(100, "Preset name must be less than 100 characters"),
  preset_data: z.object({}).passthrough().optional(),
  config: z.object({}).passthrough().optional(),
});

const importSchema = z.object({
  presets: z.array(presetSchema).max(100, "Cannot import more than 100 presets at once"),
});

interface PredictionFormProps {
  userId: string;
}

const PredictionForm = ({ userId }: PredictionFormProps) => {
  const [predictionType, setPredictionType] = useState<"hourly" | "daily">("hourly");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const { toast } = useToast();

  // Form state
  const [hour, setHour] = useState("12");
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("1");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [isHoliday, setIsHoliday] = useState(false);
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [season, setSeason] = useState("1");
  const [weather, setWeather] = useState("1");
  const [temperature, setTemperature] = useState("0.5");
  const [humidity, setHumidity] = useState("0.5");
  const [windspeed, setWindspeed] = useState("0.2");

  // Preset state
  const [presets, setPresets] = useState<any[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default presets
  const defaultPresets = [
    {
      name: "☀️ Morning Commute",
      config: { hour: 8, dayOfWeek: 1, season: 2, weather: 1, temperature: 0.6, humidity: 0.5, windspeed: 0.2, isHoliday: false, isWorkingDay: true }
    },
    {
      name: "🌙 Evening Rush",
      config: { hour: 18, dayOfWeek: 3, season: 2, weather: 1, temperature: 0.7, humidity: 0.6, windspeed: 0.1, isHoliday: false, isWorkingDay: true }
    },
    {
      name: "🎉 Weekend Leisure",
      config: { hour: 14, dayOfWeek: 6, season: 2, weather: 1, temperature: 0.8, humidity: 0.4, windspeed: 0.15, isHoliday: false, isWorkingDay: false }
    },
    {
      name: "🌧️ Rainy Day",
      config: { hour: 12, dayOfWeek: 2, season: 3, weather: 3, temperature: 0.4, humidity: 0.8, windspeed: 0.4, isHoliday: false, isWorkingDay: true }
    },
  ];

  useEffect(() => {
    loadPresets();
  }, [userId]);

  const loadPresets = async () => {
    const { data } = await supabase
      .from("prediction_presets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (data) setPresets(data);
  };

  const applyPreset = (preset: any) => {
    // Handle both default presets (with config) and user presets (with preset_data)
    const config = preset.preset_data || preset.config;
    setHour(config.hour?.toString() || "12");
    setYear(config.year?.toString() || "2024");
    setMonth(config.month?.toString() || "1");
    setDayOfWeek(config.dayOfWeek?.toString() || "1");
    setIsHoliday(config.isHoliday || false);
    setIsWorkingDay(config.isWorkingDay !== undefined ? config.isWorkingDay : true);
    setSeason(config.season?.toString() || "1");
    setWeather(config.weather?.toString() || "1");
    setTemperature(config.temperature?.toString() || "0.5");
    setHumidity(config.humidity?.toString() || "0.5");
    setWindspeed(config.windspeed?.toString() || "0.2");
    
    toast({
      title: "Preset Applied",
      description: `Loaded settings from "${preset.name}"`,
    });
  };

  const savePreset = async () => {
    if (!presetName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your preset",
        variant: "destructive",
      });
      return;
    }

    const config = {
      hour: parseInt(hour),
      year: parseInt(year),
      month: parseInt(month),
      dayOfWeek: parseInt(dayOfWeek),
      isHoliday,
      isWorkingDay,
      season: parseInt(season),
      weather: parseInt(weather),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      windspeed: parseFloat(windspeed),
    };

    const { error } = await supabase.from("prediction_presets").insert({
      user_id: userId,
      name: presetName,
      preset_data: config,
    });

    if (error) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Preset Saved",
        description: `"${presetName}" saved successfully`,
      });
      setPresetName("");
      setShowSaveDialog(false);
      loadPresets();
    }
  };

  const exportData = async () => {
    try {
      // Get all user presets
      const { data: presetsData } = await supabase
        .from("prediction_presets")
        .select("*")
        .eq("user_id", userId);

      // Get all user predictions
      const { data: predictionsData } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const exportData = {
        presets: presetsData || [],
        predictions: predictionsData || [],
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ridewise-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your presets and predictions have been downloaded",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        throw new Error("File size must be less than 1MB");
      }

      const text = await file.text();
      const data = JSON.parse(text);

      // Validate imported data structure
      const validation = importSchema.safeParse(data);
      
      if (!validation.success) {
        throw new Error("Invalid data format: " + validation.error.errors[0].message);
      }

      if (validation.data.presets && Array.isArray(validation.data.presets)) {
        // Import presets with validation
        for (const preset of validation.data.presets) {
          const sanitizedName = preset.name.substring(0, 100); // Enforce length limit
          const presetData = preset.preset_data || preset.config || {};
          
          await supabase.from("prediction_presets").insert([{
            user_id: userId,
            name: `${sanitizedName} (imported)`,
            preset_data: presetData,
          }]);
        }

        toast({
          title: "Import Successful",
          description: `Imported ${validation.data.presets.length} presets`,
        });
        loadPresets();
      }
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Invalid file format or corrupted data",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const inputData = {
        hour: parseInt(hour),
        year: parseInt(year),
        month: parseInt(month),
        dayOfWeek: parseInt(dayOfWeek),
        isHoliday,
        isWorkingDay,
        season: parseInt(season),
        weather: parseInt(weather),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        windspeed: parseFloat(windspeed),
      };

      const { data, error } = await supabase.functions.invoke("predict-demand", {
        body: { type: predictionType, input: inputData },
      });

      if (error) throw error;

      const predictedValue = data.prediction;
      setPrediction(predictedValue);

      // Save prediction to database
      await supabase.from("predictions").insert({
        user_id: userId,
        prediction_type: predictionType,
        input_data: inputData,
        predicted_demand: Math.round(predictedValue),
      });

      toast({
        title: "Prediction Complete!",
        description: `Predicted demand: ${Math.round(predictedValue)} bike rentals`,
      });
    } catch (error: any) {
      toast({
        title: "Prediction Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Default & Saved Presets Section */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow glow-hover">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <BookmarkPlus className="w-5 h-5 mr-2 text-accent" />
              Quick Presets
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-accent/30 hover:bg-accent/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className="border-accent/30 hover:bg-accent/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default Presets */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Default Scenarios</p>
            <div className="flex flex-wrap gap-2">
              {defaultPresets.map((preset, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="border-accent/30 hover:bg-accent/10 glow-hover"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* User Saved Presets */}
          {presets.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Saved Presets</p>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="border-primary/30 hover:bg-primary/10 glow-hover"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            <div className="flex items-center">
              <Bike className="w-6 h-6 mr-2 text-primary" />
              Bike Demand Prediction
            </div>
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-accent/30 hover:bg-accent/10">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preset
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-primary/20">
                <DialogHeader>
                  <DialogTitle>Save Current Settings</DialogTitle>
                  <DialogDescription>
                    Give your preset a name to save these settings for later use
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="e.g., Morning Commute"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="bg-secondary/50 border-primary/30"
                  />
                  <Button onClick={savePreset} className="w-full bike-gradient">
                    Save Preset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Predict bike rental demand using our ML models</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={predictionType} onValueChange={(v) => setPredictionType(v as "hourly" | "daily")}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30 p-1 backdrop-blur urban-shadow">
              <TabsTrigger value="hourly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/50">Hourly Demand</TabsTrigger>
              <TabsTrigger value="daily" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/50">Daily Demand</TabsTrigger>
            </TabsList>

            <TabsContent value="hourly" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hour" className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Hour of Day (0-23)
                  </Label>
                  <Input
                    id="hour"
                    type="number"
                    min="0"
                    max="23"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="bg-secondary/50 border-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger className="bg-secondary/50 border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    type="number"
                    min="1"
                    max="12"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-secondary/50 border-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="bg-secondary/50 border-primary/30"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="daily" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="bg-secondary/50 border-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek2">Day of Week</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger className="bg-secondary/50 border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Common fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="bg-secondary/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Spring</SelectItem>
                  <SelectItem value="2">Summer</SelectItem>
                  <SelectItem value="3">Fall</SelectItem>
                  <SelectItem value="4">Winter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weather" className="flex items-center">
                <CloudRain className="w-4 h-4 mr-2" />
                Weather
              </Label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger className="bg-secondary/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Clear</SelectItem>
                  <SelectItem value="2">Cloudy</SelectItem>
                  <SelectItem value="3">Light Rain</SelectItem>
                  <SelectItem value="4">Heavy Rain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center">
                <Thermometer className="w-4 h-4 mr-2" />
                Temperature (normalized 0-1)
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="bg-secondary/50 border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (normalized 0-1)</Label>
              <Input
                id="humidity"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                className="bg-secondary/50 border-primary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="windspeed" className="flex items-center">
                <Wind className="w-4 h-4 mr-2" />
                Windspeed (normalized 0-1)
              </Label>
              <Input
                id="windspeed"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={windspeed}
                onChange={(e) => setWindspeed(e.target.value)}
                className="bg-secondary/50 border-primary/30"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="holiday" checked={isHoliday} onCheckedChange={(checked) => setIsHoliday(checked as boolean)} />
              <Label htmlFor="holiday" className="cursor-pointer">
                Public Holiday
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="workingDay"
                checked={isWorkingDay}
                onCheckedChange={(checked) => setIsWorkingDay(checked as boolean)}
              />
              <Label htmlFor="workingDay" className="cursor-pointer">
                Working Day
              </Label>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Button onClick={handlePredict} disabled={loading} className="w-full bike-gradient hover:opacity-90 h-12 text-lg">
              {loading ? "Predicting..." : "Predict Demand"}
            </Button>

            {prediction !== null && (
              <Card className="border-primary bg-card/50 backdrop-blur animate-pulse-glow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Predicted Bike Rentals</p>
                    <div className="flex items-center justify-center space-x-3">
                      <Bike className="w-10 h-10 text-primary" />
                      <p className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {Math.round(prediction)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionForm;