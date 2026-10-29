import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase key exists:", Boolean(supabaseKey));
console.log("Supabase key prefix:", supabaseKey?.slice(0, 14));

export const supabase = createClient(supabaseUrl, supabaseKey);