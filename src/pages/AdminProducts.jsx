import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const emptyProduct = {
  name: "",
  description: "",
  flavor: "",
  price: "10000",
  image_url: "",
  stock: "0",
  is_available: true,
};

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

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

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyProduct });
    setError("");
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      flavor: product.flavor || "",
      price: String(product.price ?? ""),
      image_url: product.image_url || "",
      stock: String(product.stock ?? 0),
      is_available: product.is_available ?? true,
    });
    setError("");
    setShowForm(true);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const price = Number(form.price);
      const stock = Number(form.stock);

      if (!form.name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!Number.isFinite(price) || price < 0) {
        throw new Error("Enter a valid product price.");
      }

      if (!Number.isInteger(stock) || stock < 0) {
        throw new Error("Stock must be a whole number of 0 or more.");
      }

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        flavor: form.flavor.trim(),
        price,
        image_url: form.image_url.trim(),
        stock,
        is_available: form.is_available,
      };

      const result = editingId
        ? await supabase
            .from("products")
            .update(productData)
            .eq("id", editingId)
        : await supabase.from("products").insert(productData);

      if (result.error) throw result.error;

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyProduct });

      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This may fail if the product is referenced by existing orders.`,
    );

    if (!confirmed) return;

    setError("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setError(
        "Could not delete this product. If it has existing orders, deactivate it instead. " +
          error.message,
      );
      return;
    }

    await loadProducts();
  }

  async function toggleAvailability(product) {
    setError("");

    const { error } = await supabase
      .from("products")
      .update({ is_available: !product.is_available })
      .eq("id", product.id);

    if (error) {
      setError(error.message);
      return;
    }

    await loadProducts();
  }

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
              Product Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Add, edit, and manage your KantinPlus products.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-[#19334b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#284d69]"
          >
            <Plus size={18} />
            Add Product
          </button>
        </header>

        {error && (
          <div className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button onClick={() => setError("")} aria-label="Dismiss error">
              <X size={18} />
            </button>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#19334b]">
                {editingId ? "Edit Product" : "New Product"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Product name *
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-[#5fa8d3]"
                  placeholder="Gabin Fla Cokelat"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Flavor
                <input
                  name="flavor"
                  value={form.flavor}
                  onChange={updateField}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-[#5fa8d3]"
                  placeholder="Cokelat"
                />
              </label>

              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-[#5fa8d3]"
                  placeholder="Describe your product..."
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Price (Rp) *
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={updateField}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-[#5fa8d3]"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Stock *
                <input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={updateField}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-[#5fa8d3]"
                />
              </label>

              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Image URL / path
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={updateField}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-[#5fa8d3]"
                  placeholder="/src/assets/gabin-choco.png"
                />
                <span className="mt-1 block text-xs text-slate-400">
                  Use a path your frontend can load, or a publicly accessible
                  image URL.
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700 sm:col-span-2">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={form.is_available}
                  onChange={updateField}
                  className="size-4 accent-[#19334b]"
                />
                Available for customers to purchase
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#19334b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#284d69] disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Product"}
              </button>
            </div>
          </form>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-[#19334b]">
              Products ({products.length})
            </h2>
          </div>

          {loading ? (
            <p className="p-8 text-sm text-slate-500">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="p-10 text-center">
              <Package className="mx-auto text-slate-300" size={36} />
              <p className="mt-3 font-semibold text-[#19334b]">
                No products yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#19334b]">{product.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.flavor || "No flavor specified"}
                    </p>
                    <p className="mt-2 font-semibold text-[#19334b]">
                      {formatRupiah(product.price)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Stock: {product.stock}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.is_available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleAvailability(product)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {product.is_available ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => openEditForm(product)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#e4f3fc] px-3 py-2 text-xs font-semibold text-[#19334b] hover:bg-[#d3ebfa]"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
