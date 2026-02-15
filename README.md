# 🖥️ Debt Management System – Admin Frontend

Admin dashboard berbasis **Next.js (App Router)** untuk mengelola pelanggan, utang, pembayaran, dan analitik bisnis.

Aplikasi ini terintegrasi dengan REST API backend dan dirancang untuk kebutuhan operasional tim internal seperti finance, kasir, maupun admin.

---

## ✨ Highlights

- Modern React architecture dengan App Router
- Secure authentication berbasis httpOnly cookie
- Centralized API layer menggunakan axios
- Global auth state via React Context
- UI konsisten & reusable dengan Tailwind + shadcn/ui
- Siap untuk scaling & kolaborasi tim

---

## 🧠 Core Capabilities

### 🔐 Authentication

- Login & logout
- Auto fetch profile (`/auth/me`)
- Protected route
- Auto redirect jika session invalid

---

### 📊 Dashboard

Menampilkan ringkasan bisnis secara real-time:

- total user
- total utang
- pembayaran
- overdue
- top debtor
- recent payments

Endpoint sudah dioptimasi backend sehingga frontend tinggal render.

---

### 👤 Admin Management

- List admin
- Create / edit / delete
- Search & pagination
- Role aware UI (misal hanya SUPERADMIN)

---

### 🧑 User Management

- CRUD customer
- Validasi business rule dari server
- Quick search untuk dropdown transaksi

---

### 📄 Debt & Invoice

- Buat utang baru
- Lihat semua cycle
- Detail item per invoice
- Monitoring status lunas / belum

---

### 💳 Payment

- Pelunasan invoice
- Validasi otomatis dari backend
- Status update instan di dashboard

---

## 🏗️ Tech Stack

- **Next.js 16**
- React
- TypeScript
- Axios
- React Context
- Tailwind CSS
- shadcn/ui

---

## 📁 Project Structure (High Level)

```
src/
 ├── app/                # routing & layouts
 ├── components/         # reusable UI
 ├── features/           # domain modules
 ├── contexts/           # global state (auth)
 ├── lib/                # axios & helpers
 ├── hooks/              # custom hooks
 ├── types/              # type definitions
```

Struktur ini memudahkan:

- pemisahan domain
- scalability
- onboarding dev baru

---

## 🔑 Authentication Strategy

Frontend **tidak menyimpan token**.

Flow:

1. Login → server set httpOnly cookie
2. Request berikutnya otomatis membawa cookie
3. Jika gagal → redirect ke halaman login
4. Context menyimpan info user yang sedang aktif

Ini mencegah:

- XSS token stealing
- manual token handling di client

---

## 🔌 API Integration

Semua request lewat satu pintu.

```ts
// lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
```

Keuntungan:

- gampang tambah interceptor
- gampang handle global error
- konsisten di seluruh aplikasi

---

## 🧭 Routing Concept (App Router)

Contoh halaman utama:

- `/login`
- `/dashboard`
- `/admin`
- `/users`
- `/debt`
- `/payment`

Layout & proteksi bisa diterapkan dari root segment.

---

## 🎨 UI Philosophy

Menggunakan **Tailwind + shadcn** supaya:

- cepat bikin halaman
- konsisten
- mudah maintain
- gampang bikin component reusable

Design system ini sering dipakai di startup modern.

---

## 🌐 Environment

`.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🚀 Running the Project

Install dependency:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Buka:

```
http://localhost:3000
```

---

## 📈 Scalability Design

Arsitektur sudah siap untuk:

- role based rendering
- multi dashboard
- websocket / realtime
- caching layer
- optimistic update
- SSR / streaming
- modular feature growth

---

## 🎯 Suitable For

Bisa dipakai untuk:

- koperasi
- sistem kasir
- fintech lending
- B2B invoice monitoring
- internal finance tools

---

## 🔮 Future Enhancements

- audit log UI
- export laporan
- grafik analitik lanjutan
- mobile optimization
- unit & e2e testing
- i18n
