# DESIGN.md — Smart Venue & Event Booking Management Dashboard

## 1. Tujuan Dokumen

Dokumen ini berisi rancangan UI/UX dan arahan implementasi frontend untuk **Smart Venue & Event Booking Management**, khususnya bagian **admin dashboard** dan halaman manajemen data. Desain dashboard mengikuti referensi visual pada gambar yang diberikan: clean admin panel, sidebar putih, konten dengan background abu kebiruan yang soft, card statistik berwarna gradient, rounded corner besar, shadow halus, chart area, overview panel, dan tabel aktivitas.

Dokumen ini dibuat supaya ketika implementasi EJS + Tailwind CSS dilakukan, tampilan antar halaman tetap konsisten, modern, dan terlihat seperti dashboard SaaS profesional.

---

## 2. Konsep Desain Utama

Dashboard ini menggunakan konsep **modern soft admin dashboard**. Karakter desainnya adalah ringan, bersih, tidak terlalu ramai, tetapi tetap informatif. Karena project ini digunakan oleh admin/pengelola venue, tampilan harus membantu admin membaca ringkasan data venue dan event booking dengan cepat.

Secara visual, desain mengikuti style berikut:

```txt
Clean layout
Soft background
White sidebar
Rounded cards
Gradient statistic cards
Subtle shadow
Modern typography
Simple icon style
Readable table
Status badge yang jelas
```

Target kesan yang ingin dibangun:

| Aspek | Arah Desain |
|---|---|
| Profesional | Cocok untuk admin panel project fullstack/challenge |
| Modern | Mirip dashboard SaaS/web app masa kini |
| Clean | Tidak terlalu banyak warna atau elemen dekoratif |
| Informatif | Data penting langsung terlihat di dashboard |
| Friendly | Warna soft, rounded corner, dan spacing lega |
| Mudah dipakai | Navigasi sederhana, action button jelas, status mudah dibedakan |

---

## 3. Nama Produk dan Branding

Nama aplikasi tetap menggunakan nama project utama:

```txt
Smart Venue
```

Untuk tampilan brand di sidebar, bisa menggunakan nama pendek:

```txt
VenueControl
```

Alternatif nama brand jika ingin lebih modern:

```txt
VenueHub
VenueFlow
VenueSpace
SmartVenue
VenueBoard
```

Rekomendasi final untuk sidebar:

```txt
VenueControl
```

Alasannya, nama ini terasa seperti dashboard kontrol untuk mengelola venue, booking, status pembayaran, dan jadwal event.

---

## 4. Struktur Layout Utama

Layout mengikuti pola dashboard pada gambar referensi.

```txt
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │ Topbar                                             │
│         ├────────────────────────────────────────────────────│
│         │ Main Content                                       │
│         │ ├── Breadcrumb + Date Filter                       │
│         │ ├── Statistic Cards                                │
│         │ ├── Chart + Overview Panel                         │
│         │ └── Recent Booking / Activity Table                │
└──────────────────────────────────────────────────────────────┘
```

### 4.1 Desktop Layout

| Area | Ukuran / Style |
|---|---|
| Sidebar | Width 260px, fixed kiri, background putih |
| Topbar | Height 72px, background putih, sticky top optional |
| Content | Margin-left mengikuti sidebar, background `#F4F7FB` |
| Main padding | 24px desktop |
| Card radius | 18px sampai 22px |
| Card shadow | Soft shadow, jangan terlalu gelap |
| Gap antar card | 20px sampai 24px |

### 4.2 Responsive Layout

| Breakpoint | Perilaku |
|---|---|
| Desktop `>= 1024px` | Sidebar fixed, content dua kolom untuk chart dan overview |
| Tablet `768px - 1023px` | Sidebar bisa collapsible, statistic cards 2 kolom |
| Mobile `< 768px` | Sidebar menjadi drawer, statistic cards 1 kolom, table horizontal scroll |

---

## 5. Design Tokens

Design tokens dipakai supaya warna, spacing, font, radius, dan shadow konsisten di semua halaman.

### 5.1 Color Palette

#### Base Colors

| Token | Hex | Fungsi |
|---|---:|---|
| `bg-app` | `#F4F7FB` | Background utama content |
| `surface` | `#FFFFFF` | Card, sidebar, topbar, table wrapper |
| `surface-soft` | `#F8FAFF` | Input, table header, mini card |
| `border` | `#E8EEF7` | Border halus |
| `text-primary` | `#111827` | Judul dan angka penting |
| `text-secondary` | `#6B7280` | Deskripsi, label, breadcrumb |
| `text-muted` | `#9CA3AF` | Placeholder dan metadata |

#### Primary Colors

| Token | Hex | Fungsi |
|---|---:|---|
| `primary` | `#3B82F6` | Active sidebar, button utama |
| `primary-dark` | `#2563EB` | Hover button utama |
| `primary-soft` | `#EFF6FF` | Background badge/button soft |

#### Status Colors

| Status | Background | Text | Fungsi |
|---|---:|---:|---|
| Available | `#DCFCE7` | `#166534` | Venue tersedia |
| Maintenance | `#FEF3C7` | `#92400E` | Venue maintenance |
| Inactive | `#F3F4F6` | `#4B5563` | Venue tidak aktif |
| Pending | `#FEF3C7` | `#B45309` | Booking menunggu |
| Confirmed | `#DBEAFE` | `#1D4ED8` | Booking dikonfirmasi |
| Cancelled | `#FEE2E2` | `#B91C1C` | Booking dibatalkan |
| Paid | `#DCFCE7` | `#15803D` | Pembayaran lunas |
| Unpaid | `#FFE4E6` | `#BE123C` | Belum bayar |
| Refunded | `#E0E7FF` | `#4338CA` | Dana dikembalikan |

#### Gradient Statistic Cards

Mengikuti referensi gambar, statistic cards memakai gradient cerah dan shape dekoratif blur di kanan.

| Card | Gradient | Cocok Untuk |
|---|---|---|
| Purple | `linear-gradient(135deg, #7C3AED, #6366F1)` | Total Venue |
| Cyan | `linear-gradient(135deg, #06B6D4, #0EA5E9)` | Total Booking |
| Blue | `linear-gradient(135deg, #3B82F6, #2563EB)` | Confirmed Booking |
| Coral | `linear-gradient(135deg, #FB7185, #F97316)` | Pending Payment / Unpaid |
| Green | `linear-gradient(135deg, #22C55E, #14B8A6)` | Available Venue |
| Amber | `linear-gradient(135deg, #F59E0B, #F97316)` | Maintenance Venue |

---

## 6. Typography

Gunakan font modern yang clean. Rekomendasi utama:

```txt
Inter
```

Alternatif:

```txt
Plus Jakarta Sans
Manrope
Poppins
```

Rekomendasi final:

```txt
Inter untuk seluruh dashboard
```

### 6.1 Type Scale

| Elemen | Size | Weight | Catatan |
|---|---:|---:|---|
| Page title | 24px | 700 | Contoh: Dashboard, Venues, Event Bookings |
| Section title | 18px - 20px | 700 | Contoh: Booking Overview |
| Card value | 30px - 34px | 700 | Angka statistik utama |
| Card label | 14px | 500 | Label card |
| Body text | 14px | 400/500 | Isi tabel dan form |
| Small text | 12px - 13px | 400/500 | Badge, metadata, breadcrumb |

---

## 7. Sidebar Design

Sidebar mengikuti gaya pada gambar referensi: putih, clean, icon outline, active menu berwarna biru dengan rounded corner.

### 7.1 Struktur Sidebar

```txt
Logo / Brand

Navigation
├── Dashboard
├── Venues
├── Event Bookings
├── Reports / Stats

Divider

System
├── Settings
├── API Docs

Bottom
├── Light/Dark Toggle optional
└── Logout
```

Karena scope project saat ini masih admin panel sederhana, menu yang direkomendasikan:

| Menu | Route | Icon | Keterangan |
|---|---|---|---|
| Dashboard | `/dashboard` | Home | Ringkasan data |
| Venues | `/venues` | Building / MapPin | CRUD venue |
| Event Bookings | `/event-bookings` | CalendarCheck | CRUD booking |
| API Docs | `/api-docs` | FileJson | Dokumentasi API Swagger |
| Logout | `/logout` | LogOut | Keluar akun |

### 7.2 Style Sidebar

| Elemen | Style |
|---|---|
| Width | `260px` |
| Background | `#FFFFFF` |
| Border kanan | `1px solid #E8EEF7` |
| Padding | `20px` |
| Menu item height | `48px` |
| Menu radius | `12px` |
| Active bg | `#3B82F6` |
| Active text | `#FFFFFF` |
| Inactive text | `#6B7280` |
| Hover bg | `#EFF6FF` |

---

## 8. Topbar Design

Topbar dibuat minimal seperti gambar referensi. Bagian kiri berisi judul halaman atau search input. Bagian kanan berisi notification icon, profile admin, dan dropdown.

### 8.1 Struktur Topbar

```txt
Topbar
├── Search bar
└── Right Actions
    ├── Message/Inbox icon optional
    ├── Notification icon optional
    └── Admin profile dropdown
```

### 8.2 Search Bar

Search bar di topbar bisa bersifat global secara visual, tetapi secara fungsi project cukup diarahkan ke search per halaman:

| Halaman | Search Digunakan Untuk |
|---|---|
| Dashboard | Optional, placeholder saja |
| Venues | Search venue berdasarkan nama, lokasi, status |
| Event Bookings | Search booking berdasarkan nama event, organizer, venue, status |

Style search:

```txt
Width desktop: 280px - 360px
Height: 44px
Background: #F8FAFF
Border: none atau 1px solid #EEF2F7
Radius: 12px
Icon: search outline
```

---

## 9. Dashboard Page Design

Dashboard adalah halaman utama setelah admin login. Halaman ini harus langsung menjawab pertanyaan:

```txt
Berapa total venue?
Berapa total booking?
Berapa booking yang masih pending?
Berapa booking yang confirmed?
Berapa venue yang available/maintenance?
Apa aktivitas booking terbaru?
```

### 9.1 Struktur Dashboard

```txt
Dashboard
├── Breadcrumb + Date Filter
├── Statistic Cards
│   ├── Total Venue
│   ├── Total Booking
│   ├── Confirmed Booking
│   └── Pending Payment / Pending Booking
├── Main Analytics
│   ├── Booking Trend Chart
│   └── Overview Panel
└── Recent Booking Table
```

### 9.2 Breadcrumb

Contoh:

```txt
Home > Dashboard
```

Style:

| Elemen | Style |
|---|---|
| Text | 14px |
| Warna default | `#6B7280` |
| Current page | `#111827` medium |
| Separator | Chevron kanan kecil |

### 9.3 Date Filter

Di kanan atas content, buat date filter seperti referensi gambar.

Contoh label:

```txt
This Month
Last 30 Days
June 2026
```

Untuk MVP, date filter boleh visual-only dulu. Jika ingin fungsional, bisa pakai query parameter:

```txt
/dashboard?range=this-month
/dashboard?range=last-30-days
```

---

## 10. Statistic Cards

Statistic card menjadi highlight utama dashboard. Card memakai gradient, text putih, icon circle putih transparan, dan dekorasi shape blur di kanan.

### 10.1 Data Card Rekomendasi

| Card | Data | Subtitle | Warna |
|---|---|---|---|
| Total Venues | `stats.totalVenues` | Registered venue | Purple gradient |
| Total Bookings | `stats.totalBookings` | All event booking | Cyan gradient |
| Confirmed | `stats.confirmed` | Confirmed booking | Blue gradient |
| Pending | `stats.pending` | Waiting confirmation | Coral gradient |

Jika ingin memasukkan status venue juga, gunakan section overview di kanan, bukan semuanya dijadikan card atas. Ini menjaga dashboard tetap rapi seperti referensi gambar.

### 10.2 Anatomi Statistic Card

```txt
┌──────────────────────────────┐
│ Title / Month                │
│ Subtitle                     │
│                              │
│ Big Number        Icon       │
└──────────────────────────────┘
```

Untuk project ini, title tidak perlu menggunakan bulan seperti gambar. Lebih cocok memakai nama metrik:

```txt
Total Venues
Registered venue

12
```

### 10.3 Ukuran Card

| Properti | Nilai |
|---|---|
| Height | 145px - 160px |
| Border radius | 18px |
| Padding | 20px |
| Text color | White |
| Value size | 32px |
| Grid desktop | 4 kolom |
| Grid tablet | 2 kolom |
| Grid mobile | 1 kolom |

### 10.4 Contoh Tailwind Class

```html
<div class="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-violet-500 to-indigo-500 p-5 text-white shadow-sm">
  <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10"></div>
  <div class="absolute right-8 top-4 h-16 w-16 rounded-full bg-white/10"></div>

  <p class="text-lg font-bold">Total Venues</p>
  <p class="mt-1 text-sm text-white/80">Registered venue</p>

  <div class="mt-7 flex items-end justify-between">
    <h3 class="text-4xl font-bold"><%= stats.totalVenues %></h3>
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-500">
      <!-- icon -->
    </div>
  </div>
</div>
```

---

## 11. Analytics Section

Analytics section terdiri dari dua bagian seperti referensi:

```txt
Kiri  : Chart card besar
Kanan : Overview card kecil
```

### 11.1 Booking Trend Chart

Chart utama menampilkan tren booking. Untuk MVP SSR, ada tiga opsi:

| Opsi | Keterangan | Rekomendasi |
|---|---|---|
| Static SVG | Chart dummy visual saja | Cocok jika ingin cepat polish UI |
| Chart.js CDN | Chart real dari data backend | Cocok jika ingin dashboard lebih hidup |
| ApexCharts | Lebih modern dan smooth | Bagus, tapi dependency tambahan |

Rekomendasi implementasi:

```txt
Gunakan Chart.js CDN untuk line chart sederhana.
```

Data yang bisa divisualisasikan:

| Dataset | Warna | Keterangan |
|---|---|---|
| Total Booking | Blue/cyan | Jumlah booking per tanggal |
| Confirmed | Purple | Booking confirmed |
| Pending | Orange/coral | Booking pending |

Judul chart:

```txt
Booking Trend
```

Subtitle kecil:

```txt
Overview of event booking activity
```

### 11.2 Chart Card Style

| Properti | Nilai |
|---|---|
| Background | `#FFFFFF` |
| Radius | `20px` |
| Padding | `22px` |
| Shadow | Soft |
| Height | 340px - 380px |
| Header | Title kiri, filter kanan |

---

## 12. Overview Panel

Overview panel adalah card kanan yang menampilkan ringkasan kecil seperti gambar referensi. Di project ini, overview lebih cocok dipakai untuk status venue dan status booking.

### 12.1 Isi Overview

```txt
Overview
├── Available Venues
├── Maintenance Venues
├── Pending Bookings
├── Cancelled Bookings
```

Bisa juga ditambahkan mini card angka:

```txt
12 Venues
34 Bookings
```

### 12.2 Progress Bar

Gunakan progress bar horizontal untuk menggambarkan distribusi status.

| Item | Warna Bar |
|---|---|
| Available Venue | Green/Cyan |
| Maintenance Venue | Amber |
| Confirmed Booking | Blue |
| Pending Booking | Coral |

Style progress:

```txt
Height: 7px
Radius: full
Background: #EEF2F7
Fill: sesuai status
```

---

## 13. Activity / Recent Booking Table

Bagian bawah dashboard memakai tabel besar seperti referensi gambar. Tabel ini menampilkan booking terbaru agar admin bisa langsung melihat aktivitas terbaru.

### 13.1 Kolom Tabel Dashboard

| Kolom | Data |
|---|---|
| Booking ID | `#BK-001` atau `#<%= booking.id %>` |
| Event Name | Nama event |
| Venue | Nama venue |
| Date & Time | Tanggal + jam mulai-selesai |
| Organizer | Nama penyelenggara |
| Booking Status | Badge pending/confirmed/cancelled |
| Payment | Badge paid/unpaid/refunded |
| Action | View detail |

### 13.2 Style Table

| Elemen | Style |
|---|---|
| Wrapper | White card, radius 20px, padding 20px |
| Header table | `#F8FAFF`, rounded, text muted |
| Row height | 64px |
| Border row | `1px solid #F1F5F9` |
| Text utama | `#334155`, 14px |
| Badge | Rounded-full, padding kecil |
| Action button | Icon button biru soft |

### 13.3 Empty State

Jika belum ada booking:

```txt
No recent bookings yet
Create your first event booking to start managing venue schedules.
```

Tombol:

```txt
Create Booking
```

---

## 14. Halaman Venue List

Halaman Venue List mengikuti style dashboard tetapi fokus pada tabel data venue.

### 14.1 Struktur Halaman

```txt
Venues Page
├── Breadcrumb
├── Page Header
│   ├── Title: Venues
│   ├── Subtitle
│   └── Add Venue Button
├── Summary Mini Cards optional
├── Search Bar
└── Venue Table
```

### 14.2 Kolom Tabel Venue

| Kolom | Data |
|---|---|
| Venue Name | Nama venue |
| Location | Lokasi |
| Capacity | Kapasitas |
| Price / Day | Harga per hari |
| Status | Badge available/maintenance/inactive |
| Created At | Tanggal dibuat optional |
| Action | View, Edit, Delete |

### 14.3 Action Button

| Action | Style |
|---|---|
| View | Soft blue icon button |
| Edit | Soft amber/blue icon button |
| Delete | Soft red icon button |
| Add Venue | Primary blue button rounded |

---

## 15. Halaman Venue Detail

Venue detail harus menampilkan informasi venue dan daftar booking terkait.

### 15.1 Struktur Halaman

```txt
Venue Detail
├── Breadcrumb
├── Header Card
│   ├── Venue name
│   ├── Status badge
│   ├── Location
│   └── Action buttons
├── Venue Info Grid
│   ├── Capacity
│   ├── Price per day
│   ├── Facilities
│   └── Description
└── Related Bookings Table
```

### 15.2 Card Info Venue

Gunakan mini card dengan icon:

| Info | Icon |
|---|---|
| Capacity | Users |
| Price | CreditCard |
| Location | MapPin |
| Facilities | Sparkles / List |

---

## 16. Halaman Event Booking List

Halaman booking list adalah halaman penting karena admin sering melihat jadwal dan status booking.

### 16.1 Struktur Halaman

```txt
Event Bookings Page
├── Breadcrumb
├── Page Header + Add Booking Button
├── Filter Row
│   ├── Search
│   ├── Booking Status Filter optional
│   └── Payment Status Filter optional
└── Booking Table
```

### 16.2 Kolom Tabel Booking

| Kolom | Data |
|---|---|
| Event Name | Nama event |
| Venue | Nama venue |
| Organizer | Penyelenggara |
| Date | Tanggal event |
| Time | Jam mulai - selesai |
| Attendees | Jumlah peserta |
| Booking Status | Badge |
| Payment Status | Badge |
| Action | View, Edit, Delete |

---

## 17. Halaman Booking Detail

Booking detail menampilkan informasi lengkap event booking dan venue yang digunakan.

### 17.1 Struktur Halaman

```txt
Booking Detail
├── Breadcrumb
├── Header Card
│   ├── Event Name
│   ├── Booking Status Badge
│   ├── Payment Status Badge
│   └── Action Buttons
├── Booking Info Grid
│   ├── Organizer
│   ├── Event Date
│   ├── Time
│   ├── Attendees
│   └── Notes
└── Venue Info Card
    ├── Venue Name
    ├── Location
    ├── Capacity
    └── Price per day
```

---

## 18. Form Design

Form create/edit venue dan booking harus clean, tidak terlalu padat, dan mudah dibaca.

### 18.1 Struktur Form Card

```txt
Form Page
├── Breadcrumb
├── Form Card
│   ├── Form Header
│   ├── Input Grid
│   └── Action Row
```

### 18.2 Style Input

| Elemen | Style |
|---|---|
| Label | 14px, medium, text slate |
| Input height | 44px - 48px |
| Border | `#E5EAF2` |
| Radius | 12px |
| Focus ring | Blue soft |
| Placeholder | Muted |
| Error text | Red 13px |

### 18.3 Button Form

| Button | Style |
|---|---|
| Save/Create | Solid blue |
| Cancel | White/soft gray border |
| Delete | Red solid/soft depending context |

---

## 19. Button System

| Variant | Penggunaan | Style |
|---|---|---|
| Primary | Create, Save, Login | Blue background, white text |
| Secondary | Cancel, Back | White background, border |
| Soft | View detail, small actions | Light blue background |
| Danger | Delete | Red background/soft red |
| Icon Button | Edit/delete di tabel | Square 38px, rounded-full/rounded-xl |

Contoh class primary button:

```html
<button class="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600">
  Add Venue
</button>
```

---

## 20. Badge System

Badge dipakai untuk status venue, booking, dan payment. Badge harus berbentuk rounded-full supaya terlihat modern.

### 20.1 Venue Status Badge

```txt
available   → green
maintenance → amber
inactive    → gray
```

### 20.2 Booking Status Badge

```txt
pending   → amber
confirmed → blue
cancelled → red
```

### 20.3 Payment Status Badge

```txt
paid     → green
unpaid   → rose/red
refunded → indigo
```

Contoh badge:

```html
<span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
  confirmed
</span>
```

---

## 21. Flash Message / Alert Design

Karena project memakai `connect-flash`, feedback success/error harus tampil rapi setelah create, update, delete, atau login gagal.

### 21.1 Success Alert

```txt
Venue berhasil ditambahkan.
Booking berhasil diperbarui.
```

Style:

```txt
Background: #DCFCE7
Text: #166534
Border: #BBF7D0
Icon: check-circle
```

### 21.2 Error Alert

```txt
Jadwal booking bentrok dengan booking lain.
Venue masih memiliki booking aktif dan tidak dapat dihapus.
```

Style:

```txt
Background: #FEE2E2
Text: #B91C1C
Border: #FECACA
Icon: alert-circle
```

---

## 22. Login Page Design

Login page tetap mengikuti style dashboard tetapi dibuat lebih fokus.

### 22.1 Struktur Login Page

```txt
Login Page
├── Left Visual Panel optional
│   ├── Gradient background
│   ├── App name
│   └── Short description
└── Login Card
    ├── Logo
    ├── Title: Welcome Back
    ├── Email input
    ├── Password input
    └── Sign In button
```

Untuk project challenge, login card satu kolom sudah cukup. Buat background utama `#F4F7FB`, lalu card putih di tengah.

### 22.2 Copywriting Login

```txt
Welcome Back
Sign in to manage venues, bookings, and event schedules.
```

---

## 23. Icon Style

Gunakan icon outline yang simpel dan konsisten. Rekomendasi:

```txt
Lucide Icons
Heroicons
Font Awesome optional
```

Rekomendasi final:

```txt
Lucide Icons via CDN atau inline SVG
```

Contoh mapping icon:

| Fitur | Icon |
|---|---|
| Dashboard | Home |
| Venues | Building2 |
| Booking | CalendarCheck |
| Revenue/Payment | CreditCard |
| Capacity | Users |
| Location | MapPin |
| Add | Plus |
| Edit | Pencil |
| Delete | Trash2 |
| View | Eye |
| Logout | LogOut |

---

## 24. Light Mode dan Dark Mode

Referensi gambar memiliki toggle Light/Dark di sidebar. Untuk MVP, dark mode boleh dibuat sebagai tampilan visual saja atau tidak diimplementasikan dulu.

Rekomendasi:

```txt
Fase awal: fokus light mode dulu.
Future improvement: dark mode menggunakan class `dark` Tailwind.
```

Jika tetap ingin menampilkan toggle seperti gambar, gunakan toggle di sidebar bagian bawah, tetapi tidak harus fungsional.

---

## 25. Micro Interaction

Supaya dashboard terasa lebih modern, tambahkan interaksi kecil yang ringan.

| Elemen | Interaksi |
|---|---|
| Sidebar item | Hover background soft blue |
| Card statistik | Hover naik 2px, shadow sedikit lebih kuat |
| Button | Hover darken, active scale 0.98 |
| Table row | Hover background `#F8FAFF` |
| Dropdown | Smooth open/close |
| Flash alert | Fade in |

Gunakan transisi:

```txt
transition-all duration-200 ease-out
```

---

## 26. Accessibility

Walaupun project ini fokus admin panel, accessibility tetap perlu diperhatikan.

| Aspek | Aturan |
|---|---|
| Kontras | Text utama harus mudah dibaca di background putih/gradient |
| Focus state | Input dan button harus punya focus ring |
| Button label | Icon button sebaiknya punya `title` atau `aria-label` |
| Table | Header kolom jelas |
| Form error | Error message muncul dekat input terkait |
| Status | Jangan hanya mengandalkan warna, tetap tampilkan teks status |

---

## 27. Tailwind CSS Configuration Recommendation

Tambahkan custom color dan shadow di `tailwind.config.js` agar class lebih konsisten.

```js
module.exports = {
  content: ['./views/**/*.ejs', './src/**/*.ts'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        app: '#F4F7FB',
        surface: '#FFFFFF',
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
        },
      },
      boxShadow: {
        soft: '0 18px 40px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
};
```

---

## 28. Rekomendasi Struktur Partial EJS

Agar UI mudah dikelola, pecah layout menjadi partial kecil.

```txt
views/
├── layouts/
│   └── main.ejs
├── partials/
│   ├── sidebar.ejs
│   ├── navbar.ejs
│   ├── breadcrumb.ejs
│   ├── flash.ejs
│   ├── stat-card.ejs
│   ├── status-badge.ejs
│   └── empty-state.ejs
├── dashboard/
│   └── index.ejs
├── venues/
│   ├── index.ejs
│   ├── show.ejs
│   ├── create.ejs
│   └── edit.ejs
└── event-bookings/
    ├── index.ejs
    ├── show.ejs
    ├── create.ejs
    └── edit.ejs
```

Partial yang paling penting dibuat:

| Partial | Fungsi |
|---|---|
| `sidebar.ejs` | Navigasi utama |
| `navbar.ejs` | Topbar admin |
| `flash.ejs` | Success/error message |
| `status-badge.ejs` | Badge status reusable |
| `empty-state.ejs` | Tampilan ketika data kosong |

---

## 29. Wireframe Dashboard

Wireframe sederhana dashboard:

```txt
┌───────────────────────┬────────────────────────────────────────────────────┐
│ VenueControl          │ Search                                Admin Profile │
│                       ├────────────────────────────────────────────────────┤
│ [Dashboard]           │ Home > Dashboard                  [This Month v]    │
│ [Venues]              │                                                    │
│ [Event Bookings]      │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ [API Docs]            │ │TotalVenue│ │Bookings  │ │Confirmed │ │Pending │ │
│                       │ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│                       │                                                    │
│                       │ ┌──────────────────────────────┐ ┌──────────────┐ │
│                       │ │ Booking Trend Chart           │ │ Overview     │ │
│                       │ │                              │ │ Progress Bar │ │
│                       │ └──────────────────────────────┘ └──────────────┘ │
│                       │                                                    │
│                       │ ┌────────────────────────────────────────────────┐ │
│                       │ │ Recent Booking Table                           │ │
│                       │ └────────────────────────────────────────────────┘ │
└───────────────────────┴────────────────────────────────────────────────────┘
```

---

## 30. Dashboard Data Mapping

Data dari `DashboardService.getStats()` dapat dipetakan ke UI seperti berikut:

| Data Service | Komponen UI | Keterangan |
|---|---|---|
| `totalVenues` | Statistic Card 1 | Total venue terdaftar |
| `totalBookings` | Statistic Card 2 | Total semua booking |
| `confirmed` | Statistic Card 3 | Booking confirmed |
| `pending` | Statistic Card 4 | Booking pending |
| `cancelled` | Overview progress | Booking cancelled |
| `available` | Overview progress | Venue available |
| `maintenance` | Overview progress | Venue maintenance |

Tambahan data yang bagus untuk dashboard:

| Data Tambahan | Sumber | Keterangan |
|---|---|---|
| Recent bookings | `eventBooking.findMany({ take: 5 })` | Tabel aktivitas terbaru |
| Upcoming bookings | Filter `eventDate >= today` | Event terdekat |
| Unpaid bookings | Count payment status unpaid | Pembayaran belum selesai |

---

## 31. Naming dan Copywriting UI

Gunakan istilah yang konsisten di seluruh aplikasi.

| Konsep | Label UI |
|---|---|
| Venue | Venue |
| EventBooking | Event Booking |
| bookingStatus pending | Pending |
| bookingStatus confirmed | Confirmed |
| bookingStatus cancelled | Cancelled |
| paymentStatus unpaid | Unpaid |
| paymentStatus paid | Paid |
| paymentStatus refunded | Refunded |
| Create Venue | Add Venue |
| Create Booking | Add Booking |
| Detail | View Details |

Contoh subtitle:

```txt
Dashboard
Monitor venue availability, booking activity, and payment status.

Venues
Manage venue data, capacity, location, facilities, and operational status.

Event Bookings
Track event schedules, organizer details, booking status, and payment progress.
```

---

## 32. Implementation Priority

Urutan implementasi UI yang disarankan:

1. Buat `main.ejs` layout utama.
2. Buat `sidebar.ejs` sesuai style referensi.
3. Buat `navbar.ejs` dengan search dan admin profile.
4. Buat dashboard statistic cards.
5. Buat chart card dan overview panel.
6. Buat recent booking table.
7. Samakan style tabel untuk venue dan booking list.
8. Samakan style form create/edit.
9. Tambahkan badge status reusable.
10. Tambahkan flash message success/error.
11. Rapikan responsive mobile/tablet.

---

## 33. UI Checklist Sebelum Demo

Gunakan checklist ini sebelum project direkam untuk video demo.

- [ ] Sidebar aktif sesuai halaman yang sedang dibuka.
- [ ] Topbar tampil rapi di semua halaman.
- [ ] Dashboard statistic card sudah mengambil data asli dari backend.
- [ ] Tabel recent booking menampilkan data booking terbaru.
- [ ] Badge status venue, booking, dan payment tampil dengan warna berbeda.
- [ ] Form create/edit venue rapi dan mudah dibaca.
- [ ] Form create/edit booking rapi dan dropdown venue berjalan.
- [ ] Flash message muncul setelah create, update, delete, dan error.
- [ ] Empty state muncul jika data kosong.
- [ ] Tombol action view/edit/delete konsisten di venue dan booking.
- [ ] Tampilan tidak pecah di ukuran layar laptop.
- [ ] Table tetap bisa dibaca saat data panjang.
- [ ] Warna dan radius konsisten seperti referensi dashboard.

---

## 34. Kesimpulan Desain

Desain dashboard Smart Venue & Event Booking Management diarahkan menjadi admin panel modern dengan gaya clean, soft, dan profesional. Visual utamanya mengadaptasi dashboard referensi: sidebar putih, topbar minimal, background abu kebiruan, statistic cards gradient, chart card, overview panel, dan activity table.

Untuk kebutuhan project fullstack NestJS MVC dengan EJS + Tailwind CSS, desain ini cukup realistis untuk diimplementasikan tanpa terlalu banyak dependency tambahan. Fokus utama UI adalah membantu admin memantau venue, booking, status booking, status pembayaran, serta aktivitas terbaru secara cepat dan jelas.
