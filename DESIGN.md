# DESIGN.md — KawanBerbagi Design System

Dokumen ini merangkum design system yang digunakan pada platform **KawanBerbagi** ("Arsip Kebaikan"), diekstrak dari dua halaman referensi: Landing Page dan Halaman Detail Kampanye Donasi.

---

## 1. Filosofi Desain

**"Structured Transparency in Giving"** — desain mengusung konsep *editorial-brutalist / bento grid* dengan garis border tegas, sudut siku (tanpa rounded corner kecuali elemen pill/full), dan tipografi besar yang kuat. Kesan yang dibangun: **rapi, akuntabel, dan terukur** — cocok untuk platform yang menonjolkan audit trail dan transparansi donasi.

Karakteristik utama:
- Grid berbasis **bento box**: setiap modul dibatasi border solid, menciptakan struktur seperti arsip/dokumen.
- Kontras tinggi antara foto grayscale/duotone dan blok warna solid.
- Data (angka, statistik, progress) ditonjolkan sebagai elemen visual utama, bukan hanya teks pendukung.

---

## 2. Warna (Color Tokens)

### Palet Warna Utama (Indigo & Blue Theme)
| Token | Hex | Nama Warna | Penggunaan System |
|---|---|---|---|
| `primary` / `navy` | `#293681` | Deep Indigo | Teks Judul Utama, Header, & Wordmark Brand |
| `btn-primary` / `teal` | `#4274D9` | Vibrant Electric Blue | Tombol CTA Utama, Progress Bar, & Element Aktif |
| `secondary` / `sky` | `#95CCDD` | Soft Sky Blue | State Hover, Border Aksen, & Sub-element |
| `bg-card` / `mist` | `#D0E7E6` | Pale Ice Mist | Latar Belakang Kartu Terang, Badge, & Surface |
| `background` / `cream` | `#F8FAFC` | Clean Light Canvas | Latar Belakang Utama Body & Halaman |
| `accent-gold` | `#F59E0B` | Warm Amber Gold | Penanda Status Mendesak, Tag, & Rating |

### Prinsip Warna
- **Royal & Trustworthy**: Kombinasi **Deep Indigo (`#293681`)** dan **Vibrant Electric Blue (`#4274D9`)** membangun kesan modern, profesional, dan tepercaya untuk platform berbagi.
- **Light & Refreshing**: Latar belakang kartu bernuansa **Pale Ice Mist (`#D0E7E6`)** memberikan atmosfer bersih, tenang, dan segar.
- **High Legibility**: Teks judul dan deskripsi bertinta **Deep Indigo (`#293681`)** menjamin keterbacaan yang tajam di atas surface terang.

---

## 3. Tipografi

Font: **Inter** (400, 600, 700, 800, 900) + **Material Symbols Outlined** untuk ikon.

| Token | Size / Line-height | Weight | Penggunaan |
|---|---|---|---|
| `display-h1` | 64px / 1.1, letter-spacing -0.02em | 800 | Judul hero (desktop) |
| `display-h1-mobile` | 40px / 1.1 | 800 | Judul hero (mobile), angka statistik besar |
| `headline-md` | 32px / 1.2 | 700 | Judul section, judul kartu |
| `body-main` | 16px / 1.5 | 400 | Paragraf deskripsi |
| `body-data` | 14px / 1.4 | 400 | Data pendukung, caption, list item |
| `overline-tags` | 12px / 16px, letter-spacing 0.1em | 700 | Label kategori/status (uppercase) |
| `label-button` | 14px / 20px | 600 | Teks tombol |

**Aturan:** Judul besar (`display-h1`) sering menggunakan `uppercase` untuk kesan tegas/institusional. Overline tags selalu uppercase dan berjarak huruf lebar (tracking wide).

---

## 4. Grid & Spacing

| Token | Nilai | Fungsi |
|---|---|---|
| `grid-margin` | 2rem | Padding horizontal section/navbar |
| `module-padding` | 1.5rem | Padding internal tiap kartu/modul bento |
| `stack-gap` | 1rem | Jarak antar elemen vertikal |
| `grid-gutter` | 0px | **Tidak ada gap antar kolom** — border yang memisahkan modul |

**Pola Bento Grid:**
```
grid grid-cols-1 md:grid-cols-12
border-t border-l border-border-dark   <!-- wrapper -->
```
Setiap child module: `border-r border-b border-border-dark` → menghasilkan garis grid penuh tanpa celah (seperti tabel/arsip dokumen).

Kombinasi kolom umum: `md:col-span-8` + `md:col-span-4`, atau `md:col-span-4` × 3 untuk grid 3-kolom.

---

## 5. Border Radius

```js
borderRadius: {
  DEFAULT: "0px",
  lg: "0px",
  xl: "0px",
  full: "9999px"   // hanya untuk elemen pill/dot (mis. status indicator)
}
```
→ **Sudut selalu siku (0px)**, kecuali elemen kecil seperti dot status (`rounded-full`).

---

## 6. Komponen Utama

### 6.1 Navbar
- Height tetap `h-16`, sticky top, `border-b border-border-dark`.
- Logo wordmark bold (`font-black`), link nav dengan underline/warna aktif, tombol CTA solid kanan.

### 6.2 Kartu Kebutuhan (Need Card)
- Border penuh di 4 sisi (via wrapper grid).
- Header: label kategori (badge outline + ochre text) + icon Material Symbols.
- Body: checklist item kebutuhan (`check_circle` terisi vs `radio_button_unchecked` kosong, dengan opacity 50% untuk item belum terpenuhi).
- Footer: progress bar flat (`flat-progress-track` = teal 20% opacity, fill = `btn-primary`) + label hari tersisa + tombol CTA full-width.

### 6.3 Progress Bar
```html
<div class="w-full h-3 flat-progress-track">
  <div class="h-full bg-btn-primary" style="width: XX%"></div>
</div>
```
Tanpa rounded, tinggi tipis (`h-3` untuk card, `h-8` untuk hero progress di halaman detail).

### 6.4 Tombol (Buttons)
- **Primary/Solid:** `bg-btn-primary text-on-primary`, hover → `bg-border-dark`.
- **Outline:** `border border-border-dark`, hover → `bg-surface-variant`.
- **Filter Pill (tab):** solid untuk state aktif, transparent+border untuk inactive.
- Micro-interaction: `scale(0.98)` saat mousedown (lihat script di landing page).

### 6.5 Live Ledger / Donor Table
- List donor horizontal scrollable (`overflow-x-auto`), tiap entry adalah kolom ber-border dengan background selang-seling (`surface-container-low` / `white`) — pola zebra ala arsip data.

### 6.6 Image Module
- Selalu diberi treatment `grayscale contrast-125` (kadang `brightness-75`), dengan caption/tag kecil di pojok (`FACILITY ARCHIVE: 2024-B`) untuk kesan dokumentasi/arsip resmi.

---

## 7. Ikonografi
- **Material Symbols Outlined**, variable font (`FILL`, `wght`, `GRAD`, `opsz`).
- Default: `FILL 0, wght 400`.
- Status "selesai/terpenuhi": `FILL 1` (solid) untuk penekanan.

---

## 8. Nada Konten (Copy Tone)
- Bahasa Indonesia formal-informatif untuk landing/kampanye (mis. "Update terakhir: Hari ini, 09:00 WIB").
- Istilah bernuansa "audit/data": *Archive Status*, *Verified by Social Services Audit*, *Live Ledger*, *Progress*, *Funding Progress* — menegaskan kesan transparansi dan akuntabilitas terukur.

---

## 9. Ringkasan Prinsip Desain
1. **No rounded corners** — kecuali dot/pill kecil.
2. **Border sebagai pengganti gap** — grid tanpa jarak, dipisah garis solid.
3. **Data-first visual hierarchy** — angka/statistik selalu besar dan bold.
4. **Grayscale photography** dengan hover-reveal warna untuk elemen interaktif.
5. **Overline tags uppercase** sebagai penanda kategori/status di semua konteks.
6. **Konsistensi biru-teal gelap + krem hangat** sebagai identitas warna brand.