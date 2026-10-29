# KantinPlus

KantinPlus adalah aplikasi web kantin kejujuran berbasis sekolah yang dibuat sebagai proyek sekolah. Aplikasi ini memungkinkan pelanggan melihat produk yang tersedia, membuat pesanan, dan mengikuti alur pembayaran QRIS. KantinPlus juga memiliki sistem poin reward untuk pengguna yang masuk ke akun serta halaman pengelolaan pesanan untuk admin.

> **Status proyek:** Proyek sekolah yang masih dapat dikembangkan.

## Fitur

- Melihat produk yang tersedia beserta detailnya.
- Menambahkan produk ke keranjang dan mengubah jumlahnya.
- Checkout sebagai tamu maupun pengguna yang sudah masuk ke akun.
- Alur pembayaran QRIS dengan pengecekan status pembayaran.
- Halaman pesanan berhasil dan detail pesanan.
- Poin reward untuk pengguna yang memenuhi ketentuan.
- Menukarkan poin dengan produk yang memenuhi syarat, termasuk keranjang campuran yang berisi produk berbayar.
- Riwayat pesanan dan fitur profil bagi pengguna yang masuk ke akun.
- Pengelolaan pesanan khusus admin.
- Penyimpanan data dan autentikasi menggunakan Supabase.

Beberapa fitur bergantung pada skema database, kebijakan Supabase, dan konfigurasi environment yang digunakan.

## Teknologi yang digunakan

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Supabase (database PostgreSQL, autentikasi, dan fungsi RPC)

## Kontributor

KantinPlus dikembangkan secara kolaboratif sebagai bagian dari proyek kokurikuler Kantin Kejujuran.

Terima kasih kepada semua anggota tim yang telah berkontribusi dalam perencanaan, desain, pengembangan, pengujian, dan penyempurnaan proyek ini.

### Tim pengembang

| Nama | Peran
|---|---|
| Ganta  [@78kohi](https://github.com/78kohi) | Project leader & Fullstack developer |
| Morin  [@mylope<3](https://github.com/cintakuw) | UI/UX Designer & Product Manager |
| Yuan  [@yuannn15](https://github.com/yuannn15) | Frontend developer |
| Pistio  [@pstakaa](https://github.com/pstakaa) | Backend developer |
| Barra  [@barra](https://github.com/mboh) | Frontend developer |
| Juna  [@junz](https://github.com/gaero) | QA Tester
| Aura  [@rawisnainiyuda](https://github.com/rawisnainiyuda) | Frontend developer |

## 💗 Special Thanks

A special shoutout to my girlfriend, **Morin**, for being part of this journey and contributing to KantinPlus. Thank you for the support, effort, and memories throughout this project! <3

## Persyaratan

Sebelum menjalankan proyek, pastikan perangkat sudah memiliki:

- Node.js (disarankan menggunakan versi LTS terbaru)
- npm
- Proyek Supabase dengan skema database, fungsi SQL, dan kebijakan Row Level Security yang diperlukan

## Cara menjalankan proyek

### 1. Clone repositori

```bash
git clone https://github.com/78kohi/kantinplus.git
cd kantinplus
```

### 2. Instal dependensi

```bash
npm install
```

### 3. Atur environment variable

Buat file `.env` di direktori utama proyek. Gunakan nama variabel yang sesuai dengan file `src/lib/supabaseClient.js`. Contoh konfigurasi Vite dengan Supabase:

```env
VITE_SUPABASE_URL=https://czmaopcuvvfkqjbbhluh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_1H8T6taPF_qKWK4HfOwPQg_IaRoiHsp
```

Periksa `src/lib/supabaseClient.js` untuk memastikan nama variabelnya benar.

Setelah mengubah `.env`, jalankan ulang server pengembangan.

### 4. Jalankan server pengembangan

```bash
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal.

### 5. Build untuk produksi

```bash
npm run build
```

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

## Pengaturan Supabase

KantinPlus menggunakan Supabase untuk menyimpan data, autentikasi, dan menjalankan operasi database.

Sebelum menguji aplikasi, pastikan proyek Supabase memiliki tabel dan kolom yang digunakan oleh kode saat ini, termasuk bagian yang diperlukan dari:

- `products`
- `profiles`
- `orders`
- `order_items`
- `reward_redemptions`

Aplikasi ini juga menggunakan fungsi database/RPC seperti:

- `create_order`
- `checkout_with_reward`
- `get_guest_order_payment_status`

Definisi fungsi SQL dan kebijakan Row Level Security (RLS) harus sesuai dengan versi frontend yang digunakan. Jangan menonaktifkan RLS sebagai solusi sementara; periksa kebijakan tiap tabel dan izin fungsi dengan teliti.

### Akses status pembayaran untuk tamu

Checkout tamu menggunakan token acak. Database menyimpan hash token, sedangkan token aslinya digunakan oleh frontend untuk memanggil `get_guest_order_payment_status` pada pesanan yang sesuai. Jaga kerahasiaan token ini dan jangan menampilkannya di log, tautan publik, atau data lain yang tidak berkaitan.

## Alur utama aplikasi

### Checkout pelanggan

1. Buka daftar produk yang tersedia.
2. Tambahkan produk ke keranjang dan periksa jumlahnya.
3. Isi informasi pelanggan yang diperlukan.
4. Buat pesanan.
5. Jika pembayaran diperlukan, lanjutkan ke halaman QRIS.
6. Setelah status pembayaran diubah menjadi `paid`, aplikasi dapat mengarahkan pengguna ke halaman pesanan berhasil.

### Penukaran poin reward

Penukaran poin membutuhkan akun yang sudah masuk dan saldo poin yang mencukupi. Periksa aturan terbaru di `checkout_with_reward` dan logika checkout frontend sebelum mengubah perhitungan produk reward, stok, atau poin.

### Pengelolaan pesanan admin

Akses admin dilindungi oleh konfigurasi rute aplikasi dan otorisasi Supabase. Atur dan uji izin admin sebelum menggunakan data pelanggan sungguhan.

## Checklist pengujian

Sebelum mempresentasikan atau menerapkan aplikasi, uji hal-hal berikut:

- [ ] Checkout sebagai tamu berhasil membuat pesanan.
- [ ] Checkout pengguna yang masuk ke akun tetap berfungsi.
- [ ] Tamu dapat memeriksa status pembayaran tanpa membuka akses baca publik ke tabel `orders`.
- [ ] Halaman pesanan berhasil muncul setelah pembayaran ditandai `paid`.
- [ ] Penukaran reward saja berfungsi untuk pengguna yang memenuhi syarat.
- [ ] Checkout campuran antara reward dan produk berbayar menghitung total dengan benar.
- [ ] Produk yang stoknya tidak cukup atau tidak tersedia menampilkan pesan yang jelas.
- [ ] Stok dan poin reward berubah sesuai hasil checkout.
- [ ] Riwayat pesanan hanya menampilkan pesanan yang sesuai dengan pengguna.
- [ ] Halaman khusus admin menolak pengguna yang tidak memiliki izin.
- [ ] Tampilan mobile, perilaku refresh, dan tombol kembali browser berjalan dengan baik.
- [ ] `npm run build` berjalan tanpa error.
- [ ] Tidak ada rahasia, data debug, atau data pelanggan uji yang ikut di-commit.

## Struktur proyek

Struktur folder dapat berbeda, tetapi umumnya kode aplikasi dipisahkan berdasarkan tanggung jawab:

- `src/pages/` — halaman utama seperti checkout, pembayaran QRIS, pesanan berhasil, profil, dan halaman admin.
- `src/components/` — komponen antarmuka yang digunakan kembali.
- `src/services/` — fungsi layanan terkait pesanan.
- `src/lib/` — klien bersama seperti Supabase client.

Periksa struktur kode sebenarnya untuk memastikan susunan folder yang tepat.

## Catatan keamanan

- Pertahankan Row Level Security dan gunakan kebijakan dengan izin seminimal mungkin.
- Jangan pernah meng-commit file `.env` atau kredensial service-role.
- Validasi stok, harga, poin, dan total pesanan di database; jangan mempercayai total yang dikirim oleh frontend.
- Jaga kerahasiaan token pesanan tamu dan batasi penggunaannya hanya untuk satu pesanan.
- Uji otorisasi menggunakan sesi tamu dan sesi pengguna yang sudah masuk.
- Gunakan data demonstrasi saat presentasi jika memungkinkan.

## Pemecahan masalah

**Error konfigurasi Supabase**
- Cocokkan nama variabel di `.env` dengan `src/lib/supabaseClient.js`.
- Pastikan URL dan public key mengarah ke proyek Supabase yang benar.
- Jalankan ulang server pengembangan setelah mengubah environment variable.

**Error RPC atau izin akses**
- Pastikan fungsi tersedia dengan signature yang sesuai.
- Periksa izin `EXECUTE` untuk role yang diperlukan.
- Cocokkan definisi fungsi, nama skema, dan kebijakan RLS dengan versi aplikasi saat ini.

**Status pembayaran tamu tidak berubah**
- Pastikan respons checkout menyertakan guest token.
- Pastikan token diteruskan ke state rute QRIS.
- Pastikan `get_guest_order_payment_status` dipanggil dengan ID pesanan dan token yang cocok.
- Periksa pembaruan status pembayaran oleh admin dan pesan error di console browser.

**Build produksi gagal**
- Jalankan `npm run build`, lalu perbaiki error pertama yang muncul.
- Periksa import dan versi paket di `package.json`.

## Lisensi

Proyek ini menggunakan MIT License. Lihat file LICENSE untuk informasi selengkapnya.

---

Dibuat sebagai proyek sekolah menggunakan React, Vite, dan Supabase.
