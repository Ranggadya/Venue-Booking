# Venue Event Booking Management

<div align="center">

![Venue Banner](./public/dashboard.png)

**Platform admin panel berbasis web untuk mengelola data venue dan jadwal event secara terpusat.**

[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

</div>

---

## 📋 Deskripsi Project

Venue Event Booking Management adalah aplikasi admin panel berbasis web yang membantu pengelola venue mencatat data venue dan jadwal event secara terpusat. Sistem ini digunakan oleh admin untuk:

- Mengelola data venue (CRUD)
- Membuat dan mengelola event booking
- Melihat riwayat booking pada setiap venue
- Memantau status booking dan pembayaran
- Mencegah jadwal booking yang bertabrakan

Project ini menggunakan pendekatan **NestJS MVC dengan Server-Side Rendering (SSR)**. Halaman admin dibangun menggunakan **EJS + Tailwind CSS**, sedangkan endpoint API JSON disediakan untuk kebutuhan testing melalui Postman.

---

## 🖥️ Screenshots

### Login Page

![Login Page](./public/login.png)

> Halaman login admin dengan form email dan password. Tampilan dua kolom dengan visual panel di kiri (desktop) dan form di kanan.

---

### Dashboard

![Dashboard](./public/dashboard.png)

> Dashboard utama menampilkan 4 stat cards berwarna gradient (Total Venues, Total Bookings, Confirmed, Pending), booking trend chart, overview panel dengan progress bars, dan tabel recent bookings.

---

### Venue List

![Venue List](./public/venues.png)

> Halaman daftar venue dengan fitur search dan tombol Add Venue. Tabel menampilkan nama, lokasi, kapasitas, harga per hari, status badge, dan tombol aksi (View, Edit, Delete).

---

### Venue Detail

![Venue Detail](./public/venues-show.png)

> Halaman detail venue menampilkan informasi lengkap venue di kolom kiri dan Quick Stats + Quick Actions di kolom kanan. Bagian bawah memuat tabel riwayat booking terkait venue tersebut.

---

### Create Venue

![Create Venue](./public/venues-create.png)

> Form tambah venue dengan field: Venue Name, Location, Capacity, Price per Day, Status, Facilities, dan Description.

---

### Edit Venue

![Edit Venue](./public/venues-edit.png)

> Form edit venue dengan pre-fill data yang sudah ada. Dropdown status menampilkan nilai aktif saat ini.

---

### Event Booking List

![Booking List](./public/bookings.png)

> Halaman daftar event booking dengan search bar. Tabel menampilkan nama event, venue, tanggal & waktu, jumlah peserta, status booking, status pembayaran, dan tombol aksi.

---

### Event Booking Detail

![Booking Detail](./public/bookings-show.png)

> Halaman detail booking dengan layout dua kolom. Kolom kiri menampilkan informasi booking lengkap, kolom kanan menampilkan info venue yang digunakan.

---

### Create Event Booking

![Create Booking](./public/bookings-create.png)

> Form tambah booking dengan dropdown venue (hanya venue available), field tanggal, waktu mulai-selesai, jumlah peserta, status booking, status pembayaran, dan catatan.

---

### Edit Event Booking

![Edit Booking](./public/bookings-edit.png)

> Form edit booking dengan pre-fill semua field termasuk konversi waktu dari database ke format `HH:MM` untuk input time.

---

## ERD (Entity Relationship Diagram)

> ERD dibuat menggunakan [dbdiagram.io](https://dbdiagram.io)
![Edit Booking](./public/erd.svg)

### Relasi Utama

```
Venue (1) ──────────────────< EventBooking (N)
```

Satu venue dapat memiliki banyak event booking. Satu event booking hanya menggunakan satu venue. Foreign key berada di tabel `event_bookings` melalui field `venue_id`.

---

## ⚙️ Tech Stack

### Runtime & Language

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Node.js | 20.x LTS | Runtime JavaScript |
| TypeScript | 5.x | Type safety + strict mode |
| npm | 10.x | Package manager |

### Framework & Core

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| NestJS | 10.x | Framework backend TypeScript |
| Express | 4.x | Underlying HTTP adapter NestJS |

### Database & ORM

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| PostgreSQL | 16.x | Database relasional |
| Prisma ORM | 5.x | Type-safe ORM dengan migration |

### View Layer

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| EJS | 3.x | Template engine SSR |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Chart.js | 4.x | Library chart untuk dashboard |
| Inter (Google Fonts) | — | Typography |

### Authentication & Security

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Passport.js | 0.7.x | Auth middleware |
| passport-local | 1.x | Strategy login email/password |
| passport-jwt | 4.x | Strategy JWT untuk API |
| @nestjs/jwt | 10.x | JWT integration NestJS |
| express-session | 1.x | Session-based auth untuk halaman |
| connect-pg-simple | 9.x | Session store di PostgreSQL |
| bcrypt | 5.x | Password hashing |
| helmet | 7.x | Security HTTP headers |

### Validation & Docs

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| class-validator | 0.14.x | DTO validation |
| class-transformer | 0.5.x | Transform plain object ke class |
| @nestjs/swagger | 7.x | Auto-generate Swagger UI |
| connect-flash | 0.1.x | Flash messages |
| morgan | 1.x | HTTP request logger |

---

## Fitur Utama

### Authentication
- Login dan logout admin
- Session-based auth untuk halaman (SSR)
- JWT Bearer token untuk API endpoint
- Route protection dengan guard

### Dashboard
- Statistik total venue, total booking, confirmed, pending
- Booking trend line chart (Chart.js)
- Overview panel dengan progress bars status venue dan booking
- Tabel recent bookings (5 terbaru)

### Venue Management
- List venue dengan search (nama, lokasi, status)
- Detail venue beserta riwayat booking terkait
- Create, update, delete venue
- Validasi delete: venue tidak bisa dihapus jika masih ada booking aktif (pending/confirmed)

### Event Booking Management
- List booking dengan search (nama event, organizer, venue, status)
- Detail booking dengan informasi venue
- Create, update, delete booking
- Validasi status venue (harus available)
- Validasi kapasitas peserta
- Validasi waktu (end_time > start_time)
- Deteksi booking conflict (jadwal tidak boleh overlap)

### API Endpoint
- Auth, Venue, dan Event Booking API
- Dilindungi JWT Bearer token
- Dokumentasi Swagger UI di `/api-docs`

### Error Handling
- Global exception filter untuk semua error
- Halaman 404 dan 500 yang clean
- Flash messages untuk notifikasi operasi CRUD
- Error response JSON untuk API endpoint

---

## 🏗️ Arsitektur

```
Browser/Postman
      │
      ▼
┌─────────────────────────────────────┐
│           NestJS Application         │
│                                     │
│  ┌─────────────┐  ┌──────────────┐  │
│  │  Page       │  │  API         │  │
│  │  Controllers│  │  Controllers │  │
│  │  (SSR/EJS)  │  │  (JSON/REST) │  │
│  └──────┬──────┘  └──────┬───────┘  │
│         │                │          │
│         └────────┬───────┘          │
│                  ▼                  │
│           Service Layer             │
│     (Business Logic & Validation)   │
│                  │                  │
│                  ▼                  │
│            Prisma Client            │
└──────────────────┼──────────────────┘
                   ▼
            PostgreSQL Database
```

### Pattern MVC

| MVC | Implementasi |
|-----|-------------|
| Model | Prisma Schema + Generated Client |
| View | EJS Template + Tailwind CSS |
| Controller | NestJS Controller (@Render untuk page, JSON untuk API) |
| Service | Business logic, validation, dan query Prisma |

---

## 📁 Struktur Folder

```
smart-venue-booking/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data (admin + 5 venues + 15 bookings)
│   └── migrations/            # Migration files
│
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts                # Bootstrap & middleware setup
│   │
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts    # Global error handler
│   │   └── guards/
│   │       ├── session-auth.guard.ts       # Guard halaman (session)
│   │       └── jwt-auth.guard.ts           # Guard API (JWT)
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts  # Prisma client wrapper
│   │   └── prisma.module.ts   # Global module
│   │
│   ├── auth/
│   │   ├── controllers/
│   │   │   ├── auth-page.controller.ts    # GET/POST /login, POST /logout
│   │   │   └── auth-api.controller.ts     # POST /api/auth/login
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── strategies/
│   │   │   ├── local.strategy.ts          # Passport Local
│   │   │   └── jwt.strategy.ts            # Passport JWT
│   │   ├── auth.serializer.ts             # Session serializer
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/
│   │   ├── users.service.ts   # findByEmail, findById
│   │   └── users.module.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.service.ts           # getStats() + recentBookings
│   │   └── dashboard.module.ts
│   │
│   ├── venues/
│   │   ├── controllers/
│   │   │   ├── venues-page.controller.ts
│   │   │   └── venues-api.controller.ts
│   │   ├── dto/
│   │   │   ├── create-venue.dto.ts
│   │   │   └── update-venue.dto.ts
│   │   ├── venues.service.ts
│   │   └── venues.module.ts
│   │
│   └── event-bookings/
│       ├── controllers/
│       │   ├── event-bookings-page.controller.ts
│       │   └── event-bookings-api.controller.ts
│       ├── dto/
│       │   ├── create-event-booking.dto.ts
│       │   └── update-event-booking.dto.ts
│       ├── event-bookings.service.ts      # checkConflict(), validasi bisnis
│       └── event-bookings.module.ts
│
├── views/
│   ├── layouts/
│   │   └── main.ejs           # Layout utama dengan sidebar + navbar
│   ├── partials/
│   │   ├── sidebar.ejs        # Sidebar putih dengan active state
│   │   ├── navbar.ejs         # Topbar dengan search + admin profile
│   │   └── flash.ejs          # Flash message success/error
│   ├── auth/
│   │   └── login.ejs          # Halaman login
│   ├── dashboard/
│   │   └── index.ejs          # Dashboard dengan chart dan tabel
│   ├── venues/
│   │   ├── index.ejs          # List venue
│   │   ├── show.ejs           # Detail venue
│   │   ├── create.ejs         # Form create
│   │   └── edit.ejs           # Form edit
│   ├── event-bookings/
│   │   ├── index.ejs          # List booking
│   │   ├── show.ejs           # Detail booking
│   │   ├── create.ejs         # Form create
│   │   └── edit.ejs           # Form edit
│   └── errors/
│       ├── 404.ejs            # Halaman 404
│       └── 500.ejs            # Halaman 500
│
├── public/
│   ├── css/
│   │   ├── input.css          # Tailwind input
│   │   └── output.css         # Tailwind output (generated)
│   └── js/
│       └── app.js
│
├── .env                       # Environment variables (tidak di-commit)
├── .env.example               # Template environment variables
├── .gitignore
├── tailwind.config.js
├── tsconfig.json
├── nest-cli.json
├── package.json
├── smart-venue-booking.postman_collection.json
└── README.md
```

---

## 🚀 Setup & Installation

### Prasyarat

Pastikan sudah terinstall:
- Node.js 20.x LTS
- npm 10.x
- PostgreSQL 16.x

### Langkah Instalasi

**1. Clone repository**

```bash
git clone https://github.com/username/smart-venue-booking.git
cd smart-venue-booking
```

**2. Install dependencies**

```bash
npm install
```

**3. Setup environment variables**

```bash
cp .env.example .env
```

Buka `.env` dan sesuaikan dengan konfigurasi lokal:

```env
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_venue_booking?schema=public"

SESSION_SECRET=your-session-secret-here
SESSION_MAX_AGE=86400000

JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=1d
```

**4. Buat database**

```bash
# Menggunakan psql
createdb smart_venue_booking

# Atau menggunakan pgAdmin, buat database baru dengan nama: smart_venue_booking
```

**5. Jalankan migration**

```bash
npx prisma migrate dev --name init
```

**6. Jalankan seed data**

```bash
npx prisma db seed
```

Output yang diharapkan:
```
 Seeding database...

 Admin: admin@venue.com
  ✓ Venue: Aula Utama
  ✓ Venue: Ruang Seminar B
  ✓ Venue: Ballroom Grand
  ✓ Venue: Meeting Room Eksekutif
  ✓ Venue: Ruang Workshop
 Venues: 5 data
 Event Bookings: 15 data

 Seeding selesai!
```

**7. Build Tailwind CSS**

```bash
npm run build:css
```

**8. Jalankan development server**

```bash
npm run start:dev
```

---

##  Akses Aplikasi

| URL | Keterangan |
|-----|------------|
| `http://localhost:3000/login` | Halaman login admin |
| `http://localhost:3000/dashboard` | Dashboard |
| `http://localhost:3000/venues` | Manajemen venue |
| `http://localhost:3000/event-bookings` | Manajemen event booking |
| `http://localhost:3000/api-docs` | Swagger API documentation |

### Demo Account

| Field | Value |
|-------|-------|
| Email | `admin@venue.com` |
| Password | `admin123` |

---

##  API Endpoints

### Auth

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/login` | Public | Login dan mendapatkan JWT token |

**Request body:**
```json
{
  "email": "admin@venue.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Venues

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/venues` | JWT | List semua venue, support `?search=` |
| GET | `/api/venues/:id` | JWT | Detail venue beserta list booking |
| POST | `/api/venues` | JWT | Create venue baru |
| PATCH | `/api/venues/:id` | JWT | Update venue |
| DELETE | `/api/venues/:id` | JWT | Delete venue |

**Contoh request POST `/api/venues`:**
```json
{
  "name": "Aula Utama",
  "location": "Gedung A Lt. 2",
  "capacity": 300,
  "facilities": "AC, Proyektor, Mic, Sound System",
  "price_per_day": 5000000,
  "status": "available",
  "description": "Aula terbesar untuk acara skala besar."
}
```

---

### Event Bookings

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/event-bookings` | JWT | List semua booking, support `?search=` |
| GET | `/api/event-bookings/:id` | JWT | Detail booking beserta info venue |
| POST | `/api/event-bookings` | JWT | Create booking baru |
| PATCH | `/api/event-bookings/:id` | JWT | Update booking |
| DELETE | `/api/event-bookings/:id` | JWT | Delete booking |

**Contoh request POST `/api/event-bookings`:**
```json
{
  "venue_id": 1,
  "event_name": "Seminar Teknologi",
  "organizer_name": "Komunitas Developer",
  "event_date": "2026-07-15",
  "start_time": "08:00",
  "end_time": "12:00",
  "attendees": 250,
  "booking_status": "confirmed",
  "payment_status": "unpaid",
  "notes": "Mohon sediakan meja registrasi."
}
```

### Menggunakan API

1. Login melalui `POST /api/auth/login`
2. Copy nilai `access_token` dari response
3. Tambahkan header di setiap request: `Authorization: Bearer <access_token>`
4. Atau import file Postman collection yang sudah disediakan

---

##  Postman Collection

Import file `smart-venue-booking.postman_collection.json` ke Postman.

Collection sudah berisi:
- Environment variable `{{base_url}}` dan `{{token}}`
- Semua endpoint Auth, Venues, dan Event Bookings
- Contoh request body untuk setiap endpoint
- Test case untuk error scenario (409 conflict, 400 validation, 404 not found)

**Setup environment di Postman:**
1. Import collection
2. Set variable `base_url` = `http://localhost:3000`
3. Jalankan request `POST Login` → copy `access_token`
4. Set variable `token` = nilai `access_token`
5. Semua request lain akan otomatis menggunakan token tersebut

---

##  Aturan Bisnis

### Venue

| Aturan | Keterangan |
|--------|------------|
| Status venue | Hanya `available`, `maintenance`, atau `inactive` |
| Booking dari venue non-available | Venue dengan status `maintenance` atau `inactive` tidak bisa digunakan untuk booking baru |
| Delete venue | Venue tidak bisa dihapus jika masih memiliki booking aktif (`pending` atau `confirmed`) |

### Event Booking

| Aturan | Keterangan |
|--------|------------|
| Venue harus ada | Venue yang dipilih harus terdaftar di database |
| Status venue | Venue harus berstatus `available` |
| Kapasitas | Jumlah peserta tidak boleh melebihi kapasitas venue |
| Waktu | `end_time` harus lebih besar dari `start_time` |
| Booking conflict | Tidak boleh overlap dengan booking lain pada venue dan tanggal yang sama (kecuali booking `cancelled`) |

### Logika Conflict Detection

```
BENTROK jika:
  start_baru < end_lama  AND  end_baru > start_lama

AMAN jika:
  end_baru <= start_lama  OR  start_baru >= end_lama

Booking berstatus 'cancelled' tidak dianggap konflik.
```

---

##  Authentication Flow

### Halaman Admin (Session-based)

```
Admin input email + password
  → POST /login
  → Passport LocalStrategy.validate()
  → bcrypt.compare(password, hash)
  → Jika valid: simpan user ke session
  → Redirect /dashboard
  → Jika gagal: flash error → redirect /login
```

### API Endpoint (JWT-based)

```
POST /api/auth/login
  → Validasi email + password
  → Generate JWT token
  → Return { access_token }

Request ke API lain:
  Header: Authorization: Bearer <token>
  → JwtStrategy.validate(payload)
  → Jika valid: lanjutkan ke controller
  → Jika tidak valid: 401 Unauthorized
```

---

##  Error Handling

Semua error ditangani oleh `AllExceptionsFilter` secara global.

### Response Error API (JSON)

```json
{
  "statusCode": 409,
  "message": "Jadwal bentrok dengan booking 'Seminar Teknologi' pada 08:00–12:00 di venue yang sama",
  "error": "Conflict",
  "path": "/api/event-bookings",
  "timestamp": "2026-06-15T08:00:00.000Z"
}
```

### HTTP Status Code

| Status | Error | Kondisi |
|--------|-------|---------|
| 400 | Bad Request | Input tidak valid, venue tidak available, kapasitas melebihi |
| 401 | Unauthorized | Login gagal, session/JWT tidak valid |
| 404 | Not Found | Data tidak ditemukan |
| 409 | Conflict | Jadwal booking overlap |
| 500 | Internal Server Error | Error tak terduga |

---

##  Video Demo

 Link video demo: `[Tambahkan link video Loom/YouTube di sini]`

**Konten video demo:**
1. Penjelasan singkat project dan tech stack
2. Demo login dan logout
3. Demo dashboard (stat cards, chart, recent bookings)
4. Demo CRUD venue
5. Demo detail venue dengan relasi booking
6. Demo CRUD event booking
7. Demo validasi kapasitas peserta
8. Demo validasi venue maintenance/inactive
9. Demo validasi jadwal bentrok (conflict detection)
10. Demo search venue dan booking
11. Demo API testing via Postman dengan JWT
12. Penjelasan struktur folder dan arsitektur MVC

---

## 🔧 Environment Variables

Semua environment variable tersedia di `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Session
SESSION_SECRET=change-this-to-a-random-string
SESSION_MAX_AGE=86400000

# JWT
JWT_SECRET=change-this-to-a-random-string
JWT_EXPIRES_IN=1d
```

---

##  Scope & Limitations

### Dalam Scope

- Login dan logout admin
- Dashboard ringkasan data
- CRUD venue dengan validasi
- CRUD event booking dengan validasi bisnis
- Booking conflict detection
- Search venue dan booking
- Status management (venue + booking + payment)
- API endpoint + Swagger docs
- Error handling terpusat
- Session store di PostgreSQL

### Di Luar Scope (Future Improvement)

- Halaman publik untuk customer
- Multi-role user (admin, staff, customer)
- Upload gambar venue
- Payment gateway
- Notifikasi email atau WhatsApp
- Kalender interaktif ketersediaan venue
- Export laporan PDF atau Excel
- Pagination data pada halaman list
- Rate limiting pada API
- Audit log perubahan data
- Dark mode

---

##  Author

**Dya**

- GitHub: [@username](https://github.com/username)

---

##  Lisensi

Project ini dibuat untuk keperluan portfolio dan challenge fullstack TypeScript.

---
