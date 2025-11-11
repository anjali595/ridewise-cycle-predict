import { Button } from "@/components/ui/button";
import { Bike, BarChart3, Brain, MessageSquare, Mail, User } from "lucide-react";

interface NavigationProps {
  activeSection: "dashboard" | "prediction" | "chatbot" | "contact" | "profile";
  onSectionChange: (section: "dashboard" | "prediction" | "chatbot" | "contact" | "profile") => void;
  onLogout: () => void;
  userEmail: string;
}

const Navigation = ({ activeSection, onSectionChange, onLogout, userEmail }: NavigationProps) => {
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "prediction" as const, label: "Prediction", icon: Brain },
    { id: "chatbot" as const, label: "Chatbot", icon: MessageSquare },
    { id: "contact" as const, label: "Contact", icon: Mail },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <nav className="bg-card border-b border-primary/20 urban-shadow glow-hover">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bike-gradient flex items-center justify-center neon-glow">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RideWise
            </span>
          </div>

          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={
                    activeSection === item.id
                      ? "bike-gradient hover:opacity-90 glow-hover"
                      : "hover:bg-primary/10 hover:text-primary glow-hover"
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden lg:inline">{userEmail}</span>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex space-x-2 pb-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                variant={activeSection === item.id ? "default" : "ghost"}
                size="sm"
                className={
                  activeSection === item.id
                    ? "bike-gradient hover:opacity-90"
                    : "hover:bg-primary/10 hover:text-primary"
                }
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;