import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting scheduled blog publishing check...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
