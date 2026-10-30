import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ClipboardList,
  Package,
  CircleDollarSign,
  Clock3,
  RefreshCw,
  AlertCircle,
  LayoutDashboard,
  ShelvingUnit,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import Logo from "../components/Logo";

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    revenue: 0,
    totalProducts: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [ordersResult, productsResult] = await Promise.all([
        supabase
          .from("orders")
          .select(
            "id, total_amount, payment_status, status, customer_name, created_at",
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("products")
          .select("id, name, flavor, stock, is_available")
          .order("stock", { ascending: true }),
      ]);

      if (ordersResult.error) throw ordersResult.error;
      if (productsResult.error) throw productsResult.error;

      const orders = ordersResult.data || [];
      const products = productsResult.data || [];

      setLowStockProducts(
        products
          .filter((product) => Number(product.stock || 0) <= 5)
          .slice(0, 5),
      );

      const today = new Date();

      const paidToday = orders.filter((order) => {
        const orderDate = new Date(order.created_at);

        return (
          order.payment_status === "paid" &&
          orderDate.getFullYear() === today.getFullYear() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getDate() === today.getDate()
        );
      });

      const revenueToday = paidToday.reduce(
        (total, order) => total + Number(order.total_amount || 0),
        0,
      );

      setTodayRevenue(revenueToday);
      setRecentOrders(orders.slice(0, 5));

      const pendingOrders = orders.filter(
        (order) => order.payment_status === "pending",
      );

      const paidOrders = orders.filter(
        (order) => order.payment_status === "paid",
      );

      const revenue = paidOrders.reduce(
        (total, order) => total + Number(order.total_amount || 0),
        0,
      );

      const lowStock = products.filter(
        (product) => Number(product.stock || 0) <= 5,
      ).length;

      setStats({
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        paidOrders: paidOrders.length,
        revenue,
        totalProducts: products.length,
        lowStock,
      });
    } catch (err) {
      setError(err.message || "Gagal memuat dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Pesanan",
      value: stats.totalOrders,
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Menunggu Pembayaran",
      value: stats.pendingOrders,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Pesanan Dibayar",
      value: stats.paidOrders,
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Pendapatan",
      value: formatRupiah(stats.revenue),
      icon: CircleDollarSign,
      color: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F8F3] text-[#19334b]">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo w={42} h={42} />
            <span className="text-xl font-bold">
              Kantin<span className="text-[#a2d6f9]">plus</span>
              <span className="ml-2 text-sm font-medium text-slate-400">
                Admin
              </span>
            </span>
          </Link>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-[#19334b]"
          >
            Lihat Toko
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5fa8d3]">
              <LayoutDashboard size={17} />
              Admin Dashboard
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Selamat datang, Admin!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Pantau pesanan, pembayaran, dan stok KantinPlus.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">Gagal memuat data</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </span>
                  <div className={`rounded-xl p-2.5 ${stat.color}`}>
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-5 break-words text-2xl font-bold">
                  {loading ? "—" : stat.value}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Today's revenue */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CircleDollarSign size={23} />
              </div>
              <div>
                <h2 className="font-bold">Pendapatan Hari Ini</h2>
                <p className="text-sm text-slate-500">
                  Dari pembayaran terkonfirmasi
                </p>
              </div>
            </div>

            <p className="mt-5 text-2xl font-bold">
              {loading ? "—" : formatRupiah(todayRevenue)}
            </p>
          </article>

          {/* Recent orders */}
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Pesanan Terbaru</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Lima pesanan terakhir yang masuk.
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#5fa8d3] hover:text-[#19334b]"
              >
                Semua <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {loading ? (
                <p className="py-5 text-sm text-slate-500">Memuat pesanan...</p>
              ) : recentOrders.length === 0 ? (
                <p className="py-5 text-sm text-slate-500">
                  Belum ada pesanan.
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold">Pesanan #{order.id}</p>
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {order.customer_name || "Pelanggan"}
                        {" · "}
                        {new Date(order.created_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {formatRupiah(order.total_amount)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.payment_status === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.payment_status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.payment_status === "paid"
                        ? "Dibayar"
                        : order.payment_status === "pending"
                          ? "Menunggu"
                          : order.payment_status === "failed"
                            ? "Gagal"
                            : order.payment_status === "expired"
                              ? "Kedaluwarsa"
                              : order.payment_status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold">Kelola KantinPlus</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pilih bagian yang ingin kamu kelola.
            </p>

            <Link
              to="/admin/pesanan"
              className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-[#a2d6f9] hover:bg-[#f5fbff]"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#e4f3fc] p-3 text-[#19334b]">
                  <ClipboardList size={23} />
                </div>

                <div>
                  <h3 className="font-bold">Manajemen Pesanan</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Periksa pesanan dan konfirmasi pembayaran.
                  </p>
                  {!loading && stats.pendingOrders > 0 && (
                    <p className="mt-2 text-xs font-semibold text-amber-600">
                      {stats.pendingOrders} pembayaran menunggu
                    </p>
                  )}
                </div>
              </div>

              <ArrowRight size={20} className="shrink-0 text-slate-400" />
            </Link>

            <Link
              to="/admin/produk"
              className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-sky-100 p-3 text-[#19334b]">
                  <Package size={23} />
                </div>

                <div>
                  <h3 className="font-bold">Manajemen Produk</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Pengelolaan produk dan stok
                  </p>
                </div>
              </div>
              <ArrowRight size={20} className="shrink-0 text-slate-400" />
            </Link>

            <Link
              to="/admin/inventori"
              className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-sky-100 p-3 text-[#19334b]">
                  <ShelvingUnit size={23} />
                </div>

                <div>
                  <h3 className="font-bold">Manajemen Inventori</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Pengelolaan produk dan stok
                  </p>
                </div>
              </div>
              <ArrowRight size={20} className="shrink-0 text-slate-400" />
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Ringkasan Stok</h2>
            <p className="mt-1 text-sm text-slate-500">
              Kondisi stok produk saat ini.
            </p>

            <div className="mt-6 rounded-2xl bg-[#f5fbff] p-4">
              <p className="text-sm text-slate-500">Total produk</p>
              <p className="mt-1 text-2xl font-bold">
                {loading ? "—" : stats.totalProducts}
              </p>
           < 1ae62fb (HEAD -> main) fix: update shipping cost message in Payment page and adjust image width in HeroArt component
> 23248b4 (origin/main, origin/HEAD) Update README.md
> dcfa173 Fix formatting in README for clone instructions </div>

            <div className="mt-3 rounded-2xl bg-amber-50 p-4">
              <p className="text-sm text-amber-700">Stok menipis (≤ 5)</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">
                {loading ? "—" : stats.lowStock}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="font-bold">Perlu Restock</h3>
              <p className="mt-1 text-sm text-slate-500">
                Produk dengan stok paling sedikit.
              </p>

              <div className="mt-4 space-y-3">
                {loading ? (
                  <p className="text-sm text-slate-500">Memuat stok...</p>
                ) : lowStockProducts.length === 0 ? (
                  <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    Semua produk memiliki stok lebih dari 5!
                  </p>
                ) : (
                  lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{product.name}</p>
                        <p className="text-xs text-slate-500">
                          {product.flavor || "Tanpa varian"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold ${
                          Number(product.stock) === 0
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {product.stock} tersisa
                      </span>
                    </div>
                  ))
                )}
              </div>

              <Link
                to="/admin/inventori"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5fa8d3] hover:text-[#19334b]"
              >
                Kelola inventori <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
