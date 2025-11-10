import { Button } from "@/components/ui/button";
import { Bike, BarChart3, Brain, MessageSquare, Mail, LogOut } from "lucide-react";

interface NavigationProps {
  activeSection: "dashboard" | "prediction" | "chatbot" | "contact";
  onSectionChange: (section: "dashboard" | "prediction" | "chatbot" | "contact") => void;
  onLogout: () => void;
  userEmail: string;
}

const Navigation = ({ activeSection, onSectionChange, onLogout, userEmail }: NavigationProps) => {
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "prediction" as const, label: "Prediction", icon: Brain },
    { id: "chatbot" as const, label: "Chatbot", icon: MessageSquare },
    { id: "contact" as const, label: "Contact Us", icon: Mail },
  ];

  return (
    <nav className="bg-card border-b border-primary/20 urban-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bike-gradient flex items-center justify-center">
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

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{userEmail}</span>
            <Button onClick={onLogout} variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
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