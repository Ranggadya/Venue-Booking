# Smart Venue & Event Booking Management

<div align="center">

![VenueControl Dashboard](./public/dashboard.png)

**Admin panel berbasis web untuk mengelola venue, jadwal event, status booking, dan status pembayaran secara terpusat.**

![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?style=flat-square&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)

</div>

---

## 📌 Deskripsi Project

**Smart Venue & Event Booking Management** adalah aplikasi admin panel untuk membantu pengelola venue dalam mencatat data venue, membuat event booking, memantau status booking, serta mengelola status pembayaran.

Project ini menggunakan pendekatan **NestJS MVC dengan Server-Side Rendering (SSR)**. Halaman admin dirender menggunakan **EJS + Tailwind CSS**, sedangkan endpoint API JSON disediakan untuk testing menggunakan Postman atau kebutuhan integrasi lain.

Sistem ini memiliki dua entitas utama:

- **Venues** — data tempat/ruangan yang dapat digunakan untuk event.
- **Event Bookings** — data pemesanan event yang terhubung ke satu venue.

Relasi utama pada sistem adalah:

```txt
Venue (1) ───────────────< EventBooking (N)
```

Satu venue dapat memiliki banyak event booking, sedangkan satu event booking hanya menggunakan satu venue.

---

## ✨ Fitur Utama

### Authentication

- Login dan logout admin
- Session-based authentication untuk halaman admin SSR
- JWT Bearer authentication untuk API endpoint
- Route protection menggunakan guard

### Dashboard

- Statistik total venue, total booking, booking confirmed, dan payment unpaid
- Booking trend chart menggunakan Chart.js
- Overview status venue dan booking
- Recent bookings untuk melihat aktivitas terbaru

### Venue Management

- List data venue
- Search venue berdasarkan nama, lokasi, atau status
- Detail venue beserta booking history
- Create, update, dan delete venue
- Validasi delete venue: venue tidak bisa dihapus jika masih memiliki booking aktif

### Event Booking Management

- List data event booking
- Search booking berdasarkan nama event, organizer, venue, atau status
- Detail booking beserta informasi venue
- Create, update, dan delete booking
- Support booking lebih dari satu hari menggunakan `start_date` dan `end_date`
- Validasi kapasitas peserta
- Validasi status venue
- Validasi waktu booking
- Deteksi jadwal bentrok pada venue yang sama

### API

- API Auth, Venues, dan Event Bookings
- Endpoint dilindungi JWT Bearer token
- Cocok untuk testing menggunakan Postman
- Response error dalam format JSON

---

## 🖥️ Screenshots

### Login Page

![Login Page](./public/login.png)

### Dashboard

![Dashboard](./public/dashboard.png)

### Venue List

![Venue List](./public/venues.png)

### Venue Detail

![Venue Detail](./public/venues-show.png)

### Create Venue

![Create Venue](./public/venues-create.png)

### Edit Venue

![Edit Venue](./public/venues-edit.png)

### Event Booking List

![Event Booking List](./public/bookings.png)

### Event Booking Detail

![Event Booking Detail](./public/bookings-show.png)

### Create Event Booking

![Create Event Booking](./public/bookings-create.png)

### Edit Event Booking

![Edit Event Booking](./public/bookings-edit.png)

---

## 🧩 ERD

![ERD](./public/erd.svg)

### DBML Schema

```dbml
Table users {
  id         int          [pk, increment]
  name       varchar(100) [not null]
  email      varchar(100) [unique, not null]
  password   varchar(255) [not null]
  created_at timestamp    [not null, default: `now()`]
  updated_at timestamp    [not null]
}

Table venues {
  id            int            [pk, increment]
  name          varchar(150)   [not null]
  location      varchar(255)   [not null]
  capacity      int            [not null]
  facilities    text           [null]
  price_per_day decimal(12,2)  [not null]
  status        varchar(20)    [not null, default: 'available', note: 'available | maintenance | inactive']
  description   text           [null]
  created_at    timestamp      [not null, default: `now()`]
  updated_at    timestamp      [not null]
}

Table event_bookings {
  id              int          [pk, increment]
  venue_id        int          [not null]
  event_name      varchar(150) [not null]
  organizer_name  varchar(100) [not null]
  start_date      date         [not null]
  end_date        date         [not null]
  start_time      time         [not null]
  end_time        time         [not null]
  attendees       int          [null]
  booking_status  varchar(20)  [not null, default: 'pending', note: 'pending | confirmed | cancelled']
  payment_status  varchar(20)  [not null, default: 'unpaid', note: 'unpaid | paid | refunded']
  notes           text         [null]
  created_at      timestamp    [not null, default: `now()`]
  updated_at      timestamp    [not null]
}

Ref: event_bookings.venue_id > venues.id
```

---

## ⚙️ Tech Stack

### Runtime & Language

| Teknologi | Versi | Keterangan |
|---|---:|---|
| Node.js | 20.x LTS | Runtime JavaScript |
| TypeScript | 5.7.x | Type safety |
| npm | 10.x | Package manager |

### Framework & Core

| Teknologi | Versi | Keterangan |
|---|---:|---|
| NestJS | 11.x | Framework backend TypeScript |
| Express | 5.x | HTTP adapter |
| EJS | 6.x | Template engine SSR |

### Database & ORM

| Teknologi | Versi | Keterangan |
|---|---:|---|
| PostgreSQL | 16.x | Database relasional |
| Prisma ORM | 7.8.x | ORM dan migration |
| @prisma/adapter-pg | 7.8.x | PostgreSQL adapter untuk Prisma 7 |
| pg | 8.x | PostgreSQL driver |

### Frontend & UI

| Teknologi | Versi | Keterangan |
|---|---:|---|
| Tailwind CSS | 3.4.x | Utility-first CSS |
| Chart.js | 4.4.x | Chart dashboard |
| Inter Font | — | Typography |
| EJS Layouts | 2.5.x | Layouting SSR |

### Authentication & Security

| Teknologi | Versi | Keterangan |
|---|---:|---|
| Passport.js | 0.7.x | Authentication middleware |
| passport-local | 1.x | Login email/password |
| passport-jwt | 4.x | JWT strategy |
| @nestjs/jwt | 11.x | JWT integration |
| express-session | 1.19.x | Session halaman admin |
| connect-pg-simple | 10.x | PostgreSQL session store |
| bcrypt | 6.x | Password hashing |
| helmet | 8.x | Security headers |
| connect-flash | 0.1.x | Flash messages |
| morgan | 1.x | Request logger |

---

```

### MVC Mapping

| MVC | Implementasi |
|---|---|
| Model | Prisma schema, Prisma Client, PostgreSQL |
| View | EJS templates, Tailwind CSS |
| Controller | NestJS Page Controller dan API Controller |
| Service | Business logic, validation, dan query Prisma |

---

## Struktur Folder

```txt
venue-booking/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── common/
│   │   ├── filters/
│   │   └── guards/
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── auth/
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── strategies/
│   │   ├── auth.module.ts
│   │   ├── auth.serializer.ts
│   │   └── auth.service.ts
│   │
│   ├── users/
│   ├── dashboard/
│   ├── venues/
│   └── event-bookings/
│
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── auth/
│   ├── dashboard/
│   ├── venues/
│   ├── event-bookings/
│   └── errors/
│
├── public/
│   ├── css/
│   ├── js/
│   └── *.png / *.svg
│
├── .env.example
├── package.json
├── prisma.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Setup & Installation

### Prasyarat

Pastikan sudah terinstall:

- Node.js 20.x LTS
- npm 10.x
- PostgreSQL 16.x

### 1. Clone Repository

```bash
git clone https://github.com/Ranggadya/Venue-Booking.git
cd Venue-Booking
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` berdasarkan `.env.example`.

```bash
cp .env.example .env
```

Contoh konfigurasi:

```env
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

DATABASE_URL="postgresql://postgres:password@localhost:5432/venue_booking?schema=public"

SESSION_SECRET=change-this-session-secret
SESSION_MAX_AGE=86400000

JWT_SECRET=change-this-jwt-secret
JWT_EXPIRES_IN=1d
```

### 4. Buat Database

```bash
createdb venue_booking
```

Atau buat database baru melalui pgAdmin dengan nama:

```txt
venue_booking
```

### 5. Jalankan Migration

```bash
npx prisma migrate dev
```

### 6. Jalankan Seed Data

```bash
npx prisma db seed
```

### 7. Build Tailwind CSS

```bash
npm run build:css
```

Untuk development sambil auto build CSS:

```bash
npm run watch:css
```

### 8. Jalankan Development Server

```bash
npm run start:dev
```

Aplikasi berjalan di:

```txt
http://localhost:3000
```

---

## Demo Account

| Role | Email | Password |
|---|---|---|
| Admin | `admin@smartvenue.id` | `Admin@1234` |

> Pastikan sudah menjalankan `npx prisma db seed` agar akun admin tersedia.

---

## 🌐 Akses Aplikasi

| URL | Keterangan |
|---|---|
| `http://localhost:3000/login` | Login admin |
| `http://localhost:3000/dashboard` | Dashboard |
| `http://localhost:3000/venues` | Manajemen venue |
| `http://localhost:3000/event-bookings` | Manajemen event booking |

---

## 🔌 API Endpoints

Semua endpoint API selain login membutuhkan header:

```http
Authorization: Bearer <access_token>
```

### Auth

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login dan mendapatkan JWT token |

Request body:

```json
{
  "email": "admin@smartvenue.id",
  "password": "Admin@1234"
}
```

Response:

```json
{
  "access_token": "jwt_access_token"
}
```

### Venues

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/venues` | JWT | List venue, support `?search=` |
| GET | `/api/venues/:id` | JWT | Detail venue beserta booking |
| POST | `/api/venues` | JWT | Create venue |
| PATCH | `/api/venues/:id` | JWT | Update venue |
| DELETE | `/api/venues/:id` | JWT | Delete venue |

Contoh request `POST /api/venues`:

```json
{
  "name": "Aula Utama",
  "location": "Gedung A Lt. 2",
  "capacity": 300,
  "facilities": "AC, Proyektor, Mic, Sound System",
  "price_per_day": 5000000,
  "status": "available",
  "description": "Aula untuk acara skala besar."
}
```

### Event Bookings

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/event-bookings` | JWT | List booking, support `?search=` |
| GET | `/api/event-bookings/:id` | JWT | Detail booking beserta venue |
| POST | `/api/event-bookings` | JWT | Create booking |
| PATCH | `/api/event-bookings/:id` | JWT | Update booking |
| DELETE | `/api/event-bookings/:id` | JWT | Delete booking |

Contoh request `POST /api/event-bookings`:

```json
{
  "venue_id": 1,
  "event_name": "Seminar Teknologi",
  "organizer_name": "Komunitas Developer",
  "start_date": "2026-07-15",
  "end_date": "2026-07-16",
  "start_time": "08:00",
  "end_time": "12:00",
  "attendees": 250,
  "booking_status": "pending",
  "payment_status": "unpaid",
  "notes": "Mohon sediakan meja registrasi."
}
```

---

## Postman Testing

Project ini menyediakan Postman Collection untuk testing API.

### Rekomendasi Collection

Gunakan collection yang lebih tahan terhadap perubahan database:

```txt
venue-booking-robust.postman_collection.json
```

Collection ini membuat data testing sendiri sehingga tidak bergantung pada ID seed tertentu.

### Urutan Testing Disarankan

```txt
1. Auth Login
2. Setup Dynamic Test Data
3. Venues API Tests
4. Event Bookings API Tests
5. Cleanup Optional
```

### Manual Setup Postman

1. Import collection ke Postman.
2. Set `base_url` menjadi:

```txt
http://localhost:3000
```

3. Jalankan request login.
4. Token akan tersimpan otomatis ke variable `token`.
5. Jalankan request lain yang membutuhkan Bearer token.

---

## Aturan Bisnis

### Venue Rules

| Aturan | Keterangan |
|---|---|
| Status venue | Hanya `available`, `maintenance`, atau `inactive` |
| Booking venue | Venue harus berstatus `available` untuk menerima booking baru |
| Delete venue | Venue tidak dapat dihapus jika masih memiliki booking aktif |
| Booking aktif | Booking dengan status `pending` atau `confirmed` |

### Event Booking Rules

| Aturan | Keterangan |
|---|---|
| Venue wajib ada | `venue_id` harus valid |
| Kapasitas | `attendees` tidak boleh melebihi kapasitas venue |
| Rentang tanggal | `end_date` tidak boleh lebih awal dari `start_date` |
| Waktu | `end_time` harus lebih besar dari `start_time` |
| Jadwal bentrok | Booking tidak boleh overlap pada venue yang sama |
| Cancelled booking | Booking `cancelled` tidak dihitung sebagai konflik |

### Logika Conflict Detection

```txt
Booking dianggap bentrok jika:
  existing.start_date <= new.end_date
  AND existing.end_date >= new.start_date
  AND existing.start_time < new.end_time
  AND existing.end_time > new.start_time
  AND booking_status != cancelled
```

Artinya sistem mengecek overlap berdasarkan **range tanggal** dan **range waktu** pada venue yang sama.

---

## Error Handling

Semua error ditangani oleh global exception filter.

Contoh response error API:

```json
{
  "statusCode": 409,
  "message": "Jadwal bentrok dengan booking \"Seminar Teknologi\" pada 2026-07-15 sampai 2026-07-16, jam 08:00–12:00 di venue yang sama",
  "error": "Conflict",
  "path": "/api/event-bookings",
  "timestamp": "2026-06-19T10:00:00.000Z"
}
```

### HTTP Status Code

| Status | Kondisi |
|---:|---|
| 400 | Input tidak valid, venue tidak available, kapasitas melebihi, waktu tidak valid |
| 401 | Login gagal atau token tidak valid |
| 404 | Data tidak ditemukan |
| 409 | Jadwal booking bentrok |
| 500 | Error tidak terduga |

---

## Authentication Flow

### Halaman Admin

```txt
Admin login
→ POST /login
→ Passport LocalStrategy
→ bcrypt.compare()
→ Jika valid: user disimpan ke session
→ Redirect ke /dashboard
```

### API

```txt
POST /api/auth/login
→ Validasi email dan password
→ Generate JWT access token
→ Request API memakai Authorization: Bearer <token>
→ JwtStrategy validate payload
→ Controller API dijalankan
```

---

## Available Scripts

| Script | Fungsi |
|---|---|
| `npm run start:dev` | Menjalankan server development |
| `npm run build` | Build project NestJS |
| `npm run start:prod` | Menjalankan build production |
| `npm run build:css` | Build Tailwind CSS |
| `npm run watch:css` | Watch Tailwind CSS |
| `npm run lint` | Menjalankan ESLint |
| `npm run test` | Menjalankan unit test |

---

## Reset Database

Jika data testing sudah berubah atau ID seed tidak sesuai, reset database dengan:

```bash
npx prisma migrate reset
```

Lalu jalankan ulang aplikasi:

```bash
npm run start:dev
```

---

## 🎥 Video Demo

Link video demo:

```txt
Tambahkan link video Loom/YouTube di sini
```

Suggested demo flow:

1. Perkenalan project dan tech stack
2. Login admin
3. Dashboard overview
4. CRUD venue
5. Detail venue dan relasi booking
6. CRUD event booking
7. Validasi kapasitas
8. Validasi venue maintenance/inactive
9. Validasi jadwal bentrok
10. API testing via Postman dengan JWT

---

## Scope & Limitations

### In Scope

- Admin login/logout
- Dashboard ringkasan data
- CRUD venue
- CRUD event booking
- Search venue dan booking
- Multi-day booking
- Booking conflict detection
- Business validation
- API endpoint dengan JWT
- Session auth untuk halaman admin
- Error handling terpusat

### Future Improvement

- Role management
- Halaman publik untuk customer
- Upload gambar venue
- Payment gateway
- Notifikasi email atau WhatsApp
- Kalender ketersediaan venue
- Export laporan PDF/Excel
- Audit log
- Dark mode

---

## Author

**Ranggadya Aditama Ramadhani**

- GitHub: [@Ranggadya](https://github.com/Ranggadya)
- LinkedIn: [Ranggadya Aditama Ramadhani](https://www.linkedin.com/in/ranggadya/)

---