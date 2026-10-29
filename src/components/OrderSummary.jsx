import React from "react";

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;

export default function OrderSummary({
  items = [],
  subtotal = 0,
  shippingCost = 0,
  orderType = "pickup",
  onChangeQuantity,
  onRemove,
  onPlaceOrder,
  submitting = false,
  orderId = null,
  rewardEnabled = false,
  onToggleReward,
  rewardProducts = [],
  selectedRewardProductId = "",
  onSelectRewardProduct,
  rewardPoints = 0,
  isAuthenticated = false,
}) {
  const selectedReward = rewardProducts.find(
    (product) => String(product.id) === String(selectedRewardProductId),
  );

  const pointsRequired = selectedReward
    ? Math.ceil(Number(selectedReward.price) / 1000)
    : 0;

  const rewardOnly = items.length === 0 && rewardEnabled;
  const total = subtotal + (rewardOnly ? 0 : shippingCost);
  const canRedeem =
    isAuthenticated && rewardPoints >= pointsRequired && pointsRequired > 0;

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#e8e4d8] bg-[#fffdf5] p-6 shadow-[0_12px_40px_rgba(25,51,75,0.08)]">
      <div className="mb-4 border-b border-[#e8e4d8] pb-2">
        <h3 className="text-xl font-extrabold text-[#19334b]">
          Ringkasan Pembayaran
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
          {rewardOnly
            ? "Penukaran reward · Ambil di stand"
            : orderType === "delivery"
              ? "Diantar"
              : "Ambil di stand"}
        </p>
      </div>

      <div className="mb-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada produk reguler di keranjang.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-[#e8e4d8] pb-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-12 w-12 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1.5"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#19334b]">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {item.quantity} {item.quantity > 1 ? "pcs" : "pc"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-extrabold text-[#19334b]">
                  {formatRupiah(Number(item.price || 0) * item.quantity)}
                </span>

                {onChangeQuantity && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => onChangeQuantity(item.id, -1)}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-100"
                      aria-label={`Kurangi ${item.name}`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => onChangeQuantity(item.id, 1)}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-100"
                      aria-label={`Tambah ${item.name}`}
                    >
                      +
                    </button>

                    {onRemove && (
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="ml-1 text-rose-500 hover:text-rose-600"
                        aria-label={`Hapus ${item.name}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mb-5 rounded-xl border border-[#d9eaf7] bg-[#f0f8ff] p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={rewardEnabled}
            onChange={(event) => onToggleReward?.(event.target.checked)}
            className="mt-1 accent-[#19334b]"
          />

          <span>
            <span className="block text-sm font-extrabold text-[#19334b]">
              Tukarkan poin dengan produk
            </span>
            <span className="mt-1 block text-xs text-slate-600">
              Gunakan poin untuk mengambil satu produk gratis.
            </span>
          </span>
        </label>

        {rewardEnabled && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-bold text-[#19334b]">
              Poin tersedia: {rewardPoints}
            </p>

            {!isAuthenticated ? (
              <p className="text-xs text-rose-600">
                Login terlebih dahulu untuk menukarkan poin.
              </p>
            ) : (
              <>
                <label
                  htmlFor="reward-product"
                  className="block text-xs font-bold text-slate-600"
                >
                  Pilih produk reward
                </label>

                <select
                  id="reward-product"
                  value={selectedRewardProductId}
                  onChange={(event) =>
                    onSelectRewardProduct?.(event.target.value)
                  }
                  className="w-full rounded-xl border border-[#dfe7ee] bg-white px-3 py-2.5 text-sm text-[#19334b] focus:outline-none focus:ring-2 focus:ring-[#a2d6f9]"
                >
                  <option value="">Pilih produk...</option>

                  {rewardProducts.map((product) => {
                    const cost = Math.ceil(Number(product.price) / 1000);

                    return (
                      <option key={product.id} value={product.id}>
                        {product.name} — {cost} poin
                      </option>
                    );
                  })}
                </select>

                {selectedReward && (
                  <div className="rounded-lg bg-white p-3 text-sm">
                    <p className="font-bold text-[#19334b]">
                      {selectedReward.name}
                    </p>
                    <p className="mt-1 text-slate-600">
                      Biaya: {pointsRequired} poin
                    </p>
                    <p className="text-slate-600">
                      Sisa poin: {rewardPoints - pointsRequired}
                    </p>

                    {!canRedeem && (
                      <p className="mt-2 text-xs font-semibold text-rose-600">
                        Poin kamu belum cukup.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-[#e8e4d8] pt-4 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal produk reguler</span>
          <span className="font-bold text-[#19334b]">
            {formatRupiah(subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>{orderType === "delivery" ? "Delivery" : "Pickup"}</span>
          <span className="font-bold text-[#19334b]">
            {formatRupiah(rewardOnly ? 0 : shippingCost)}
          </span>
        </div>

        {selectedReward && rewardEnabled && (
          <div className="flex justify-between text-sky-700">
            <span>Produk reward</span>
            <span className="font-bold">−{pointsRequired} poin</span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#e8e4d8] pt-3 text-base font-extrabold text-[#19334b]">
          <span>Total bayar</span>
          <span className="text-lg font-black">{formatRupiah(total)}</span>
        </div>
      </div>

      {orderId ? (
        <div
          role="status"
          className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center"
        >
          <h4 className="font-extrabold text-green-800">
            Pesanan berhasil dibuat!
          </h4>
          <p className="mt-1 text-sm text-green-700">
            Nomor pesanan: #{orderId}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={
            submitting ||
            (items.length === 0 && !rewardEnabled) ||
            (rewardEnabled &&
              (!isAuthenticated || !selectedReward || !canRedeem))
          }
          className="mt-6 w-full rounded-xl bg-[#19334b] py-3 text-sm font-extrabold text-white shadow-lg shadow-[#19334b]/15 transition hover:bg-[#274b6c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Memproses pesanan..."
            : rewardOnly
              ? "Tukarkan poin"
              : "Place Order"}
        </button>
      )}
    </div>
  );
}
