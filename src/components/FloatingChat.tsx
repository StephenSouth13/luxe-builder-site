import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([createWelcomeMessage(language)]);
  }, [language]);

  useEffect(() => {
    fetchSuggestions();
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const createWelcomeMessage = (lang: "vi" | "en"): ChatMessage => ({
    text: lang === "vi"
      ? "Xin chào! 👋 Tôi là trợ lý AI thông minh. Hãy hỏi tôi bất cứ điều gì!"
      : "Hello! 👋 I'm an AI assistant. Ask me anything!",
    isBot: true,
    timestamp: new Date(),
  });

  const fetchSuggestions = async () => {
    const { data } = await supabase
      .from("chatbot_training")
      .select("question")
      .eq("active", true)
      .eq("language", language)
      .order("priority", { ascending: false })
      .limit(4);
    if (data) setSuggestedQuestions(data.map((t) => t.question));
  };

  const getConversationHistory = (): { role: string; content: string }[] => {
    return messages
      .filter((m) => m.text !== createWelcomeMessage(language).text)
      .map((m) => ({
        role: m.isBot ? "assistant" : "user",
        content: m.text,
      }));
  };

  const handleSend = async (text?: string) => {
    const msg = text || inputValue.trim();
    if (!msg || isTyping) return;

    const userMessage: ChatMessage = { text: msg, isBot: false, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          message: msg,
          language,
          conversationHistory: getConversationHistory(),
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`Error ${resp.status}`);
      }

      // Stream response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let botMsgAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantText += content;
              setMessages((prev) => {
                if (!botMsgAdded) {
                  botMsgAdded = true;
                  return [...prev, { text: assistantText, isBot: true, timestamp: new Date() }];
                }
                return prev.map((m, i) =>
                  i === prev.length - 1 && m.isBot ? { ...m, text: assistantText } : m
                );
              });
            }
          } catch {
            // partial JSON, wait for more
          }
        }
      }

      if (!botMsgAdded) {
        // Fallback if no streaming content received
        setMessages((prev) => [
          ...prev,
          {
            text: language === "vi"
              ? "Xin lỗi, tôi gặp sự cố. Vui lòng thử lại!"
              : "Sorry, something went wrong. Please try again!",
            isBot: true,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: language === "vi"
            ? "Xin lỗi, tôi gặp sự cố. Vui lòng thử lại!"
            : "Sorry, something went wrong. Please try again!",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
                    {language === "vi" ? "Trợ lý AI" : "AI Assistant"}
                  </span>
                  <span className="text-background/70 text-[10px]">
                    {language === "vi" ? "Trả lời thông minh bằng AI" : "Smart AI-powered answers"}
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

              {isTyping && !messages[messages.length - 1]?.isBot && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
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
          {isOpen ? <X className="h-6 w-6 text-background" /> : <MessageCircle className="h-6 w-6 text-background" />}
        </Button>
      </motion.div>
    </>
  );
};

export default FloatingChat;
