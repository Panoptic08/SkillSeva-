import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://xefuzjrkqkueqmxfdcpq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZnV6anJrcWt1ZXFteGZkY3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5ODk3NDIsImV4cCI6MjA0MDU2NTc0Mn0.1JAY8dULhKtRxapxapyCgJvL53K7tIrl2mm8eMjZPs0";

export async function supabaseClient(supabaseToken: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: supabaseToken
        ? { Authorization: `Bearer ${supabaseToken}` }
        : {},
    },
  });
  return supabase;
}
