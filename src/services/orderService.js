import { supabase } from "../lib/supabaseClient";

export async function createOrder({
  cart,
  customerName,
  customerPhone = "",
}) {
  const items = cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  }));

  const { data, error } = await supabase.rpc("create_order", {
    p_items: items,
    p_customer_name: customerName,
    p_customer_phone: customerPhone || null,
  });

  if (error) throw error;

  return data; 
}
