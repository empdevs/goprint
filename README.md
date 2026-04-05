# GoPrint

GoPrint adalah aplikasi pemesanan print dan fotokopi untuk lingkungan kampus Unpam Viktor. Repository ini menggunakan konsep monorepo agar frontend dan backend bisa dikembangkan dalam satu tempat yang rapi, mudah dideploy, dan nyaman untuk scale up.

## Struktur Monorepo

```text
goprint/
|- frontend/   -> React + TypeScript + Vite
|- backend/    -> Express + TypeScript
|- docs/       -> Konsep aplikasi dan arsitektur
|- database/   -> Skema MySQL awal
```

## Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: MySQL
- File storage: Vercel Blob
- Deployment target: Vercel

## Fitur Inti GoPrint

- Mahasiswa/dosen upload dokumen
- Pilih jumlah print dan fotokopi per file
- Pilih metode pengambilan: diantar atau ambil sendiri
- Pilih metode pembayaran: transfer atau cash
- Pantau status pesanan secara real-time
- Admin memantau user, penyedia jasa, dan pesanan
- Tukang fotokopi memproses pesanan dan update status

## Menjalankan Project

1. Install dependency:

```bash
npm install
```

2. Jalankan frontend:

```bash
npm run dev:frontend
```

3. Jalankan backend:

```bash
npm run dev:backend
```

## Demo Akun MVP

- Admin: `admin@goprint.local` / `admin123`
- Tukang fotokopi: `copyshop@goprint.local` / `copy123`
- Mahasiswa: `student@goprint.local` / `student123`

## Fitur MVP Saat Ini

- Login dan register user
- Dashboard role-based untuk admin, tukang fotokopi, dan mahasiswa/dosen
- CRUD pesanan dasar dari frontend ke backend dengan MySQL
- Upload dokumen ke Vercel Blob sebelum order dibuat
- Kalkulasi sederhana print, fotokopi, source print, dan ongkir delivery
- Data user mendukung `nim` dan `study_program`
- ID baru pada entitas aplikasi dibuat dalam format UUID

## Environment

Salin file contoh environment berikut:

- `frontend/.env.example` menjadi `frontend/.env`
- `backend/.env.example` menjadi `backend/.env`

## Setup Database

1. Jalankan `database/schema.sql`
2. Lanjutkan dengan `database/seed.sql`

## Catatan Deployment Vercel

- Frontend dapat dideploy sebagai project Vite.
- Backend disiapkan dengan entry Express untuk local development dan route `api/index.ts` untuk Vercel.
- Upload file dokumen menggunakan Vercel Blob agar file dapat disimpan secara terpisah dari server.

Dokumentasi konsep awal dapat dilihat di `docs/architecture.md`, skema database ada di `database/schema.sql`, dan data demo awal ada di `database/seed.sql`.
