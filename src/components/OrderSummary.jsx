import React from 'react';

export default function OrderSummary({ subtotal = 33000, shippingCost = 10000 }) {
  const total = subtotal + shippingCost;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 max-w-md w-full">
      <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Order details</h3>

      {/* Daftar Item Gabin Fla */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">Fla</div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Gabin Fla Original Susu</h4>
              <p className="text-slate-500 text-xs">2 pcs</p>
            </div>
          </div>
          <span className="font-bold text-blue-900 text-sm">Rp 30.000</span>
        </div>
      </div>

      {/* Rincian Harga */}
      <div className="space-y-2 text-sm text-slate-600 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-semibold text-slate-800">Rp {shippingCost.toLocaleString('id-ID')}</span>
        </div>
        <div className="border-t pt-3 flex justify-between items-center text-base font-bold text-slate-900">
          <span>Total</span>
          <span className="text-blue-900 text-lg">Rp {total.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Tombol Aksi */}
      <button 
        onClick={() => alert('Pesanan Gabin Fla berhasil diproses!')}
        className="w-full mt-6 bg-blue-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
      >
        Place Order
      </button>
    </div>
  );
}