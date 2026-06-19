# Project Plan — Venue Event Booking Management

## 1. Nama Project

**Venue Event Booking Management**

---

## 2. Deskripsi Singkat

Venue Event Booking Management adalah aplikasi admin panel berbasis web untuk membantu pengelola venue mencatat data venue dan jadwal event secara terpusat. Sistem ini digunakan oleh admin untuk mengelola data venue, membuat event booking, melihat riwayat booking pada setiap venue, memantau status booking dan pembayaran, serta mencegah jadwal booking yang bentrok.

Project ini menggunakan pendekatan **NestJS MVC dengan Server-Side Rendering (SSR)**. Halaman admin dibuat menggunakan **EJS + Tailwind CSS**, sedangkan endpoint API JSON disediakan untuk kebutuhan testing melalui Postman.

---

## 3. Latar Belakang

Pengelolaan venue dan booking event secara manual melalui buku catatan, spreadsheet, atau chat dapat menimbulkan beberapa masalah:

1. Data venue dan booking sulit dicari ketika jumlah data bertambah.
2. Jadwal event berpotensi bentrok pada venue yang sama.
3. Status booking dan pembayaran sulit dipantau.
4. Riwayat penggunaan venue tidak terdokumentasi dengan baik.
5. Admin sulit memastikan apakah venue sedang tersedia, maintenance, atau inactive.

Sistem ini dibuat untuk membantu admin mengelola venue dan booking secara lebih rapi, efisien, dan terstruktur.

---

## 4. Tujuan Project

Tujuan project ini adalah membangun aplikasi admin panel berbasis **NestJS TypeScript** untuk mengelola data venue dan event booking dengan relasi **one-to-many**.

Tujuan utama:

1. Membuat fitur login dan logout admin.
2. Membuat dashboard ringkasan data.
3. Membuat CRUD data venue.
4. Membuat CRUD data event booking.
5. Menerapkan relasi one-to-many antara venue dan event booking.
6. Membuat halaman list dan detail untuk venue dan event booking.
7. Membuat fitur pencarian data.
8. Menerapkan validasi status venue, kapasitas, dan jadwal bentrok.
9. Menerapkan authentication dan authorization.
10. Menyediakan API endpoint untuk testing Postman.
11. Menerapkan error handling dan DTO validation.

---

## 5. Target Pengguna

Pengguna utama sistem adalah **admin/pengelola venue**.

Contoh pengguna:

1. Pengelola aula kampus.
2. Pengelola gedung serbaguna.
3. Pengelola ruang meeting hotel.
4. Pengelola co-working space.
5. Pengelola ruang seminar atau ballroom.

---

## 6. Skenario Bisnis

Sebuah pengelola venue memiliki beberapa ruangan yang dapat disewa untuk event, seperti Aula Utama, Ruang Seminar, Ballroom, dan Meeting Room. Setiap venue memiliki kapasitas, lokasi, fasilitas, harga sewa per hari, dan status operasional.

Ketika ada permintaan booking event, admin perlu:

1. Memilih venue yang tersedia.
2. Memastikan venue tidak sedang maintenance atau inactive.
3. Memastikan jumlah peserta tidak melebihi kapasitas venue.
4. Memastikan jadwal event tidak bertabrakan dengan booking lain.
5. Menyimpan data event dan status pembayarannya.

Contoh kasus:

```txt
Venue             : Aula Utama
Kapasitas         : 300 peserta
Harga per hari    : Rp5.000.000
Status venue      : available

Event             : Seminar Teknologi
Penyelenggara     : Komunitas Developer
Jumlah peserta    : 250 peserta
Tanggal           : 15 Juni 2026
Waktu             : 08:00 - 12:00
Status booking    : confirmed
Status pembayaran : unpaid
```

Sistem akan mengecek status venue, kapasitas, dan jadwal sebelum booking disimpan.

---

## 7. Aktor dan Use Case

### 7.1 Aktor

| Aktor | Deskripsi |
|---|---|
| Admin | Pengelola internal yang dapat login, mengelola venue, mengelola event booking, dan memantau dashboard. |

### 7.2 Use Case Admin

```txt
Admin
 ├── Login
 ├── Logout
 ├── View Dashboard
 ├── Manage Venue
 │    ├── Create Venue
 │    ├── View Venue List
 │    ├── View Venue Detail
 │    ├── Update Venue
 │    └── Delete Venue
 ├── Manage Event Booking
 │    ├── Create Event Booking
 │    ├── View Event Booking List
 │    ├── View Event Booking Detail
 │    ├── Update Event Booking
 │    └── Delete Event Booking
 ├── Search Venue
 ├── Search Event Booking
 ├── Update Booking Status
 └── Update Payment Status
```

---

## 8. Ruang Lingkup Project

### 8.1 Fitur yang Dikerjakan

1. Login dan logout admin.
2. Dashboard ringkasan data.
3. CRUD venue.
4. CRUD event booking.
5. Relasi venue dengan event booking.
6. Halaman list dan detail.
7. Search venue dan event booking.
8. Validasi status venue.
9. Validasi kapasitas peserta.
10. Validasi jadwal bentrok.
11. API endpoint untuk Postman.
12. Authentication dan authorization.
13. DTO validation.
14. Error handling.
15. Dokumentasi README.

### 8.2 Di Luar Scope Saat Ini

1. Halaman publik untuk customer.
2. Registrasi customer.
3. Request booking dari user umum.
4. Payment gateway.
5. Notifikasi email/WhatsApp.
6. Kalender interaktif.
7. Multi-role user.
8. Upload gambar venue.
9. Export laporan PDF/Excel.
10. Audit log.
11. **Pagination data pada halaman list** — data ditampilkan seluruhnya tanpa paginasi. Ini keputusan yang disengaja mengingat scope challenge; dapat ditambahkan pada pengembangan berikutnya.
12. **Rate limiting** — tidak diterapkan pada endpoint API.
13. **Multi-admin account** — sistem hanya menggunakan satu akun admin yang dibuat melalui seeder.

---

## 9. Aturan Bisnis

| Area | Aturan |
|---|---|
| Authentication | Hanya admin yang sudah login yang dapat mengakses dashboard dan halaman CRUD. |
| Venue | Nama venue, lokasi, kapasitas, harga, dan status wajib valid. |
| Venue | Status venue hanya boleh `available`, `maintenance`, atau `inactive`. |
| Venue | Venue dengan status `maintenance` atau `inactive` tidak boleh digunakan untuk booking baru. |
| Venue | Venue tidak dapat dihapus jika masih memiliki **booking aktif**. |
| Venue | **Definisi booking aktif:** booking dengan `booking_status: pending` ATAU `booking_status: confirmed`. Booking dengan `booking_status: cancelled` tidak menghalangi penghapusan venue. |
| Booking | Venue yang dipilih harus ada di database. |
| Booking | Venue yang dipilih harus berstatus `available`. |
| Booking | Jumlah peserta (`attendees`) jika diisi tidak boleh melebihi kapasitas venue. |
| Booking | Waktu selesai (`end_time`) harus lebih besar dari waktu mulai (`start_time`). |
| Booking | Booking tidak boleh overlap dengan booking lain pada venue dan tanggal yang sama, kecuali booking yang dibandingkan berstatus `cancelled`. |
| Booking | Status booking hanya boleh `pending`, `confirmed`, atau `cancelled`. |
| Payment | Status pembayaran hanya boleh `unpaid`, `paid`, atau `refunded`. |
| API | Endpoint API selain login wajib menggunakan JWT token. |

### Booking Conflict Rule

```txt
BENTROK jika:
start_new < end_old AND end_new > start_old
(hanya diperiksa terhadap booking dengan booking_status != cancelled)

TIDAK BENTROK jika:
end_new <= start_old OR start_new >= end_old
```

---

## 10. Arsitektur Project

Project menggunakan pendekatan:

```txt
Modular Monolith MVC
+ Server-Rendered Admin Panel
+ REST API Layer
```

Aplikasi dibangun dalam satu project NestJS dan dipisahkan berdasarkan module/domain:

1. `auth`
2. `users`
3. `dashboard`
4. `venues`
5. `event-bookings`
6. `prisma`
7. `common`

### 10.1 Alur Admin Page

```txt
Browser
  ↓
SessionAuthGuard
  ↓
Page Controller
  ↓
Service Layer
  ↓
Prisma Client
  ↓
PostgreSQL
  ↓
EJS render HTML
  ↓
Browser
```

### 10.2 Alur API Postman

```txt
Postman + Bearer Token
  ↓
JwtAuthGuard
  ↓
API Controller
  ↓
Service Layer
  ↓
Prisma Client
  ↓
PostgreSQL
  ↓
JSON Response
```

---

## 11. Pattern MVC

| MVC | Implementasi |
|---|---|
| Model | Prisma Schema dan Generated Client |
| View | EJS Template + Tailwind CSS |
| Controller | NestJS Controller dengan `@Render()` untuk page dan controller JSON untuk API |
| Service | Business logic, validation, query workflow, dan error handling |

Controller hanya menangani request dan response. Logic utama diletakkan di service agar bisa digunakan ulang oleh page controller dan API controller.

---

## 12. Tech Stack

### Runtime dan Language

| Teknologi | Versi | Keterangan |
|---|---|---|
| **Node.js** | 20.x LTS | Versi LTS terbaru, performa optimal, dukungan ES2022+ |
| **TypeScript** | 5.x | Type safety menyeluruh, strict mode, decorator support untuk NestJS |
| **npm** | 10.x | Package manager bawaan Node.js, mudah digunakan, dan umum dipakai dalam project JavaScript/TypeScript |

### Framework dan Core

| Teknologi | Versi | Keterangan |
|---|---|---|
| **NestJS** | 10.x | Framework TypeScript backend yang opinionated, DI container, modular, MVC support native |
| **Express** | 4.x | Underlying HTTP adapter NestJS |

### Database dan ORM

| Teknologi | Versi | Keterangan |
|---|---|---|
| **PostgreSQL** | 16.x | Database relasional production-grade |
| **Prisma ORM** | 5.x | ORM modern untuk TypeScript — type-safe auto-generated client, migration deterministik, lebih baik dari TypeORM untuk proyek TypeScript baru |

### View Layer

| Teknologi | Versi | Keterangan |
|---|---|---|
| **EJS** | 3.x | Template engine dengan sintaks dekat HTML biasa, tidak ada learning curve tambahan, integrasi native NestJS |
| **Tailwind CSS** | 3.x | Utility-first CSS framework, dibangun melalui script npm (`npm run build:css`) |

### Authentication dan Security

| Teknologi | Versi | Keterangan |
|---|---|---|
| **Passport.js** | 0.7.x | Standard auth middleware Node.js |
| **passport-local** | 1.x | Strategy login email/password untuk halaman admin |
| **passport-jwt** | 4.x | Strategy JWT untuk proteksi API endpoint |
| **@nestjs/jwt** | 10.x | NestJS wrapper JWT, integrasi Passport |
| **express-session** | 1.x | Session-based auth untuk halaman admin (SSR/MVC) |
| **connect-pg-simple** | 9.x | Session store di PostgreSQL — session tidak hilang saat server restart |
| **bcrypt** | 5.x | Password hashing industry-standard dengan salt rounds |
| **helmet** | 7.x | Security HTTP headers (XSS protection, content-type sniffing, dll.) |

### Validation dan Transformation

| Teknologi | Versi | Keterangan |
|---|---|---|
| **class-validator** | 0.14.x | Decorator-based validation, integrasi native NestJS Pipes |
| **class-transformer** | 0.5.x | Transform plain object ke class instance agar class-validator bekerja |

### Middleware Pendukung

| Teknologi | Versi | Keterangan |
|---|---|---|
| **connect-flash** | 0.1.x | Flash messages untuk notifikasi success/error setelah redirect di halaman admin |
| **morgan** | 1.x | HTTP request logger untuk debugging saat development |

### Developer Tools

| Teknologi | Versi | Keterangan |
|---|---|---|
| **@nestjs/config** | 3.x | Environment variable management, type-safe config |
| **@nestjs/swagger** | 7.x | Auto-generate Swagger UI dari decorator NestJS di `/api-docs` |
| **ESLint** | 8.x | Static code analysis, enforce coding standards |
| **Prettier** | 3.x | Code formatter, konsistensi format seluruh codebase |

### Stack Final

```txt
NestJS 10 + TypeScript 5 + Prisma 5 + PostgreSQL 16
+ EJS 3 + Tailwind CSS 3
+ Passport Local + express-session + connect-pg-simple
+ Passport JWT + @nestjs/jwt
+ bcrypt + helmet + class-validator + @nestjs/config
+ connect-flash
+ @nestjs/swagger + ESLint + Prettier
```

---

## 13. Authentication dan Authorization

### 13.1 Admin Page Authentication

Halaman admin menggunakan **session-based authentication**.

Alur login page:

```txt
Admin input email dan password
  ↓
Passport Local Strategy
  ↓
AuthService validate user
  ↓
bcrypt compare password
  ↓
Jika valid, simpan user ke session
  ↓
Redirect ke dashboard
```

Route yang dilindungi session:

```txt
/dashboard
/venues
/venues/create
/venues/:id
/venues/:id/edit
/event-bookings
/event-bookings/create
/event-bookings/:id
/event-bookings/:id/edit
```

### 13.2 API Authentication

API menggunakan JWT untuk testing melalui Postman.

Alur API login:

```txt
POST /api/auth/login
  ↓
Validasi email dan password
  ↓
Generate JWT
  ↓
Return access_token
```

Header Postman:

```txt
Authorization: Bearer <access_token>
```

---

## 14. Database Design

### 14.1 Relasi Utama

```txt
Venue (1) ──────────< EventBooking (N)
```

Artinya:

1. Satu venue dapat memiliki banyak event booking.
2. Satu event booking hanya menggunakan satu venue.
3. Foreign key berada di tabel `event_bookings` melalui field `venue_id`.

### 14.2 Entitas

1. **User** — admin yang dapat login.
2. **Venue** — data tempat/ruangan.
3. **EventBooking** — data pemesanan event pada venue.

### 14.3 Tabel users

| Field | Tipe | Null | Keterangan |
|---|---|---|---|
| id | INT, PK, Auto Increment | NOT NULL | Primary key |
| name | VARCHAR(100) | NOT NULL | Nama admin |
| email | VARCHAR(100), UNIQUE | NOT NULL | Email login |
| password | VARCHAR(255) | NOT NULL | Password hash (bcrypt) |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat, auto-generated |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui, auto-updated |

### 14.4 Tabel venues

| Field | Tipe | Null | Keterangan |
|---|---|---|---|
| id | INT, PK, Auto Increment | NOT NULL | Primary key |
| name | VARCHAR(150) | NOT NULL | Nama venue |
| location | VARCHAR(255) | NOT NULL | Lokasi venue |
| capacity | INT | NOT NULL | Kapasitas maksimum peserta |
| facilities | TEXT | nullable | Daftar fasilitas, tidak wajib diisi |
| price_per_day | DECIMAL(12,2) | NOT NULL | Harga sewa per hari |
| status | ENUM | NOT NULL | `available`, `maintenance`, `inactive`. Default: `available` |
| description | TEXT | nullable | Deskripsi tambahan, tidak wajib diisi |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat, auto-generated |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui, auto-updated |

### 14.5 Tabel event_bookings

| Field | Tipe | Null | Keterangan |
|---|---|---|---|
| id | INT, PK, Auto Increment | NOT NULL | Primary key |
| venue_id | INT, FK → venues.id | NOT NULL | Foreign key ke tabel venues |
| event_name | VARCHAR(150) | NOT NULL | Nama event |
| organizer_name | VARCHAR(100) | NOT NULL | Nama penyelenggara |
| event_date | DATE | NOT NULL | Tanggal event |
| start_time | TIME | NOT NULL | Waktu mulai |
| end_time | TIME | NOT NULL | Waktu selesai, harus > start_time |
| attendees | INT | nullable | Jumlah peserta, tidak wajib diisi |
| booking_status | ENUM | NOT NULL | `pending`, `confirmed`, `cancelled`. Default: `pending` |
| payment_status | ENUM | NOT NULL | `unpaid`, `paid`, `refunded`. Default: `unpaid` |
| notes | TEXT | nullable | Catatan tambahan, tidak wajib diisi |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat, auto-generated |
| updated_at | TIMESTAMP | NOT NULL | Waktu diperbarui, auto-updated |

---

## 15. Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum VenueStatus {
  available
  maintenance
  inactive
}

enum BookingStatus {
  pending
  confirmed
  cancelled
}

enum PaymentStatus {
  unpaid
  paid
  refunded
}

model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(100)
  password  String   @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Venue {
  id          Int            @id @default(autoincrement())
  name        String         @db.VarChar(150)
  location    String         @db.VarChar(255)
  capacity    Int
  facilities  String?        @db.Text
  pricePerDay Decimal        @db.Decimal(12, 2) @map("price_per_day")
  status      VenueStatus    @default(available)
  description String?        @db.Text
  createdAt   DateTime       @default(now()) @map("created_at")
  updatedAt   DateTime       @updatedAt @map("updated_at")
  bookings    EventBooking[]

  @@map("venues")
}

model EventBooking {
  id            Int           @id @default(autoincrement())
  venueId       Int           @map("venue_id")
  eventName     String        @db.VarChar(150) @map("event_name")
  organizerName String        @db.VarChar(100) @map("organizer_name")
  eventDate     DateTime      @db.Date @map("event_date")
  startTime     DateTime      @db.Time @map("start_time")
  endTime       DateTime      @db.Time @map("end_time")
  attendees     Int?
  bookingStatus BookingStatus @default(pending) @map("booking_status")
  paymentStatus PaymentStatus @default(unpaid) @map("payment_status")
  notes         String?       @db.Text
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  venue Venue @relation(fields: [venueId], references: [id], onDelete: Restrict)

  @@map("event_bookings")
}
```

### Catatan Implementasi — `@db.Date` dan `@db.Time`

> **Perhatikan ini saat implementasi service layer.**

PostgreSQL menyimpan `DATE` dan `TIME` sebagai tipe terpisah. Prisma memetakan keduanya ke TypeScript sebagai `DateTime`, namun perilakunya berbeda:

- `@db.Date` → hanya menyimpan tanggal, bagian waktu diabaikan.
- `@db.Time` → hanya menyimpan jam/menit/detik, bagian tanggal diabaikan oleh PostgreSQL tapi Prisma tetap menerima `DateTime` object.

**Implikasi pada `checkConflict`:**

Ketika melakukan perbandingan `startTime` dan `endTime` di Prisma query (`lt`, `gt`), pastikan nilai yang dikirim adalah `DateTime` object yang valid. Cara aman yang direkomendasikan adalah mengonversi input waktu dari form/DTO menjadi `Date` object JavaScript sebelum dioper ke Prisma:

```typescript
// Konversi string "08:00" ke Date object untuk field @db.Time
const toTimeDate = (timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(0); // epoch date, hanya bagian time yang dipedulikan
  date.setHours(hours, minutes, 0, 0);
  return date;
};
```

Untuk `eventDate` dengan `@db.Date`, pastikan hanya bagian tanggal yang di-pass dan tidak ada timezone offset yang menggeser hari:

```typescript
// Konversi string "2026-06-15" ke Date object untuk field @db.Date
const toDateOnly = (dateStr: string): Date => new Date(dateStr + 'T00:00:00.000Z');
```

Ini bukan bug pada Prisma — ini perilaku yang expected dan perlu dihandle secara eksplisit di service layer.

---

## 16. Fitur Utama

### 16.1 Dashboard

Menampilkan ringkasan:

1. Total venue.
2. Total booking.
3. Total booking pending.
4. Total booking confirmed.
5. Total booking cancelled.
6. Total venue available.
7. Total venue maintenance.

### 16.2 Venue Management

Fitur:

1. List venue.
2. Detail venue.
3. Create venue.
4. Update venue.
5. Delete venue.
6. Search venue.
7. Detail venue menampilkan daftar booking terkait.

### 16.3 Event Booking Management

Fitur:

1. List booking.
2. Detail booking.
3. Create booking.
4. Update booking.
5. Delete booking.
6. Search booking.
7. Update booking status.
8. Update payment status.

### 16.4 Validation Feature

Validasi utama:

1. Venue harus tersedia.
2. Jumlah peserta tidak boleh melebihi kapasitas.
3. Waktu selesai harus setelah waktu mulai.
4. Jadwal tidak boleh overlap pada venue dan tanggal yang sama.

---

## 17. Rancangan Halaman

| Halaman | Deskripsi |
|---|---|
| Login | Form login admin. |
| Dashboard | Ringkasan data venue dan booking. |
| Venue List | Tabel data venue, search, dan tombol tambah. |
| Venue Detail | Detail venue dan daftar booking terkait. |
| Create Venue | Form tambah venue. |
| Edit Venue | Form edit venue. |
| Booking List | Tabel data booking, search, dan tombol tambah. |
| Booking Detail | Detail booking dan informasi venue. |
| Create Booking | Form tambah booking dengan dropdown venue. |
| Edit Booking | Form edit booking. |
| Error 404 | Halaman data tidak ditemukan. |
| Error 500 | Halaman internal server error. |

---

## 18. Route Page

### Auth dan Dashboard

| Method | Route | Fungsi |
|---|---|---|
| GET | `/login` | Render halaman login |
| POST | `/login` | Proses login |
| POST | `/logout` | Logout |
| GET | `/dashboard` | Render dashboard |

### Venue Page

| Method | Route | Fungsi |
|---|---|---|
| GET | `/venues` | List venue, support `?search=` |
| GET | `/venues/create` | Form create venue |
| POST | `/venues` | Simpan venue baru |
| GET | `/venues/:id` | Detail venue + list booking terkait |
| GET | `/venues/:id/edit` | Form edit venue |
| POST | `/venues/:id/update` | Update venue |
| POST | `/venues/:id/delete` | Delete venue |

### Event Booking Page

| Method | Route | Fungsi |
|---|---|---|
| GET | `/event-bookings` | List booking, support `?search=` |
| GET | `/event-bookings/create` | Form create booking |
| POST | `/event-bookings` | Simpan booking baru |
| GET | `/event-bookings/:id` | Detail booking + info venue |
| GET | `/event-bookings/:id/edit` | Form edit booking |
| POST | `/event-bookings/:id/update` | Update booking |
| POST | `/event-bookings/:id/delete` | Delete booking |

**Catatan implementasi form EJS:**

HTML form hanya mendukung method `GET` dan `POST`. Karena itu, route page untuk update dan delete sengaja menggunakan pola `POST /:id/update` dan `POST /:id/delete`. Dengan pendekatan ini, project tidak membutuhkan middleware `method-override` untuk halaman EJS. Endpoint API tetap menggunakan method RESTful seperti `PATCH` dan `DELETE` karena diuji melalui Postman.

---

## 19. API Endpoint

### Auth API

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login dan mendapatkan JWT |

### Venue API

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| GET | `/api/venues` | JWT | List venue, support `?search=` |
| GET | `/api/venues/:id` | JWT | Detail venue + list booking terkait |
| POST | `/api/venues` | JWT | Create venue |
| PATCH | `/api/venues/:id` | JWT | Update venue |
| DELETE | `/api/venues/:id` | JWT | Delete venue |

### Event Booking API

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| GET | `/api/event-bookings` | JWT | List booking, support `?search=` |
| GET | `/api/event-bookings/:id` | JWT | Detail booking + info venue |
| POST | `/api/event-bookings` | JWT | Create booking |
| PATCH | `/api/event-bookings/:id` | JWT | Update booking |
| DELETE | `/api/event-bookings/:id` | JWT | Delete booking |

---

## 20. Validasi Data

### Venue

| Field | Null | Aturan |
|---|---|---|
| name | NOT NULL | Required, string, max 150 karakter |
| location | NOT NULL | Required, string, max 255 karakter |
| capacity | NOT NULL | Required, integer, minimal 1 |
| facilities | nullable | Optional, string |
| price_per_day | NOT NULL | Required, number, minimal 0 |
| status | NOT NULL | Required: `available`, `maintenance`, `inactive` |
| description | nullable | Optional, string |

### Event Booking

| Field | Null | Aturan |
|---|---|---|
| venue_id | NOT NULL | Required, venue harus ada di database |
| event_name | NOT NULL | Required, string, max 150 karakter |
| organizer_name | NOT NULL | Required, string, max 100 karakter |
| event_date | NOT NULL | Required, tanggal valid |
| start_time | NOT NULL | Required, format waktu valid |
| end_time | NOT NULL | Required, harus setelah start_time |
| attendees | nullable | Optional, integer, tidak boleh melebihi kapasitas venue |
| booking_status | NOT NULL | Required: `pending`, `confirmed`, `cancelled` |
| payment_status | NOT NULL | Required: `unpaid`, `paid`, `refunded` |
| notes | nullable | Optional, string |
| booking conflict | — | Tidak boleh overlap pada venue dan tanggal yang sama |

---

## 21. Error Handling

### Exception yang Digunakan

| Exception | HTTP Status | Kondisi |
|---|---|---|
| `BadRequestException` | 400 | Input tidak valid, venue tidak available, kapasitas melebihi venue, waktu tidak valid |
| `UnauthorizedException` | 401 | Login gagal, session/JWT tidak valid |
| `NotFoundException` | 404 | Venue atau booking tidak ditemukan |
| `ConflictException` | 409 | Jadwal booking bentrok |
| `InternalServerErrorException` | 500 | Error tidak terduga atau database error |

### Format Response Error API

```json
{
  "statusCode": 409,
  "message": "Jadwal booking bentrok dengan booking yang sudah ada pada venue ini",
  "error": "Conflict"
}
```

### Format Response Sukses API

**GET list** (contoh: `GET /api/venues`):

```json
[
  {
    "id": 1,
    "name": "Aula Utama",
    "location": "Gedung A Lt. 2",
    "capacity": 300,
    "facilities": "AC, Proyektor, Mic",
    "pricePerDay": "5000000",
    "status": "available",
    "description": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

**GET detail** (contoh: `GET /api/venues/:id`):

```json
{
  "id": 1,
  "name": "Aula Utama",
  "location": "Gedung A Lt. 2",
  "capacity": 300,
  "facilities": "AC, Proyektor, Mic",
  "pricePerDay": "5000000",
  "status": "available",
  "description": null,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "bookings": [
    {
      "id": 1,
      "eventName": "Seminar Teknologi",
      "organizerName": "Komunitas Developer",
      "eventDate": "2026-06-15T00:00:00.000Z",
      "bookingStatus": "confirmed",
      "paymentStatus": "unpaid"
    }
  ]
}
```

**POST / PATCH create atau update berhasil** (contoh: `POST /api/venues`):

```json
{
  "id": 2,
  "name": "Ruang Seminar B",
  "location": "Gedung B Lt. 1",
  "capacity": 100,
  "facilities": "AC, Whiteboard",
  "pricePerDay": "2000000",
  "status": "available",
  "description": null,
  "createdAt": "2026-06-13T08:00:00.000Z",
  "updatedAt": "2026-06-13T08:00:00.000Z"
}
```

**DELETE berhasil** (contoh: `DELETE /api/venues/:id`):

```json
{
  "message": "Venue berhasil dihapus"
}
```

---

## 22. Search Feature

Search menggunakan query parameter:

```txt
/venues?search=aula
/event-bookings?search=seminar
/api/venues?search=aula
/api/event-bookings?search=seminar
```

### Cakupan Search

| Data | Field yang Dicari |
|---|---|
| Venue | name, location, status |
| Event Booking | event_name, organizer_name, venue name (via relasi), booking_status, payment_status |

### Catatan Implementasi — Search via Relasi

Pencarian event booking berdasarkan **nama venue** membutuhkan filter ke tabel relasi, bukan ke field di tabel `event_bookings` itu sendiri. Prisma menangani ini melalui nested `where` pada relasi:

```typescript
// Di EventBookingsService.findAll(search?)
where: search
  ? {
      OR: [
        { eventName: { contains: search, mode: 'insensitive' } },
        { organizerName: { contains: search, mode: 'insensitive' } },
        { bookingStatus: { equals: search as BookingStatus } },
        { paymentStatus: { equals: search as PaymentStatus } },
        {
          venue: {               // filter ke tabel venues via relasi
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ],
    }
  : undefined,
```

Pastikan query `findAll` untuk event booking selalu menyertakan `include: { venue: true }` agar data venue tersedia di hasil tanpa query tambahan:

```typescript
prisma.eventBooking.findMany({
  where: { ... },
  include: { venue: true },
  orderBy: { createdAt: 'desc' },
});
```

---

## 23. Struktur Folder

```txt
smart-venue-booking/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── session-auth.guard.ts
│   │   │   └── jwt-auth.guard.ts
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── pipes/
│   │       └── parse-int.pipe.ts
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   ├── auth/
│   │   ├── controllers/
│   │   │   ├── auth-page.controller.ts
│   │   │   └── auth-api.controller.ts
│   │   ├── strategies/
│   │   │   ├── local.strategy.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.service.ts
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
│   ├── event-bookings/
│   │   ├── controllers/
│   │   │   ├── event-bookings-page.controller.ts
│   │   │   └── event-bookings-api.controller.ts
│   │   ├── dto/
│   │   │   ├── create-event-booking.dto.ts
│   │   │   └── update-event-booking.dto.ts
│   │   ├── event-bookings.service.ts
│   │   └── event-bookings.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── partials/
│   │   ├── sidebar.ejs
│   │   ├── navbar.ejs
│   │   └── flash.ejs
│   ├── auth/
│   │   └── login.ejs
│   ├── dashboard/
│   │   └── index.ejs
│   ├── venues/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── create.ejs
│   │   └── edit.ejs
│   ├── event-bookings/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── create.ejs
│   │   └── edit.ejs
│   └── errors/
│       ├── 404.ejs
│       └── 500.ejs
│
├── public/
│   ├── css/
│   │   ├── input.css
│   │   └── output.css
│   └── js/
│       └── app.js
│
├── tailwind.config.js
├── postcss.config.js
├── .env
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
├── package-lock.json
└── README.md
```

---

## 24. Module Breakdown

### PrismaModule (Global)

```txt
PrismaService extends PrismaClient
  ├── onModuleInit()    → this.$connect()
  └── onModuleDestroy() → this.$disconnect()
```

Didaftarkan sebagai `@Global()` module sehingga `PrismaService`
dapat di-inject ke semua module tanpa perlu import ulang.

---

### AuthModule

**Komponen:**

| Komponen | Fungsi |
|---|---|
| AuthPageController | Route GET /login, POST /login, POST /logout |
| AuthApiController | Route POST /api/auth/login → return JWT |
| AuthService | validateUser(), generateToken() |
| LocalStrategy | Passport strategy untuk form login |
| JwtStrategy | Passport strategy untuk verifikasi JWT |
| UsersService | findByEmail() — digunakan oleh LocalStrategy |

**Alur login page:**

```txt
POST /login
  ↓ LocalAuthGuard → LocalStrategy.validate(email, password)
  ↓ UsersService.findByEmail(email)
  ↓ bcrypt.compare(password, user.password)
  ↓ jika valid → Passport serialize user ke session
  ↓ redirect /dashboard
  ↓ jika gagal → flash error → redirect /login
```

**Alur login API:**

```txt
POST /api/auth/login
  ↓ AuthService.validateUser(email, password)
  ↓ jika valid → jwtService.sign({ sub: user.id, email })
  ↓ return { access_token: "eyJ..." }
```

---

### VenuesModule

**Komponen:**

| Komponen | Fungsi |
|---|---|
| VenuesPageController | Route halaman CRUD venue, dilindungi SessionAuthGuard |
| VenuesApiController | Endpoint JSON CRUD venue, dilindungi JwtAuthGuard |
| VenuesService | findAll, findOne, findOneWithBookings, create, update, remove |

**Alur VenuesService:**

```txt
findAll(search?)
  → prisma.venue.findMany() dengan filter ILIKE jika search ada

findOne(id)
  → prisma.venue.findUniqueOrThrow({ where: { id } })
  → throw NotFoundException jika tidak ditemukan

findOneWithBookings(id)
  → prisma.venue.findUniqueOrThrow({
      where: { id },
      include: { bookings: { orderBy: { eventDate: 'asc' } } }
    })

create(dto)
  → prisma.venue.create({ data: dto })

update(id, dto)
  → findOne(id) terlebih dahulu → throw NotFoundException jika tidak ada
  → prisma.venue.update({ where: { id }, data: dto })

remove(id)
  → findOne(id) terlebih dahulu
  → prisma.eventBooking.count({
      where: {
        venueId: id,
        bookingStatus: { in: ['pending', 'confirmed'] }
      }
    })
  → jika count > 0 → throw BadRequestException("Venue masih memiliki booking aktif")
  → jika count = 0 → prisma.venue.delete({ where: { id } })
```

---

### EventBookingsModule

**Komponen:**

| Komponen | Fungsi |
|---|---|
| EventBookingsPageController | Route halaman CRUD booking, dilindungi SessionAuthGuard |
| EventBookingsApiController | Endpoint JSON CRUD booking, dilindungi JwtAuthGuard |
| EventBookingsService | findAll, findOne, findOneWithVenue, create, update, remove, checkConflict |

**Alur EventBookingsService:**

```txt
create(dto)
  → VenuesService.findOne(dto.venueId)
      → throw NotFoundException jika venue tidak ada
  → cek venue.status === 'available'
      → throw BadRequestException jika maintenance/inactive
  → cek dto.attendees <= venue.capacity (jika attendees diisi)
      → throw BadRequestException jika melebihi kapasitas
  → checkConflict(dto.venueId, dto.eventDate, dto.startTime, dto.endTime, null)
      → throw ConflictException jika jadwal bentrok
  → prisma.eventBooking.create({ data: dto })

update(id, dto)
  → findOne(id) → throw NotFoundException jika tidak ada
  → VenuesService.findOne(dto.venueId) jika venueId berubah
  → checkConflict(..., excludeId: id)
  → prisma.eventBooking.update({ where: { id }, data: dto })

remove(id)
  → findOne(id) → throw NotFoundException jika tidak ada
  → prisma.eventBooking.delete({ where: { id } })
  (tidak ada cek booking aktif — booking boleh dihapus kapan saja)

checkConflict(venueId, eventDate, startTime, endTime, excludeId?)
  → prisma.eventBooking.findFirst({
      where: {
        venueId,
        eventDate,
        bookingStatus: { not: 'cancelled' },
        id: excludeId ? { not: excludeId } : undefined,
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } }
        ]
      }
    })
  → jika ditemukan → throw ConflictException
```

---

### DashboardModule

**Komponen:**

| Komponen | Fungsi |
|---|---|
| DashboardController | GET /dashboard → render dashboard/index |
| DashboardService | getStats() → aggregate data dari Prisma |

**Alur DashboardService:**

```txt
getStats()
  → Promise.all([
      prisma.venue.count(),
      prisma.eventBooking.count(),
      prisma.eventBooking.count({ where: { bookingStatus: 'pending' } }),
      prisma.eventBooking.count({ where: { bookingStatus: 'confirmed' } }),
      prisma.eventBooking.count({ where: { bookingStatus: 'cancelled' } }),
      prisma.venue.count({ where: { status: 'available' } }),
      prisma.venue.count({ where: { status: 'maintenance' } }),
    ])
  → return { totalVenues, totalBookings, pending, confirmed, cancelled, available, maintenance }
```

---

## 25. Environment Variables

```env
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_venue_booking?schema=public"

SESSION_SECRET=change-this-session-secret
SESSION_MAX_AGE=86400000

JWT_SECRET=change-this-jwt-secret
JWT_EXPIRES_IN=1d
```

---

## 26. Setup dan Installation

```bash
# Clone repository
git clone https://github.com/username/smart-venue-booking.git
cd smart-venue-booking

# Install dependencies
npm install

# Copy environment
cp .env.example .env
# Edit .env sesuai konfigurasi database lokal

# Generate Prisma Client
npx prisma generate

# Run migration
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Build Tailwind CSS
npm run build:css

# Run development server
npm run start:dev
```

Akses aplikasi:

| URL | Keterangan |
|---|---|
| `http://localhost:3000/login` | Login admin |
| `http://localhost:3000/dashboard` | Dashboard |
| `http://localhost:3000/venues` | Venue page |
| `http://localhost:3000/event-bookings` | Event booking page |
| `http://localhost:3000/api-docs` | Swagger API docs |

Default admin:

```txt
Email    : admin@venue.com
Password : admin123
```

---

## 27. Coding Conventions

| Konteks | Konvensi | Contoh |
|---|---|---|
| File | kebab-case | `event-bookings.service.ts` |
| Class | PascalCase | `EventBookingsService` |
| Method/variable | camelCase | `findOneWithVenue()` |
| Database table | snake_case | `event_bookings` |
| Database column | snake_case | `booking_status`, `price_per_day` |
| Route | kebab-case | `/event-bookings/:id/edit` |
| DTO | PascalCase + Dto | `CreateEventBookingDto` |

Aturan utama:

1. Controller hanya memanggil service.
2. Business logic berada di service.
3. Semua input memakai DTO validation.
4. Page controller render EJS.
5. API controller return JSON.
6. Error harus memakai NestJS exception.

---

## 28. Development Phases

Project dibagi menjadi 6 fase pengerjaan berurutan.
Setiap fase harus selesai dan berjalan sebelum memulai fase berikutnya.

---

### Phase 1 — Setup dan Infrastruktur

**Target:** Project bisa dijalankan, database terhubung, halaman kosong bisa diakses.

- [ ] Inisiasi project NestJS: `npx @nestjs/cli new smart-venue-booking`
- [ ] Setup TypeScript strict mode di `tsconfig.json`
- [ ] Setup ESLint dan Prettier
- [ ] Setup `@nestjs/config` dan buat file `.env` dari `.env.example`
- [ ] Install dan konfigurasi Prisma: `npm install prisma @prisma/client`
- [ ] Tulis Prisma schema lengkap (User, Venue, EventBooking)
- [ ] Jalankan migrasi pertama: `npx prisma migrate dev --name init`
- [ ] Buat `PrismaService` dan `PrismaModule` global
- [ ] Setup EJS sebagai template engine di `main.ts`
- [ ] Setup static assets untuk Tailwind CSS output
- [ ] Setup `express-session` + `connect-pg-simple` di `main.ts`
- [ ] Setup `connect-flash` di `main.ts`
- [ ] Setup `helmet` di `main.ts`
- [ ] Buat layout utama `views/layouts/main.ejs` dengan sidebar Tailwind
- [ ] Init git repository, buat commit pertama, push ke GitHub
- [ ] Buat file `README.md` awal

---

### Phase 2 — Authentication

**Target:** Admin bisa login dan logout. Semua route terlindungi.

- [ ] Install Passport: `passport`, `passport-local`, `passport-jwt`, `@nestjs/passport`, `@nestjs/jwt`
- [ ] Buat `UsersModule` dan `UsersService` dengan method `findByEmail()`
- [ ] Buat `AuthModule`, `AuthService` dengan `validateUser()` dan `generateToken()`
- [ ] Buat `LocalStrategy` untuk form login
- [ ] Buat `JwtStrategy` untuk API endpoint
- [ ] Buat `SessionAuthGuard` untuk proteksi halaman
- [ ] Buat `JwtAuthGuard` untuk proteksi API
- [ ] Buat `LoginDto` dengan validasi email dan password
- [ ] Buat `AuthPageController`: `GET /login`, `POST /login`, `POST /logout`
- [ ] Buat `AuthApiController`: `POST /api/auth/login` → return JWT
- [ ] Buat view `views/auth/login.ejs`
- [ ] Buat seed minimal: satu data admin di tabel `users`
- [ ] Test: login berhasil → redirect dashboard, login gagal → flash error
- [ ] Test: akses `/dashboard` tanpa login → redirect `/login`
- [ ] Test: `POST /api/auth/login` di Postman → dapat `access_token`

---

### Phase 3 — CRUD Venue

**Target:** Admin bisa mengelola data venue sepenuhnya.

- [ ] Buat `VenuesModule`, `VenuesService`, `CreateVenueDto`, `UpdateVenueDto`
- [ ] Implementasi semua method di `VenuesService`: `findAll`, `findOne`, `findOneWithBookings`, `create`, `update`, `remove`
- [ ] Implementasi validasi delete: cek booking aktif (`pending` atau `confirmed`) sebelum hapus
- [ ] Buat `VenuesPageController` dengan semua route halaman
- [ ] Buat `VenuesApiController` dengan semua endpoint JSON
- [ ] Buat view `venues/index.ejs`, `venues/show.ejs`, `venues/create.ejs`, `venues/edit.ejs`
- [ ] Implementasi flash message success/error di setiap operasi
- [ ] Implementasi fitur search di `findAll`
- [ ] Buat seed: minimal 5 data venue
- [ ] Test semua halaman di browser
- [ ] Test semua endpoint venue di Postman dengan JWT

---

### Phase 4 — CRUD Event Booking

**Target:** Admin bisa mengelola booking sepenuhnya termasuk validasi bisnis.

- [ ] Buat `EventBookingsModule`, `EventBookingsService`, `CreateEventBookingDto`, `UpdateEventBookingDto`
- [ ] Implementasi `checkConflict()` dengan logika overlap
- [ ] Implementasi semua method di `EventBookingsService` dengan urutan validasi:
  - cek venue exists
  - cek venue status available
  - cek attendees <= kapasitas
  - cek booking conflict
- [ ] Buat `EventBookingsPageController` dengan semua route halaman
- [ ] Buat `EventBookingsApiController` dengan semua endpoint JSON
- [ ] Buat view `event-bookings/index.ejs`, `event-bookings/show.ejs`, `event-bookings/create.ejs`, `event-bookings/edit.ejs`
- [ ] Dropdown venue di form create/edit load dari database
- [ ] Tampilkan relasi di `venues/show.ejs`: tabel booking terkait
- [ ] Tampilkan relasi di `event-bookings/show.ejs`: card info venue
- [ ] Buat seed: minimal 15 data booking dari berbagai venue
- [ ] Test semua halaman di browser
- [ ] Test validasi booking conflict di browser dan Postman
- [ ] Test semua endpoint booking di Postman

---

### Phase 5 — Dashboard dan Error Handling

**Target:** Dashboard berfungsi. Semua skenario error tertangani dengan rapi.

- [ ] Buat `DashboardModule`, `DashboardService.getStats()`, `DashboardController`
- [ ] Buat view `dashboard/index.ejs` dengan card statistik
- [ ] Buat `AllExceptionsFilter` sebagai global exception filter
- [ ] Daftarkan global filter di `main.ts`
- [ ] Buat view `errors/404.ejs` dan `errors/500.ejs`
- [ ] Setup Swagger di `main.ts`: `SwaggerModule.setup('api-docs', app, document)`
- [ ] Test semua skenario error: 404, 409 conflict, 400 validation, 401 unauthorized
- [ ] Verifikasi flash message muncul di semua operasi CRUD

---

### Phase 6 — Finalisasi dan Dokumentasi

**Target:** Project siap dinilai dan di-demo.

- [ ] Polish UI: konsistensi tampilan semua halaman
- [ ] Verifikasi semua aturan bisnis berjalan dengan benar
- [ ] Lengkapi `README.md`: deskripsi, ERD (dari dbdiagram.io), screenshot semua halaman, daftar dependency, cara instalasi, akun demo
- [ ] Export Postman collection sebagai file `.json` dan simpan di root project
- [ ] Buat diagram ERD di dbdiagram.io menggunakan schema yang sudah ada
- [ ] Screenshot semua halaman aplikasi untuk README
- [ ] Final commit dan push semua perubahan
- [ ] Rekam video demo menggunakan Loom/Screenpresso sesuai checklist Section 32

---

## 29. Skenario Penggunaan Sistem

### 29.1 Login Admin

1. Admin membuka `/login`.
2. Admin mengisi email dan password.
3. Sistem memvalidasi credential.
4. Jika valid, admin diarahkan ke `/dashboard`.
5. Jika gagal, sistem menampilkan pesan error.

### 29.2 Mengelola Venue

1. Admin membuka `/venues`.
2. Admin melihat list venue.
3. Admin dapat mencari, membuat, mengedit, melihat detail, atau menghapus venue.
4. Detail venue menampilkan daftar booking terkait.

### 29.3 Mengelola Event Booking

1. Admin membuka `/event-bookings`.
2. Admin membuat booking baru dengan memilih venue.
3. Sistem mengecek status venue, kapasitas, dan jadwal bentrok.
4. Jika valid, booking disimpan.
5. Admin dapat mengubah status booking dan pembayaran.

### 29.4 API Testing

1. Login melalui `POST /api/auth/login`.
2. Ambil `access_token`.
3. Gunakan token di Postman.
4. Test endpoint venue dan event booking.
5. Test error case seperti data tidak ditemukan dan booking conflict.

---

## 30. Future Improvement

Fitur yang dapat dikembangkan:

1. Landing page publik.
2. Request booking dari user umum.
3. Kalender ketersediaan venue.
4. Multi-role user.
5. Payment gateway.
6. Notifikasi email/WhatsApp.
7. Upload gambar venue.
8. Export laporan PDF/Excel.
9. Audit log.
10. Statistik pendapatan.
11. Pagination pada halaman list.
12. Rate limiting pada API endpoint.
13. Unit test dan integration test.

---

## 31. Output Project

Output akhir:

1. Source code repository.
2. README.md.
3. PROJECT-PLAN.md.
4. Screenshot aplikasi.
5. Postman collection (file `.json`).
6. Link video demo.
7. ERD database (dari dbdiagram.io).

---

## 32. Rencana Video Demo

Isi video demo:

1. Penjelasan singkat project.
2. Demo login dan logout.
3. Demo dashboard.
4. Demo CRUD venue.
5. Demo detail venue dengan relasi booking.
6. Demo CRUD event booking.
7. Demo validasi kapasitas.
8. Demo validasi venue maintenance/inactive.
9. Demo validasi jadwal bentrok.
10. Demo search.
11. Demo API Postman dengan JWT.
12. Penjelasan MVC dan struktur folder.
13. Penjelasan error handling.

---

## 33. Kesimpulan

Venue Event Booking Management adalah aplikasi admin panel untuk mengelola venue dan event booking secara terpusat. Sistem ini menerapkan relasi one-to-many antara venue dan event booking, server-rendered page menggunakan EJS, styling dengan Tailwind CSS, serta API endpoint untuk kebutuhan testing melalui Postman.

Project ini mencakup fitur utama seperti authentication, dashboard, CRUD venue, CRUD event booking, search, validasi status venue, validasi kapasitas peserta, booking conflict validation, JWT API, DTO validation, dan error handling. Dengan scope tersebut, project ini sesuai untuk challenge fullstack TypeScript berbasis NestJS dan tetap realistis untuk dikembangkan.
