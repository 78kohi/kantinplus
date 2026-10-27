import React, { useState } from 'react';
import { Link } from 'react-router';
import OrderSummary from '../components/OrderSummary';

export default function Payment({
  cartItems = [],
  subtotal = 0,
  onChangeCartQuantity,
  onRemoveFromCart,
}) {
  const [orderType, setOrderType] = useState('delivery');
  const shippingCost = orderType === 'delivery' ? 10000 : 0;

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8f3] px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-[#e8e4d8] bg-[#fffdf5] p-8 text-center shadow-[0_12px_40px_rgba(25,51,75,0.08)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#a2d6f9] text-3xl text-[#19334b]">
            🛒
          </div>
          <h2 className="text-2xl font-extrabold text-[#19334b]">Keranjang masih kosong</h2>
          <p className="mt-2 text-sm text-slate-500">
            Pilih produk favoritmu dulu sebelum lanjut ke checkout.
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
        <div className="mb-10 flex items-center justify-center space-x-8 text-sm font-semibold text-slate-400">
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
            <h3 className="text-xl font-extrabold text-[#19334b]">Detail pembayaran</h3>

            <div className="space-y-3">
              <label className="text-sm font-bold text-[#19334b]">Pilihan pengiriman</label>

              <div className="grid gap-2 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                    orderType === 'delivery'
                      ? 'border-[#19334b] bg-[#eaf5fe] text-[#19334b]'
                      : 'border-[#e8e4d8] bg-white text-slate-600 hover:bg-[#f7fbff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === 'delivery'}
                      onChange={() => setOrderType('delivery')}
                      className="text-[#19334b]"
                    />
                    <span className="text-sm font-semibold">Diantar</span>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                    orderType === 'pickup'
                      ? 'border-[#19334b] bg-[#eaf5fe] text-[#19334b]'
                      : 'border-[#e8e4d8] bg-white text-slate-600 hover:bg-[#f7fbff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === 'pickup'}
                      onChange={() => setOrderType('pickup')}
                      className="text-[#19334b]"
                    />
                    <span className="text-sm font-semibold">Ambil di stand</span>
                  </div>
                </label>
              </div>

              <p className="text-xs text-slate-500">
                {orderType === 'delivery'
                  ? 'Pesanan akan dikirim ke lokasi pelanggan.'
                  : 'Pesanan siap diambil langsung di stand kami.'}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-[#19334b]">Metode pembayaran</label>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center space-x-3 rounded-xl border border-[#e8e4d8] p-3 transition hover:bg-[#f7fbff]">
                  <input type="radio" name="payment" defaultChecked className="text-[#19334b]" />
                  <span className="text-sm font-medium text-[#19334b]">
                    Bayar dengan E-Wallet / QRIS
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#e8e4d8] pt-4">
              <h4 className="text-sm font-extrabold text-[#19334b]">Billing details</h4>

              {orderType === 'delivery' && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600">
                    Alamat pengiriman
                  </label>
                  <input
                    type="text"
                    placeholder="Dimana pesanan akan diantarkan"
                    className="w-full rounded-xl border border-[#dfe7ee] bg-[#fffdf5] px-4 py-2.5 text-sm text-[#19334b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a2d6f9]"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  placeholder="Nomor telepon aktif"
                  className="w-full rounded-xl border border-[#dfe7ee] bg-[#fffdf5] px-4 py-2.5 text-sm text-[#19334b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a2d6f9]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Kode Kupon
                </label>
                <input
                  type="text"
                  placeholder="Promo code"
                  className="w-full rounded-xl border border-[#dfe7ee] bg-[#fffdf5] px-4 py-2.5 text-sm text-[#19334b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a2d6f9]"
                />
              </div>
            </div>
          </div>

          <div>
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              orderType={orderType}
              onChangeQuantity={onChangeCartQuantity}
              onRemove={onRemoveFromCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}