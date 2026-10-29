import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Search,
  Warehouse,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [savingId, setSavingId] = useState(null);

  async function loadProducts() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("products")
      .select("id, name, flavor, stock, is_available")
      .order("name", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function changeStock(product, difference) {
    const nextStock = Number(product.stock || 0) + difference;

    if (nextStock < 0) return;

    setSavingId(product.id);
    setError("");

    const { error } = await supabase
      .from("products")
      .update({ stock: nextStock })
      .eq("id", product.id);

    if (error) {
      setError(error.message);
    } else {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, stock: nextStock } : item,
        ),
      );
    }

    setSavingId(null);
  }

  async function setExactStock(product) {
    const input = window.prompt(
      `Set stock for ${product.name}:`,
      String(product.stock),
    );

    if (input === null || input.trim() === "") return;

    const nextStock = Number(input);

    if (!Number.isInteger(nextStock) || nextStock < 0) {
      setError("Stock must be a whole number of 0 or more.");
      return;
    }

    setSavingId(product.id);
    setError("");

    const { error } = await supabase
      .from("products")
      .update({ stock: nextStock })
      .eq("id", product.id);

    if (error) {
      setError(error.message);
    } else {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, stock: nextStock } : item,
        ),
      );
    }

    setSavingId(null);
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.flavor || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStock = !lowStockOnly || Number(product.stock) <= 5;

    return matchesSearch && matchesStock;
  });

  const lowStockCount = products.filter(
    (product) => Number(product.stock) <= 5,
  ).length;

  const totalUnits = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#F7F8F3] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#19334b]"
        >
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <header className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#19334b] sm:text-3xl">
              Inventory Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track product quantities and restock when needed.
            </p>
          </div>

          <button
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#19334b] hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-[#e4f3fc] text-[#19334b]">
                <Warehouse size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Units in Stock</p>
                <p className="mt-1 text-2xl font-bold text-[#19334b]">
                  {loading ? "..." : totalUnits}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Low Stock (5 or fewer)</p>
                <p className="mt-1 text-2xl font-bold text-[#19334b]">
                  {loading ? "..." : lowStockCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#5fa8d3]"
              />
            </div>

            <button
              onClick={() => setLowStockOnly((current) => !current)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                lowStockOnly
                  ? "bg-amber-100 text-amber-800"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {lowStockOnly ? "Show all products" : "Show low stock"}
            </button>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {loading ? (
              <p className="py-8 text-sm text-slate-500">
                Loading inventory...
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No matching products found.
              </p>
            ) : (
              filteredProducts.map((product) => {
                const stock = Number(product.stock || 0);
                const lowStock = stock <= 5;

                return (
                  <article
                    key={product.id}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h2 className="font-bold text-[#19334b]">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {product.flavor || "No flavor specified"}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            lowStock
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {lowStock ? "Low stock" : "Stock sufficient"}
                        </span>

                        <span className="text-xs text-slate-500">
                          {product.is_available
                            ? "Available for purchase"
                            : "Unavailable to customers"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => changeStock(product, -1)}
                        disabled={savingId === product.id || stock <= 0}
                        aria-label={`Decrease ${product.name} stock`}
                        className="grid size-10 place-items-center rounded-xl border border-slate-200 text-[#19334b] hover:bg-slate-50 disabled:opacity-40"
                      >
                        <Minus size={17} />
                      </button>

                      <button
                        onClick={() => setExactStock(product)}
                        disabled={savingId === product.id}
                        className="min-w-16 rounded-xl bg-slate-50 px-3 py-2 text-center font-bold text-[#19334b] hover:bg-[#e4f3fc] disabled:opacity-40"
                        title="Click to set an exact stock quantity"
                      >
                        {savingId === product.id ? "..." : stock}
                      </button>

                      <button
                        onClick={() => changeStock(product, 1)}
                        disabled={savingId === product.id}
                        aria-label={`Increase ${product.name} stock`}
                        className="grid size-10 place-items-center rounded-xl border border-slate-200 text-[#19334b] hover:bg-slate-50 disabled:opacity-40"
                      >
                        <Plus size={17} />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
