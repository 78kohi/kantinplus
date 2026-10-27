import React from 'react';

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;

export default function OrderSummary({
  items = [],
  subtotal = 0,
  shippingCost = 10000,
  orderType = 'delivery',
  onChangeQuantity,
  onRemove,
}) {
  const total = subtotal + shippingCost;
  const shippingLabel = orderType === 'delivery' ? 'Delivery' : 'Pickup';

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#e8e4d8] bg-[#fffdf5] p-6 shadow-[0_12px_40px_rgba(25,51,75,0.08)]">
      <div className="mb-4 border-b border-[#e8e4d8] pb-2">
        <h3 className="text-xl font-extrabold text-[#19334b]">Ringkasan Pembayaran</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
          {orderType === 'delivery' ? 'Diantar' : 'Ambil di stand'}
        </p>
      </div>

      <div className="mb-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada produk di keranjang.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-[#e8e4d8] pb-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1.5"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#19334b]">{item.name}</h4>
                  <p className="text-xs text-slate-500">
                    {item.quantity} {item.quantity > 1 ? 'pcs' : 'pc'}
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

      <div className="space-y-2 border-t border-[#e8e4d8] pt-4 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold !font-inter text-[#19334b]">{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>{shippingLabel}</span>
          <span className="font-bold !font-inter text-[#19334b]">{formatRupiah(shippingCost)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#e8e4d8] pt-3 text-base font-extrabold text-[#19334b]">
          <span>Total</span>
          <span className="text-lg font-black !font-inter text-[#19334b]">{formatRupiah(total)}</span>
        </div>
      </div>

      <button
        onClick={() => alert('Pesanan Gabin Fla berhasil diproses!')}
        className="mt-6 w-full rounded-xl bg-[#19334b] py-3 text-sm font-extrabold text-white shadow-lg shadow-[#19334b]/15 transition hover:bg-[#274b6c]"
      >
        Place Order
      </button>
    </div>
  );
}