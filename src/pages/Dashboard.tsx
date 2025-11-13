import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import DashboardOverview from "@/components/DashboardOverview";
import PredictionForm from "@/components/PredictionForm";
import ChatbotSection from "@/components/ChatbotSection";
import ContactSection from "@/components/ContactSection";
import ProfileSection from "@/components/ProfileSection";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<"dashboard" | "prediction" | "chatbot" | "contact" | "profile">("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl floating-shape" />
        <div className="absolute top-60 right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl floating-shape-slow" />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 rounded-full bg-primary/15 blur-3xl floating-shape" />
        <div className="absolute bottom-20 right-1/3 w-48 h-48 rounded-full bg-accent/10 blur-3xl floating-shape-slow" />
      </div>
      
      <div className="relative z-10">
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
          userEmail={user.email || ""}
        />
        
        <main className="container mx-auto px-4 py-8">
        {activeSection === "dashboard" && <DashboardOverview userId={user.id} />}
        {activeSection === "prediction" && <PredictionForm userId={user.id} />}
        {activeSection === "chatbot" && <ChatbotSection />}
        {activeSection === "contact" && <ContactSection userId={user.id} />}
        {activeSection === "profile" && <ProfileSection userId={user.id} userEmail={user.email || ""} onLogout={handleLogout} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;