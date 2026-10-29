import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Check, RefreshCw, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import Toast from "../components/Toast";
import { Link } from "react-router";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [rewardRedemptions, setRewardRedemptions] = useState([]);
  const [profilesById, setProfilesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [toast, setToast] = useState({
    title: "",
    message: "",
    type: "success",
    isVisible: false,
  });

  function showToast(title, message, type = "success") {
    setToast({
      title,
      message,
      type,
      isVisible: true,
    });
  }

  const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        { data: orderData, error: ordersError },
        { data: redemptionData, error: redemptionsError },
      ] = await Promise.all([
        supabase
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
          .order("created_at", { ascending: false }),

        supabase
          .from("reward_redemptions")
          .select(
            `
          id,
          user_id,
          product_id,
          product_name,
          product_price,
          points_spent,
          order_id,
          created_at
  `,
          )
          .order("created_at", { ascending: false }),
      ]);

      if (ordersError) throw ordersError;
      if (redemptionsError) throw redemptionsError;

      const loadedOrders = orderData ?? [];
      const loadedRedemptions = redemptionData ?? [];

      setOrders(loadedOrders);
      setRewardRedemptions(loadedRedemptions);

      // Load customer names for reward-only redemptions.
      const userIds = [
        ...new Set(
          loadedRedemptions
            .filter((redemption) => redemption.order_id == null)
            .map((redemption) => redemption.user_id)
            .filter(Boolean),
        ),
      ];

      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, display_name, phone")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        const profileMap = Object.fromEntries(
          (profiles ?? []).map((profile) => [profile.id, profile]),
        );

        setProfilesById(profileMap);
      } else {
        setProfilesById({});
      }
    } catch (error) {
      console.error("Failed to load dashboard orders:", error);
      setError(error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
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
      showToast("Payment failed", error.message, "error");
    } else {
      await loadOrders();
      showToast(
        "Payment confirmed",
        `Payment for order #${orderId} confirmed.`,
      );
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
      showToast("Cancellation failed", error.message, "error");
    } else {
      await loadOrders();
      showToast(
        "Order cancelled",
        `Order #${orderId} cancelled. Stock restored.`,
      );
    }

    window.alert(`Order #${orderId} cancelled. Stock restored.`);
    await loadOrders();
  }

  const pendingOrders = orders.filter(
    (order) => order.payment_status === "pending",
  );

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      String(order.id).includes(query) ||
      (order.customer_name || "").toLowerCase().includes(query) ||
      (order.customer_phone || "").toLowerCase().includes(query);

    const matchesPayment =
      paymentFilter === "all" || order.payment_status === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  function getOrderStatusStyle(order) {
    if (order.status === "cancelled") {
      return {
        label: "Cancelled",
        className: "bg-red-100 text-red-700",
      };
    }

    switch (order.payment_status) {
      case "paid":
        return {
          label: "Paid",
          className: "bg-emerald-100 text-emerald-700",
        };

      case "failed":
        return {
          label: "Payment failed",
          className: "bg-red-100 text-red-700",
        };

      case "expired":
        return {
          label: "Expired",
          className: "bg-slate-100 text-slate-600",
        };

      case "pending":
        return {
          label: "Awaiting payment",
          className: "bg-amber-100 text-amber-700",
        };

      default:
        return {
          label: "Unknown status",
          className: "bg-slate-100 text-slate-600",
        };
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#19334b]"
        >
          <ArrowLeft size={18} />
          Dashboard
        </Link>
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() =>
            setToast((current) => ({
              ...current,
              isVisible: false,
            }))
          }
        />
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

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_220px]">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search orders
            </label>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order ID, customer name, phone..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Payment filter */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Payment status
            </label>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
          <p>
            Showing {filteredOrders.length} of {orders.length} orders
          </p>

          {(search || paymentFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPaymentFilter("all");
              }}
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}
        </div>

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
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <p className="font-semibold text-slate-800">
                  No matching orders
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or payment filter.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status = getOrderStatusStyle(order);
                const linkedRedemptions = rewardRedemptions.filter(
                  (redemption) =>
                    String(redemption.order_id) === String(order.id),
                );

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
                        {linkedRedemptions.map((redemption) => (
                          <div
                            key={`reward-${redemption.id}`}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sky-50 p-3 text-sm"
                          >
                            <div>
                              <p className="font-semibold text-sky-900">
                                {redemption.product_name} × 1
                              </p>
                              <p className="mt-1 text-xs text-sky-700">
                                Reward redeemed · {redemption.points_spent}{" "}
                                points used
                              </p>
                            </div>

                            <span className="font-semibold text-sky-800">
                              Paid with points
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
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
                            disabled={confirmingId !== null}
                            className="rounded-full border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {confirmingId === order.id
                              ? "Cancelling..."
                              : "Cancel order"}
                          </button>
                        )}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        )}
        <section className="space-y-4">
          <header>
            <p className="text-sm font-semibold text-blue-600">REWARDS</p>
            <h2 className="text-xl font-bold text-slate-900">
              Reward-only redemptions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Products redeemed with points without a regular paid order.
            </p>
          </header>

          {rewardRedemptions.filter((redemption) => redemption.order_id == null)
            .length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              No reward-only redemptions yet.
            </div>
          ) : (
            rewardRedemptions
              .filter((redemption) => redemption.order_id == null)
              .map((redemption) => {
                const profile = profilesById[redemption.user_id];

                return (
                  <article
                    key={`redemption-${redemption.id}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Reward redemption #{redemption.id}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(redemption.created_at).toLocaleString(
                            "id-ID",
                          )}
                        </p>
                      </div>

                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                        Reward · Pickup
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase text-slate-400">
                          Customer
                        </p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {profile?.display_name || "Customer"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {profile?.phone || "No phone provided"}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs font-medium uppercase text-slate-400">
                          Points used
                        </p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {redemption.points_spent} points
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {redemption.product_name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Product value:{" "}
                          {formatRupiah(redemption.product_price)}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-sky-700">
                        No QRIS payment required
                      </p>
                    </div>
                  </article>
                );
              })
          )}
        </section>
      </div>
    </main>
  );
}
