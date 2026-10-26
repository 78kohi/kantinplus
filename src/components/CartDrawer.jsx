import { useEffect, useState } from 'react'

const formatRupiah = (amount) => `Rp ${Number(amount || 0).toLocaleString('id-ID')}`

export default function CartDrawer({
  isOpen,
  items = [],
  onClose,
  onChangeQuantity,
  onRemove,
}) {
  const [checkoutNotice, setCheckoutNotice] = useState('')
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0)

  useEffect(() => {
    if (!isOpen) {
      setCheckoutNotice('')
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        aria-label="Tutup keranjang"
        className={`absolute inset-0 h-full w-full bg-slate-950/45 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        role="dialog"
        aria-modal={isOpen ? 'true' : undefined}
        aria-label="Keranjang belanja"
        className={`absolute bottom-0 left-0 flex h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-[#fffdf5] text-[#19334b] shadow-2xl transition-transform duration-300 ease-out md:bottom-0 md:left-auto md:right-0 md:top-0 md:h-full md:max-h-none md:w-[440px] md:max-w-[92vw] md:rounded-none ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
      >
        <header className="shrink-0 border-b border-[#e8e4d8] px-5 pb-4 pt-2 md:px-6 md:pt-6">
          <div className="mx-auto mb-3 mt-1 h-1.5 w-12 rounded-full bg-slate-300 md:hidden" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold md:text-2xl">Keranjang</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {totalItems} {totalItems === 1 ? 'item' : 'item'} di keranjang
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup keranjang"
              className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              ×
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
          {items.length === 0 ? (
            <div className="flex h-full min-h-56 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-[#5fa8d3]">
                <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Keranjangmu masih kosong</h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500">Yuk, pilih Gabin Fla favoritmu untuk ditambahkan ke keranjang.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-full bg-[#a2d6f9] px-5 py-2.5 font-bold text-[#19334b] transition hover:bg-sky-300"
              >
                Pilih Produk
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="flex gap-3 rounded-2xl border border-[#e8e4d8] bg-white p-3 shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#19334b]">{item.name}</p>
                        {item.variant && <p className="mt-0.5 text-xs text-slate-500">Varian {item.variant}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove?.(item.id)}
                        aria-label={`Hapus ${item.name} dari keranjang`}
                        title="Hapus produk"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                      >
                        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-extrabold text-emerald-600">{formatRupiah(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onChangeQuantity?.(item.id, -1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Kurangi jumlah ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-base font-bold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        −
                      </button>
                      <span className="min-w-5 text-center text-sm font-bold" aria-label={`Jumlah ${item.quantity}`}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onChangeQuantity?.(item.id, 1)}
                        aria-label={`Tambah jumlah ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-base font-bold transition hover:bg-slate-100"
                      >
                        +
                      </button>
                      <span className="ml-auto text-xs font-semibold text-slate-500">{formatRupiah(Number(item.price || 0) * item.quantity)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-[#e8e4d8] bg-[#fffdf5] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 md:px-6 md:pb-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-extrabold">Subtotal</p>
              <p className="text-xs text-slate-500">Total harga produk di keranjang</p>
            </div>
            <p className="text-xl font-black text-[#19334b]">{formatRupiah(subtotal)}</p>
          </div>
          {checkoutNotice && <p role="status" className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">{checkoutNotice}</p>}
          <button
            type="button"
            onClick={onClose}
            className="mb-2 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-sm font-extrabold text-[#19334b] transition hover:bg-slate-50"
          >
            Lanjut Belanja
          </button>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => setCheckoutNotice('Fitur checkout belum terhubung ke sistem transaksi. Isi keranjangmu tetap tersimpan.')}
            className="w-full rounded-xl bg-[#19334b] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#274b6c] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Checkout
          </button>
        </footer>
      </aside>
    </div>
  )
}
