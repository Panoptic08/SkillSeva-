import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://xefuzjrkqkueqmxfdcpq.supabase.co";
const supabaseKey = process.env.SUPBASE_PUBLIC_KEY!;

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
