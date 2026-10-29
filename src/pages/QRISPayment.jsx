import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Clock3, Download, QrCode } from "lucide-react";
import qris from "../assets/qris.jpg";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function QRISPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);

  const { orderId, items, total, customerName } = state ?? {};

  useEffect(() => {
    if (!orderId) return;

    let active = true;

    async function checkPayment() {
      const { data, error } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("id", orderId)
        .maybeSingle();

      if (error) {
        console.error("Payment status check failed:", error.message);
        return;
      }

      if (active && data?.payment_status === "paid") {
        navigate("/pesanan-berhasil", {
          state: {
            orderId,
            items,
            total,
            customerName,
          },
          replace: true,
        });
      }
    }

    checkPayment();

    const interval = setInterval(checkPayment, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (!state?.orderId) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="space-y-3 text-center">
          <p>No order details found.</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-slate-900 px-5 py-2 text-white"
          >
            Back to home
          </button>
        </div>
      </main>
    );
  }

  const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md space-y-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to home
        </button>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <QrCode size={30} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Bayar dengan QRIS
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Hi, {customerName || "there"}! Selesaikan pembayaran anda untuk
              pesanan #{orderId}.
            </p>
          </div>

          <div className="my-6 rounded-2xl bg-slate-50 p-5 text-center">
            <p className="text-sm text-slate-500">Total payment</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {formatRupiah(total)}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
            <img
              src={qris}
              alt="Merchant QRIS payment code"
              className="block h-auto w-full object-contain"
            />
            <a
              href={qris}
              download="KantinPlus-QRIS.jpg"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#19334b] px-4 py-3 font-bold text-[#19334b] transition hover:bg-slate-50"
            >
              <Download size={18} />
              Download QRIS
            </a>
          </div>

          <p className="mt-3 text-center text-xs text-slate-500">
            Scan QRIS ini menggunakan aplikasi pembayaran yang didukung.
          </p>

          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-semibold">Cara pembayaran</p>
            <ol className="mt-2 list-inside list-decimal space-y-2">
              <li>Scan QRIS di atas.</li>
              <li>
                Masukkan nominal persis seperti yang tertera{" "}
                <strong>{formatRupiah(total)}</strong>.
              </li>
              <li>Verifikasi nama merchant dan nominal sebelum membayar.</li>
              <li>
                Simpan struk dan tunggu kasir/pengirim untuk memverifikasi
                pembayaran anda.
              </li>
            </ol>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            <Clock3 size={20} className="mt-0.5 shrink-0" />
            <p>
              Order #{orderId} sedang menunggu konfirmasi pembayaran. Pesanan
              anda akan tetap tertunda sebelum kasir/pengirim memverifikasi
              pembayaran anda.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            Return to home
          </button>
        </section>
      </div>
    </main>
  );
}
