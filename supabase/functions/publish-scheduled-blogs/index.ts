import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Secret key for cron job authentication (optional - set via Supabase secrets)
const CRON_SECRET = Deno.env.get("CRON_SECRET");

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Check for cron secret header (for scheduled invocations)
    const cronSecretHeader = req.headers.get("x-cron-secret");
    const isCronJob = CRON_SECRET && cronSecretHeader === CRON_SECRET;

    // If not a cron job, verify user authentication
    if (!isCronJob) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create client with user's auth to verify their identity
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      // Verify the user's claims
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
      
      if (claimsError || !claimsData?.claims) {
        return new Response(
          JSON.stringify({ error: "Invalid token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const userId = claimsData.claims.sub;

      // Check if user has admin role using service client
      const adminCheckClient = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: roleData, error: roleError } = await adminCheckClient
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !roleData) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.log("Starting scheduled blog publishing check...");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current timestamp
    const now = new Date().toISOString();
    console.log(`Current time: ${now}`);

    // Find all unpublished blogs with scheduled_at <= now
    const { data: scheduledBlogs, error: fetchError } = await supabase
      .from("blogs")
      .select("id, title, scheduled_at")
      .eq("published", false)
      .not("scheduled_at", "is", null)
      .lte("scheduled_at", now);

    if (fetchError) {
      console.error("Error fetching scheduled blogs:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${scheduledBlogs?.length || 0} blogs to publish`);

    if (!scheduledBlogs || scheduledBlogs.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No blogs scheduled for publishing",
          published_count: 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Publish each scheduled blog
    const publishedBlogs = [];
    for (const blog of scheduledBlogs) {
      console.log(`Publishing blog: ${blog.title} (ID: ${blog.id})`);

      const { error: updateError } = await supabase
        .from("blogs")
        .update({
          published: true,
          scheduled_at: null, // Clear the schedule after publishing
        })
        .eq("id", blog.id);

      if (updateError) {
        console.error(`Error publishing blog ${blog.id}:`, updateError);
      } else {
        publishedBlogs.push({
          id: blog.id,
          title: blog.title,
          scheduled_at: blog.scheduled_at,
        });
        console.log(`Successfully published: ${blog.title}`);
      }
    }

    console.log(`Successfully published ${publishedBlogs.length} blogs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Published ${publishedBlogs.length} blogs`,
        published_count: publishedBlogs.length,
        published_blogs: publishedBlogs,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in publish-scheduled-blogs:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
