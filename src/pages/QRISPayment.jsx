
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Clock3, QrCode } from "lucide-react";

export default function QRISPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.orderId) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="text-center space-y-3">
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

  const { orderId, total, customerName } = state;

  const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

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
              Pay with QRIS
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Hi, {customerName}! Complete your payment for order #{orderId}.
            </p>
          </div>

          <div className="my-6 rounded-2xl bg-slate-50 p-5 text-center">
            <p className="text-sm text-slate-500">Total payment</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {formatRupiah(total)}
            </p>
          </div>

          {/* Replace this placeholder with your real QRIS image later. */}
          <div className="mx-auto flex aspect-square w-full max-w-[260px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <QrCode size={64} className="text-slate-400" />

            <p className="font-semibold text-slate-700">
              QRIS placeholder
            </p>

            <p className="text-sm text-slate-500">
              Your real payment QR code will appear here.
            </p>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            <Clock3 size={20} className="mt-0.5 shrink-0" />
            <p>
              Your order is awaiting payment. This placeholder cannot be
              scanned. Please pay only when the real QRIS code is available.
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
