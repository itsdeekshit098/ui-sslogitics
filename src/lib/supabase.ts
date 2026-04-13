import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Standard client for public/RLS connections
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client strictly for NextJS backend endpoints to bypass RLS securely
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
