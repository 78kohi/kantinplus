
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Package, Clock3 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;

export default function OrderHistory() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setLoadingOrders(false);
      return;
    }

    let active = true;

    async function fetchOrders() {
      setLoadingOrders(true);
      setError("");

      try {
        const { data: orderData, error: orderError } =
          await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (orderError) throw orderError;

        const orderIds = (orderData ?? []).map((order) => order.id);

        let itemData = [];
        let productData = [];

        if (orderIds.length > 0) {
          const { data, error: itemError } = await supabase
            .from("order_items")
            .select("*")
            .in("order_id", orderIds);

          if (itemError) throw itemError;
          itemData = data ?? [];

          const productIds = [
            ...new Set(itemData.map((item) => item.product_id)),
          ].filter(Boolean);

          if (productIds.length > 0) {
            const { data: products, error: productError } =
              await supabase
                .from("products")
                .select("id, name")
                .in("id", productIds);

            if (productError) throw productError;
            productData = products ?? [];
          }
        }

        const productMap = new Map(
          productData.map((product) => [product.id, product.name])
        );

        const result = (orderData ?? []).map((order) => ({
          ...order,
          items: itemData
            .filter((item) => item.order_id === order.id)
            .map((item) => ({
              ...item,
              productName:
                productMap.get(item.product_id) ?? "Produk",
            })),
        }));

        if (active) setOrders(result);
      } catch (err) {
        console.error("Failed to load order history:", err);
        if (active) setError("Riwayat pesanan gagal dimuat.");
      } finally {
        if (active) setLoadingOrders(false);
      }
    }

    fetchOrders();

    return () => {
      active = false;
    };
  }, [user, loading]);

  if (loading || loadingOrders) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffdf5]">
        <p className="text-sm text-slate-500">Memuat pesanan...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffdf5] p-6">
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-[#19334b]">
            Masuk untuk melihat pesanan
          </h1>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-xl bg-[#19334b] px-5 py-3 font-bold text-white"
          >
            Masuk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf5] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#19334b]"
        >
          <ArrowLeft size={18} />
          Kembali ke profil
        </Link>

        <h1 className="mt-6 text-3xl font-black text-[#19334b]">
          Riwayat Pesanan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Semua pesanan yang kamu buat saat masuk ke akunmu.
        </p>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {!error && orders.length === 0 && (
          <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 text-center">
            <Package size={36} className="mx-auto text-slate-400" />
            <h2 className="mt-4 font-bold text-[#19334b]">
              Belum ada pesanan
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pesananmu akan muncul di sini setelah kamu checkout.
            </p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-xl bg-[#19334b] px-5 py-3 font-bold text-white"
            >
              Mulai belanja
            </Link>
          </section>
        )}

        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <section
              key={order.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Nomor pesanan
                  </p>
                  <h2 className="mt-1 font-extrabold text-[#19334b]">
                    #{order.id}
                  </h2>
                </div>

                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold capitalize text-sky-700">
                  {order.payment_status ?? order.status ?? "pending"}
                </span>
              </div>

              <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Clock3 size={14} />
                {order.created_at
                  ? new Date(order.created_at).toLocaleString("id-ID")
                  : "Tanggal tidak tersedia"}
              </p>

              <div className="my-4 space-y-2 border-y border-slate-100 py-4">
                {order.items.map((item, index) => (
                  <div
                    key={item.id ?? `${item.product_id}-${index}`}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="text-slate-600">
                      {item.productName} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-500">
                  Total
                </span>
                <span className="text-lg font-black text-[#19334b]">
                  {formatRupiah(order.total_amount)}
                </span>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
