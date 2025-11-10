import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import DashboardOverview from "@/components/DashboardOverview";
import PredictionForm from "@/components/PredictionForm";
import ChatbotSection from "@/components/ChatbotSection";
import ContactSection from "@/components/ContactSection";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<"dashboard" | "prediction" | "chatbot" | "contact">("dashboard");
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
    <div className="min-h-screen bg-background">
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
      </main>
    </div>
  );
};

export default Dashboard;