import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import OrderSummary from "../components/OrderSummary";
import { checkoutWithReward } from "../services/orderService";
import Toast from "../components/Toast";

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;

export default function Payment({
  cartItems = [],
  subtotal = 0,
  onChangeCartQuantity,
  onRemoveFromCart,
  toast,
  onShowToast,
  onClearToast,
  onClearCart,
}) {
  const [orderType, setOrderType] = useState("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [rewardEnabled, setRewardEnabled] = useState(false);
  const [rewardProducts, setRewardProducts] = useState([]);
  const [selectedRewardProductId, setSelectedRewardProductId] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [rewardOnlySuccess, setRewardOnlySuccess] = useState(null);

  const navigate = useNavigate();

  const selectedRewardProduct = rewardProducts.find(
    (product) => String(product.id) === String(selectedRewardProductId),
  );

  const rewardIsInCart = cartItems.some(
    (item) =>
      String(item.id) === String(selectedRewardProductId) &&
      Number(item.quantity) > 0,
  );

  // Remove exactly ONE unit of the selected reward product
  // from the items that will be paid for.
  const paidCartItems = cartItems
    .map((item) => {
      if (
        rewardEnabled &&
        String(item.id) === String(selectedRewardProductId)
      ) {
        const remainingQuantity = Number(item.quantity) - 1;

        if (remainingQuantity <= 0) return null;

        return {
          ...item,
          quantity: remainingQuantity,
        };
      }

      return item;
    })
    .filter(Boolean);

  const paidSubtotal = paidCartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  const rewardOnly = rewardEnabled && paidCartItems.length === 0;

  const shippingCost = orderType === "delivery" && !rewardOnly ? 2000 : 0;

  useEffect(() => {
    let active = true;

    async function loadRewards() {
      setLoadingRewards(true);

      try {
        // Guests are allowed to browse products and check out.
        // A missing session simply means rewards cannot be redeemed.
        let user = null;

        try {
          const { data, error } = await supabase.auth.getSession();

          if (error) throw error;

          user = data?.session?.user ?? null;
        } catch (authError) {
          console.warn("Could not read auth session:", authError);
        }

        if (!active) return;

        setIsAuthenticated(Boolean(user));

        // Load the profile only when a logged-in user exists.
        if (user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("display_name, reward_points")
              .eq("id", user.id)
              .maybeSingle();

            if (profileError) throw profileError;

            if (!active) return;

            if (profile) {
              setRewardPoints(Number(profile.reward_points || 0));
              setCustomerName(
                (current) => current || profile.display_name || "",
              );
            }
          } catch (profileError) {
            console.error("Failed to load reward profile:", profileError);

            if (active) {
              onShowToast(
                "Poin belum bisa dimuat",
                "Profil atau saldo poin belum tersedia. Kamu tetap bisa checkout tanpa reward.",
                "error",
              );
            }
          }
        }

        // Load products for BOTH guests and logged-in users.
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, price, stock, is_available, image_url")
          .eq("is_available", true)
          .gt("stock", 0)
          .order("id");

        if (productsError) throw productsError;

        if (!active) return;

        setRewardProducts(products ?? []);
      } catch (error) {
        console.error("Failed to load checkout products:", error);

        if (active) {
          onShowToast(
            "Gagal memuat produk",
            "Produk belum bisa dimuat. Coba muat ulang halaman.",
            "error",
          );
        }
      } finally {
        if (active) setLoadingRewards(false);
      }
    }

    loadRewards();

    return () => {
      active = false;
    };
  }, []);

  const handleRewardToggle = (enabled) => {
    setRewardEnabled(enabled);
    setSelectedRewardProductId("");

    if (enabled && cartItems.length === 0) {
      setOrderType("pickup");
    }
  };

  const handlePlaceOrder = async () => {
    if (submitting) return;

    if (!customerName.trim()) {
      onShowToast(
        "Nama belum diisi",
        "Masukkan nama pemesan terlebih dahulu.",
        "error",
      );
      return;
    }

    if (cartItems.length === 0 && !rewardEnabled) {
      onShowToast(
        "Keranjang kosong",
        "Tambahkan produk atau pilih produk reward terlebih dahulu.",
        "error",
      );
      return;
    }

    if (rewardEnabled && !isAuthenticated) {
      onShowToast(
        "Login diperlukan",
        "Login terlebih dahulu untuk menukarkan poin reward.",
        "error",
      );
      return;
    }

    if (rewardEnabled && !selectedRewardProductId) {
      onShowToast(
        "Pilih produk reward",
        "Pilih produk yang ingin kamu tukarkan dengan poin.",
        "error",
      );
      return;
    }

    if (rewardEnabled && cartItems.length > 0 && !rewardIsInCart) {
      onShowToast(
        "Produk tidak ada di keranjang",
        "Untuk menukarkan produk, tambahkan produk tersebut ke keranjang terlebih dahulu.",
        "error",
      );
      return;
    }

    if (rewardOnly && orderType !== "pickup") {
      onShowToast(
        "Reward hanya untuk pickup",
        "Penukaran reward tanpa pembelian lain hanya tersedia untuk ambil di stand.",
        "error",
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await checkoutWithReward({
        cart: paidCartItems,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        rewardProductId: rewardEnabled ? Number(selectedRewardProductId) : null,
        orderType: rewardOnly ? "pickup" : orderType,
      });

      const orderId = result.order_id;

      onClearCart();

      if (!result.payment_required) {
        setRewardOnlySuccess({
          product:
            rewardProducts.find(
              (product) =>
                String(product.id) === String(selectedRewardProductId),
            )?.name || "Produk reward",
          pointsSpent: result.points_spent,
          remainingPoints: result.remaining_points,
          redemptionId: result.redemption_id,
        });

        setRewardPoints(Number(result.remaining_points || 0));
        setRewardEnabled(false);
        setSelectedRewardProductId("");

        onShowToast(
          "Reward berhasil ditukarkan!",
          "Produk reward siap diambil di stand.",
          "success",
        );

        return;
      }

      const orderDetails = {
        orderId,
        items: paidCartItems,
        total: paidSubtotal + shippingCost,
        customerName,
        guestToken: result.guest_token ?? null,
      };

      navigate("/pembayaran", { state: orderDetails });

      navigate("/pembayaran", {
        state: orderDetails,
      });
    } catch (error) {
      console.error("Checkout failed:", error);

      const message = error?.message || "";

      if (/stock|stok|available|availability|unavailable/i.test(message)) {
        onShowToast(
          "Stok berubah",
          "Stok produk mungkin sudah berubah. Periksa keranjangmu lalu coba lagi.",
          "error",
        );
      } else if (/points|poin|profile|sign in|authenticated/i.test(message)) {
        onShowToast(
          "Reward belum berhasil",
          "Periksa login dan saldo poinmu, lalu coba lagi.",
          "error",
        );
      } else {
        onShowToast(
          "Pesanan gagal",
          "Checkout belum berhasil. Tidak ada poin yang seharusnya terpotong jika transaksi gagal. Silakan coba lagi.",
          "error",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (rewardOnlySuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8F3] px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#e8e4d8] bg-[#fffdf5] p-8 text-center shadow-[0_12px_40px_rgba(25,51,75,0.08)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            🎁
          </div>

          <h2 className="text-2xl font-extrabold text-[#19334b]">
            Reward berhasil ditukarkan!
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Kamu berhasil menukarkan poin untuk:
          </p>

          <p className="mt-1 text-lg font-extrabold text-[#19334b]">
            {rewardOnlySuccess.product}
          </p>

          <div className="mt-5 rounded-xl bg-[#eaf5fe] p-4 text-sm">
            <p className="text-slate-600">
              Poin digunakan: <strong>{rewardOnlySuccess.pointsSpent}</strong>
            </p>
            <p className="mt-1 text-slate-600">
              Sisa poin: <strong>{rewardOnlySuccess.remainingPoints}</strong>
            </p>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Ambil produkmu langsung di stand. Tidak ada pembayaran QRIS untuk
            penukaran reward-only.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-[#19334b] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#274b6c]"
          >
            Kembali ke produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-center space-x-4 text-sm font-semibold text-slate-400 sm:space-x-8">
          <span className="text-slate-500">1. Shopping cart</span>
          <span>&gt;</span>
          <span className="border-b-2 border-[#19334b] pb-1 font-bold text-[#19334b]">
            2. Checkout
          </span>
          <span>&gt;</span>
          <span>3. Successful</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="space-y-6 rounded-2xl border border-[#e8e4d8] bg-[#fffdf5] p-6 shadow-[0_12px_40px_rgba(25,51,75,0.08)]">
            <h3 className="text-xl font-extrabold text-[#19334b]">
              Detail pembayaran
            </h3>

            <div className="space-y-3">
              <label className="text-sm font-bold text-[#19334b]">
                Pilihan pengiriman
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { value: "delivery", label: "Diantar" },
                  { value: "pickup", label: "Ambil di stand" },
                ].map((option) => {
                  const disabled = rewardOnly && option.value === "delivery";

                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center rounded-xl border p-3 transition ${
                        orderType === option.value
                          ? "border-[#19334b] bg-[#eaf5fe] text-[#19334b]"
                          : "border-[#e8e4d8] bg-white text-slate-600 hover:bg-[#f7fbff]"
                      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <input
                        type="radio"
                        name="orderType"
                        value={option.value}
                        checked={orderType === option.value}
                        disabled={disabled}
                        onChange={() => setOrderType(option.value)}
                        className="mr-3 text-[#19334b]"
                      />
                      <span className="text-sm font-semibold">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500">
                {rewardOnly
                  ? "Reward-only wajib diambil langsung di stand."
                  : orderType === "delivery"
                    ? "Biaya pengiriman Rp2.000."
                    : "Pesanan siap diambil langsung di stand."}
              </p>
            </div>

            <div className="space-y-4 border-t border-[#e8e4d8] pt-4">
              <h4 className="text-sm font-extrabold text-[#19334b]">
                Billing details
              </h4>

              {orderType === "delivery" && !rewardOnly && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600">
                    Alamat pengiriman
                  </label>
                  <input
                    type="text"
                    placeholder="Di mana pesanan akan diantarkan?"
                    className="w-full rounded-xl border border-[#dfe7ee] bg-[#fffdf5] px-4 py-2.5 text-sm text-[#19334b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a2d6f9]"
                  />
                  <p className="mt-1 text-xs text-amber-700">
                    Catatan: alamat ini belum disimpan ke database pesanan.
                  </p>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Nama pelanggan
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Nama kamu"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-[#dfe7ee] bg-[#fffdf5] px-4 py-2.5 text-sm text-[#19334b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a2d6f9]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Nomor telepon
                </label>
                <input
                  type="text"
                  placeholder="Nomor telepon aktif"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  className="w-full rounded-xl border border-[#dfe7ee] bg-[#fffdf5] px-4 py-2.5 text-sm text-[#19334b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a2d6f9]"
                />
              </div>
            </div>
          </div>

          <div>
            {loadingRewards ? (
              <div className="rounded-2xl border border-[#e8e4d8] bg-[#fffdf5] p-6 text-sm text-slate-500">
                Memuat poin dan produk reward...
              </div>
            ) : (
              <OrderSummary
                items={paidCartItems}
                subtotal={paidSubtotal}
                shippingCost={shippingCost}
                orderType={rewardOnly ? "pickup" : orderType}
                onChangeQuantity={onChangeCartQuantity}
                onRemove={onRemoveFromCart}
                onPlaceOrder={handlePlaceOrder}
                submitting={submitting}
                rewardEnabled={rewardEnabled}
                onToggleReward={handleRewardToggle}
                rewardProducts={rewardProducts}
                selectedRewardProductId={selectedRewardProductId}
                onSelectRewardProduct={setSelectedRewardProductId}
                rewardPoints={rewardPoints}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={onClearToast}
        />
      )}
    </div>
  );
}
