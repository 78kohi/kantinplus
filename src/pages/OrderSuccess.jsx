import React, { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { CheckCircle2, Download, Package } from "lucide-react";

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;

export default function OrderSuccess() {
  const { state } = useLocation();

  const handleDownloadReceipt = () => {
    window.print();
  };

  if (!state?.orderId) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffdf5] p-6">
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-[#19334b]">
            Pesanan tidak ditemukan
          </h1>
          <Link to="/" className="mt-4 inline-block font-semibold text-sky-700">
            Kembali ke beranda
          </Link>
        </div>
      </main>
    );
  }

  const { orderId, items = [], total = 0, customerName } = state;

  return (
    <main className="min-h-screen bg-[#fffdf5] px-4 py-12">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-[#19334b]">
          Pembayaran selesai!
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Terima kasih sudah berbelanja di KantinPlus, {customerName}!
        </p>

        <div className="mt-6 rounded-2xl bg-[#f1f8fc] p-4">
          <p className="text-sm text-slate-500">Nomor pesanan</p>
          <p className="mt-1 text-2xl font-extrabold text-[#19334b]">
            #{orderId}
          </p>
        </div>

        <div className="mt-6 text-left">
          <h2 className="flex items-center gap-2 font-bold text-[#19334b]">
            <Package size={19} />
            Ringkasan pesanan
          </h2>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-slate-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold text-[#19334b]">
                  {formatRupiah(Number(item.price || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
            <span className="font-bold text-[#19334b]">Total</span>
            <span className="font-extrabold text-[#19334b]">
              {formatRupiah(total)}
            </span>
          </div>
        </div>

        <button
          onClick={handleDownloadReceipt}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#19334b] bg-white px-5 py-3.5 text-sm font-bold text-[#19334b] transition hover:bg-slate-50 active:scale-[0.99]"
        >
          <Download size={18} />
          Download struk (PDF)
        </button>

        <Link
          to="/"
          className="mt-6 block w-full rounded-xl bg-[#19334b] py-3 font-bold text-white transition hover:bg-[#274b6c]"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
