import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, language, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch chatbot training data for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: trainings } = await supabase
      .from("chatbot_training")
      .select("question, answer, keywords, language")
      .eq("active", true)
      .eq("language", language || "vi")
      .order("priority", { ascending: false });

    // Also fetch site info for context
    const [heroRes, aboutRes, contactRes, socialRes] = await Promise.all([
      supabase.from("hero_section").select("name, title, quote").limit(1).single(),
      supabase.from("about_section").select("headline, description").limit(1).single(),
      supabase.from("contacts").select("email, phone, location").limit(1).single(),
      supabase.from("social_links").select("provider, url"),
    ]);

    const siteContext = [
      heroRes.data ? `Chủ nhân website: ${heroRes.data.name}, chức danh: ${heroRes.data.title}` : "",
      aboutRes.data ? `Giới thiệu: ${aboutRes.data.description?.substring(0, 500)}` : "",
      contactRes.data ? `Liên hệ: Email ${contactRes.data.email}, SĐT ${contactRes.data.phone}, Địa chỉ ${contactRes.data.location}` : "",
      socialRes.data ? `Mạng xã hội: ${socialRes.data.map(s => `${s.provider}: ${s.url}`).join(", ")}` : "",
    ].filter(Boolean).join("\n");

    const knowledgeBase = trainings?.map(t =>
      `Q: ${t.question}\nA: ${t.answer}`
    ).join("\n\n") || "";

    const systemPrompt = language === "vi"
      ? `Bạn là trợ lý ảo thông minh trên website cá nhân. Hãy trả lời thân thiện, chuyên nghiệp, ngắn gọn bằng tiếng Việt.

Thông tin website:
${siteContext}

Kho kiến thức đã được huấn luyện:
${knowledgeBase}

Quy tắc:
- Ưu tiên trả lời dựa trên kho kiến thức nếu câu hỏi liên quan
- Nếu không tìm thấy câu trả lời phù hợp, hãy trả lời tự nhiên dựa trên thông tin website
- Giữ câu trả lời ngắn gọn (tối đa 3-4 câu)
- Luôn thân thiện và chuyên nghiệp
- Nếu được hỏi điều bạn không biết, hãy gợi ý liên hệ qua form hoặc email`
      : `You are a smart virtual assistant on a personal website. Answer friendly, professionally, and concisely in English.

Website info:
${siteContext}

Trained knowledge base:
${knowledgeBase}

Rules:
- Prioritize answers from the knowledge base if relevant
- If no matching answer, respond naturally based on website info
- Keep answers short (max 3-4 sentences)
- Always be friendly and professional
- If you don't know, suggest contacting via form or email`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []).slice(-10),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
