# Arsitektur Awal GoPrint

## Tujuan

GoPrint membantu mahasiswa dan dosen melakukan pemesanan print dan fotokopi tanpa harus datang langsung ke tempat fotokopi di kampus.

## Aktor Sistem

### 1. Admin

- Melihat daftar pengguna
- Melihat daftar penyedia jasa fotokopi
- Memantau pesanan aktif
- Membuat pesanan bila diperlukan

### 2. Tukang Fotokopi

- Menerima pesanan baru
- Melihat detail file dan kebutuhan print/fotokopi
- Mengubah status pengerjaan
- Mengatur apakah pesanan diantar atau diambil sendiri

### 3. Mahasiswa/Dosen

- Registrasi dan login
- Upload dokumen
- Mengatur jumlah print dan fotokopi
- Memilih metode pengambilan
- Memilih metode pembayaran
- Memantau status pesanan

## Konsep Monorepo

### `frontend`

Frontend memakai React + TypeScript + Vite. Aplikasi dibagi menjadi beberapa area:

- Landing page / dashboard
- Halaman pemesanan
- Halaman tracking pesanan
- Halaman admin
- Halaman tukang fotokopi

### `backend`

Backend memakai Express + TypeScript dengan struktur modular:

- `modules/auth` untuk autentikasi
- `modules/orders` untuk pesanan
- `modules/users` untuk data pengguna
- `modules/history` untuk riwayat
- `services/blob` untuk integrasi Vercel Blob
- `config` untuk database, env, dan aplikasi

## Alur Pesanan

1. User login
2. User upload satu atau lebih dokumen
3. User menentukan kebutuhan print dan/atau fotokopi per dokumen
4. Sistem menghitung ringkasan pesanan
5. User memilih metode pengambilan dan pembayaran
6. Pesanan masuk ke tukang fotokopi
7. Tukang fotokopi memproses dan mengubah status
8. Jika selesai, data berpindah ke histori

## Status Pesanan yang Disarankan

- `pending`
- `confirmed`
- `processing`
- `ready_for_pickup`
- `out_for_delivery`
- `completed`
- `cancelled`

## Catatan Bisnis Penting

- Jika user memilih fotokopi tanpa print sumber, sistem tetap perlu satu hasil print awal sebagai dokumen sumber.
- Satu order dapat memiliki banyak file.
- Satu file dapat memiliki kebutuhan print dan fotokopi yang berbeda.
- Riwayat sebaiknya menyimpan snapshot detail pesanan agar data lama tetap aman.

## Rencana Entitas Data

- `users`
- `copy_shops`
- `orders`
- `order_items`
- `history`

Walau ringkasan awal menyebut 3 tabel utama, untuk implementasi nyata disarankan menambah `copy_shops` dan `order_items` agar data tidak sulit dikelola.
