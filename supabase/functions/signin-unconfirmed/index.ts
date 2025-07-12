import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignInRequest {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password }: SignInRequest = await req.json();

    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // First, try to verify the user's credentials
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      // If it's just email not confirmed, we'll handle it
      if (authError.message.includes('Email not confirmed')) {
        // Get user by email to verify they exist
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (userError) {
          throw userError;
        }

        const user = userData.users.find(u => u.email === email);
        
        if (user) {
          // Update user to be confirmed so they can sign in
          const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
          );

          if (updateError) {
            throw updateError;
          }

          // Now create a session for the user
          const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: email
          });

          if (sessionError) {
            throw sessionError;
          }

          // Set them back to unconfirmed but allow the current session
          await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { email_confirm: false }
          );

          return new Response(JSON.stringify({ 
            success: true, 
            message: "Sign in successful with unconfirmed email",
            user: updatedUser.user
          }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        } else {
          throw new Error('User not found');
        }
      } else {
        throw authError;
      }
    }

    // If normal sign in worked, return success
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Sign in successful",
      user: authData.user
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in signin-unconfirmed function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: "Failed to sign in"
      }),
      {
        status: 200, // Return 200 to avoid client errors
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);