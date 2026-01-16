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
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: roleData, error: roleError } = await adminClient
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

    console.log("Starting project slug backfill...");

    // Fetch all projects without slugs
    const { data: projects, error: fetchError } = await adminClient
      .from("projects")
      .select("id, title, slug");

    if (fetchError) {
      throw fetchError;
    }

    if (!projects || projects.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No projects found",
          updated_count: 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const sanitize = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    let updatedCount = 0;
    const updatedProjects = [];

    for (const project of projects) {
      if (project.slug) continue;

      const base = sanitize(project.title || `project-${project.id}`);
      let candidate = base;
      let i = 0;

      // Check for uniqueness
      while (true) {
        const { data: existing } = await adminClient
          .from("projects")
          .select("id")
          .eq("slug", candidate)
          .limit(1)
          .maybeSingle();

        if (!existing) break;
        i += 1;
        candidate = `${base}-${i}`;
      }

      // Update the project with the new slug
      const { error: updateError } = await adminClient
        .from("projects")
        .update({ slug: candidate })
        .eq("id", project.id);

      if (!updateError) {
        updatedCount++;
        updatedProjects.push({ id: project.id, title: project.title, slug: candidate });
        console.log(`Updated project ${project.id} with slug: ${candidate}`);
      } else {
        console.error(`Failed to update project ${project.id}:`, updateError);
      }
    }

    console.log(`Successfully updated ${updatedCount} projects with slugs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${updatedCount} projects with slugs`,
        updated_count: updatedCount,
        updated_projects: updatedProjects,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in backfill-project-slugs:", error);
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
