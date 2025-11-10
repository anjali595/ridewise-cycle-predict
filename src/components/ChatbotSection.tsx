import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bike, Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm RideBot 🚲 Ask me about bike rides, predictions, or just chat!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getBotResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("best time") || input.includes("when")) {
      return "Based on our data, the best time to ride is typically around 5-6 PM on weekdays, when weather is clear. Morning rides (8-9 AM) are also popular!";
    }
    if (input.includes("hourly") || input.includes("model")) {
      return "The hourly model predicts bike demand for specific hours using factors like time, weather, and day type. It's great for short-term planning!";
    }
    if (input.includes("weather")) {
      return "Weather significantly impacts bike rentals! Clear weather increases demand by 15-20%, while rain can reduce it by 30-40%. Temperature and humidity also play important roles.";
    }
    if (input.includes("season")) {
      return "Summer sees the highest bike rental demand (35%), followed by Spring (25%), Fall (20%), and Winter (20%). Plan accordingly!";
    }
    
    return "That's an interesting question! I can help with bike rental predictions, explain our models, discuss weather impacts, or provide riding tips. What would you like to know more about?";
  };

  const quickButtons = [
    "What's the best time to ride?",
    "Explain hourly model",
    "How does weather affect demand?",
    "Tell me about seasons",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-primary/20 bg-card/50 backdrop-blur urban-shadow h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Bike className="w-6 h-6 mr-2 text-primary" />
            RideBot Assistant
          </CardTitle>
          <CardDescription>Ask me anything about bike rentals and predictions!</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bike-gradient text-white"
                        : "bg-secondary/50 text-foreground border border-primary/20"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary/50 rounded-lg p-4 border border-primary/20">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-primary/20 space-y-4">
            <div className="flex flex-wrap gap-2">
              {quickButtons.map((text, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInput(text);
                    handleSend();
                  }}
                  className="border-primary/30 hover:bg-primary/10 text-xs"
                >
                  {text}
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="bg-secondary/50 border-primary/30 focus:border-primary"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bike-gradient hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotSection;