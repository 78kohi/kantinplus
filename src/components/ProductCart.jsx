import React from 'react';

export default function ProductCart({ cartItems = [], onUpdateQuantity, onRemoveItem }) {
  // Hitung total harga keseluruhan
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 max-w-md w-full">
      <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Keranjang Belanja</h3>

      {cartItems.length === 0 ? (
        <p className="text-slate-500 text-center py-8 text-sm">Keranjang kamu masih kosong, nih.</p>
      ) : (
        <div className="space-y-4">
          {/* Daftar Item di Keranjang */}
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-blue-900 text-xs font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Tombol Kurangi Kuantitas */}
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-slate-700 hover:bg-slate-200"
                >
                  -
                </button>
                <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                {/* Tombol Tambah Kuantitas */}
                <button 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800"
                >
                  +
                </button>
                {/* Tombol Hapus Item */}
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 text-xs font-semibold ml-2 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {/* Bagian Total Harga */}
          <div className="pt-4 flex items-center justify-between font-bold text-slate-900 text-base">
            <span>Total:</span>
            <span className="text-blue-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>

          <button className="w-full mt-4 bg-blue-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition">
            Checkout Sekarang
          </button>
        </div>
      )}
    </div>
  );
}