import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface ChatbotTraining {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  language: string;
  priority: number;
  active: boolean;
}

interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [trainings, setTrainings] = useState<ChatbotTraining[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([createWelcomeMessage(language)]);
  }, [language]);

  // Fetch trainings
  useEffect(() => {
    fetchTrainings();
  }, []);

  // Update suggested questions when language or trainings change
  useEffect(() => {
    const questions = trainings
      .filter((t) => t.language === language && t.active)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4)
      .map((t) => t.question);
    setSuggestedQuestions(questions);
  }, [trainings, language]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const createWelcomeMessage = (lang: "vi" | "en"): ChatMessage => ({
    text: lang === "vi"
      ? "Xin chào! 👋 Tôi là trợ lý ảo. Hãy hỏi tôi bất cứ điều gì!"
      : "Hello! 👋 I'm a virtual assistant. Ask me anything!",
    isBot: true,
    timestamp: new Date(),
  });

  const fetchTrainings = async () => {
    const { data } = await supabase
      .from("chatbot_training")
      .select("*")
      .eq("active", true)
      .order("priority", { ascending: false });
    if (data) setTrainings(data);
  };

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .trim();
  };

  const findBestAnswer = useCallback(
    (userInput: string): string => {
      const normalized = normalizeText(userInput);
      const words = normalized.split(/\s+/);
      const relevant = trainings.filter((t) => t.language === language);

      let bestMatch: ChatbotTraining | null = null;
      let bestScore = 0;

      for (const training of relevant) {
        let matchCount = 0;
        let exactMatch = false;

        for (const keyword of training.keywords) {
          const normKeyword = normalizeText(keyword);
          if (normalized.includes(normKeyword)) {
            matchCount++;
            if (normalized === normKeyword) exactMatch = true;
          }
          // Also check individual words
          for (const word of words) {
            if (word.length >= 3 && normKeyword.includes(word)) {
              matchCount += 0.5;
            }
          }
        }

        if (matchCount > 0) {
          // Score = keyword matches * priority weight
          const score = matchCount * (1 + training.priority * 0.5) + (exactMatch ? 10 : 0);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = training;
          }
        }
      }

      if (bestMatch) return bestMatch.answer;

      return language === "vi"
        ? "Cảm ơn bạn đã liên hệ! 😊 Tôi chưa có câu trả lời cho câu hỏi này. Vui lòng điền form liên hệ để được hỗ trợ tốt nhất."
        : "Thank you for reaching out! 😊 I don't have an answer for this yet. Please fill out the contact form for the best support.";
    },
    [trainings, language]
  );

  const handleSend = (text?: string) => {
    const msg = text || inputValue.trim();
    if (!msg) return;

    const userMessage: ChatMessage = { text: msg, isBot: false, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      const botResponse: ChatMessage = {
        text: findBestAnswer(msg),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, delay);
  };

  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    setLanguage(newLang);
    setMessages([createWelcomeMessage(newLang)]);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-8 w-[340px] sm:w-[400px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: "min(600px, calc(100vh - 120px))" }}
          >
            {/* Header */}
            <div className="gold-gradient px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-background/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-background" />
                </div>
                <div>
                  <span className="font-semibold text-background text-sm block leading-tight">
                    {language === "vi" ? "Trợ lý ảo" : "Virtual Assistant"}
                  </span>
                  <span className="text-background/70 text-[10px]">
                    {language === "vi" ? "Luôn sẵn sàng hỗ trợ" : "Always ready to help"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleLanguage}
                  className="px-2 py-1 bg-background/20 hover:bg-background/30 rounded-md text-[10px] font-semibold text-background transition-colors"
                >
                  {language === "vi" ? "EN" : "VI"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-background hover:bg-background/20 rounded-full p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 bg-secondary/10"
              style={{ minHeight: 200 }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  {message.isBot && (
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl ${
                      message.isBot
                        ? "bg-card border border-border rounded-tl-sm"
                        : "gold-gradient text-background rounded-tr-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    <p className={`text-[9px] mt-1 ${message.isBot ? "text-muted-foreground" : "text-background/60"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {!message.isBot && (
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && suggestedQuestions.length > 0 && (
              <div className="px-3 py-2 border-t border-border/50 bg-card/50 shrink-0">
                <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {language === "vi" ? "Gợi ý câu hỏi" : "Suggested questions"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors truncate max-w-full"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border bg-card shrink-0">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={language === "vi" ? "Nhập tin nhắn..." : "Type a message..."}
                  className="flex-1 bg-secondary/50 border-border text-sm h-9"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSend()}
                  size="icon"
                  className="gold-gradient hover:opacity-90 transition-opacity shrink-0 h-9 w-9"
                  disabled={isTyping || !inputValue.trim()}
                >
                  <Send className="h-3.5 w-3.5 text-background" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-4 sm:right-8 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="h-14 w-14 rounded-full gold-gradient hover:opacity-90 transition-opacity shadow-lg glow-gold"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-background" />
          ) : (
            <MessageCircle className="h-6 w-6 text-background" />
          )}
        </Button>
      </motion.div>
    </>
  );
};

export default FloatingChat;
