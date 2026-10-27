import { supabase } from "../lib/supabaseClient";

export async function getProducts() {
    const { data, error } = await supabase.from("products").select("*").eq("is_available", true).order("id");

    if (error) throw error;

    return data;
}