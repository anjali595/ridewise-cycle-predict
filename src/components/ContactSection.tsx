import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Github, Linkedin, Twitter, MapPin } from "lucide-react";

interface ContactSectionProps {
  userId: string;
}

const ContactSection = ({ userId }: ContactSectionProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("contact_messages").insert({
        user_id: userId,
        name,
        email,
        feedback_type: feedbackType,
        message,
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
      });

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setFeedbackType("suggestion");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Mail className="w-6 h-6 mr-2 text-primary" />
            Contact Us
          </CardTitle>
          <CardDescription>Get in touch with the RideWise team</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-secondary/50 border-primary/30 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50 border-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedbackType">Feedback Type</Label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger className="bg-secondary/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="compliment">Compliment</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="bg-secondary/50 border-primary/30 focus:border-primary resize-none"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bike-gradient hover:opacity-90 h-12">
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">RideWise HQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-medium">San Francisco, CA</p>
                <p className="text-sm text-muted-foreground">123 Bike Lane, Suite 100</p>
                <p className="text-sm text-muted-foreground">San Francisco, CA 94102</p>
              </div>
            </div>
            <div className="h-48 bg-secondary/30 rounded-lg flex items-center justify-center border border-primary/20">
              <p className="text-muted-foreground">Map Location</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Connect With Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Follow us on social media for updates and bike riding tips!</p>
            
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 hover:bg-primary/10 transition-colors border border-primary/20"
              >
                <Linkedin className="w-5 h-5 text-primary" />
                <span>LinkedIn</span>
              </a>
              
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 hover:bg-primary/10 transition-colors border border-primary/20"
              >
                <Github className="w-5 h-5 text-primary" />
                <span>GitHub</span>
              </a>
              
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 hover:bg-primary/10 transition-colors border border-primary/20"
              >
                <Twitter className="w-5 h-5 text-primary" />
                <span>Twitter</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactSection;