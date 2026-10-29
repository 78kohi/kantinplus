import { supabase } from "../lib/supabaseClient";

export async function createOrder({ cart, customerName, customerPhone = "" }) {
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

export async function checkoutWithReward({
  cart = [],
  customerName,
  customerPhone = "",
  rewardProductId = null,
  orderType = "pickup",
}) {
  const items = cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  }));

  const { data, error } = await supabase.rpc("checkout_with_reward", {
    p_items: items,
    p_customer_name: customerName,
    p_customer_phone: customerPhone || null,
    p_reward_product_id: rewardProductId,
    p_order_type: orderType,
  });

  if (error) throw error;

  return data;
}
