import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Check, RefreshCw, Clock, AlertCircle } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);

  const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("Current user:", user?.id);
    console.log("User error:", userError);

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        customer_name,
        customer_phone,
        total_amount,
        status,
        payment_status,
        created_at,
        order_items (
          id,
          quantity,
          unit_price,
          products ( name )
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setOrders([]);
    } else {
      setOrders(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function confirmPayment(orderId) {
    const accepted = window.confirm(
      `Have you verified the payment for order #${orderId}?`,
    );

    if (!accepted) return;

    setConfirmingId(orderId);
    setError("");

    const { error } = await supabase.rpc("mark_order_paid", {
      p_order_id: orderId,
    });

    if (error) {
      setError(error.message);
    } else {
      await loadOrders();
    }

    setConfirmingId(null);
  }

  async function cancelOrder(orderId) {
    const confirmed = window.confirm(
      `Cancel order #${orderId}? Its product stock will be restored.`,
    );

    if (!confirmed) return;

    const { error } = await supabase.rpc("cancel_pending_order", {
      p_order_id: orderId,
    });

    if (error) {
      console.error("Cancel order failed:", error);
      window.alert(`Failed to cancel order: ${error.message}`);
      return;
    }

    window.alert(`Order #${orderId} cancelled. Stock restored.`);
    await loadOrders();
  }

  const pendingOrders = orders.filter(
    (order) => order.payment_status === "pending",
  );

  function getOrderStatusStyle(order) {
    if (order.status === "cancelled") {
      return {
        label: "Cancelled",
        className: "bg-red-100 text-red-700",
      };
    }

    if (order.payment_status === "paid") {
      return {
        label: "Paid",
        className: "bg-emerald-100 text-emerald-700",
      };
    }

    return {
      label: "Awaiting payment",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              KANTINPLUS ADMIN
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Orders</h1>
            <p className="mt-2 text-slate-500">
              Verify payments before confirming them.
            </p>
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Pending payments</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {pendingOrders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total orders</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {orders.length}
            </p>
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-slate-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Clock className="mx-auto mb-3 text-slate-400" size={32} />
            <p className="font-semibold text-slate-800">No orders found</p>
            <p className="mt-1 text-sm text-slate-500">
              Orders will appear here when checkout is used.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {orders.map((order) => {
              const status = getOrderStatusStyle(order);

              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Order #{order.id}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(order.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase text-slate-400">
                        Customer
                      </p>
                      <p className="mt-1 font-medium text-slate-800">
                        {order.customer_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.customer_phone || "No phone provided"}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs font-medium uppercase text-slate-400">
                        Total
                      </p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {formatRupiah(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="my-5 border-t border-slate-100 pt-4">
                    <p className="mb-3 text-sm font-semibold text-slate-700">
                      Items
                    </p>

                    <div className="space-y-2">
                      {order.order_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span className="text-slate-600">
                            {item.products?.name ?? "Product unavailable"} ×{" "}
                            {item.quantity}
                          </span>
                          <span className="font-medium text-slate-800">
                            {formatRupiah(item.unit_price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.payment_status === "pending" && (
                      <button
                        onClick={() => confirmPayment(order.id)}
                        disabled={confirmingId !== null}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        <Check size={18} />
                        {confirmingId === order.id
                          ? "Confirming..."
                          : "Confirm payment"}
                      </button>
                    )}
                    {order.status === "pending" &&
                      order.payment_status === "pending" && (
                        <button
                          type="button"
                          onClick={() => cancelOrder(order.id)}
                          className="rounded-full border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Cancel order
                        </button>
                      )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
