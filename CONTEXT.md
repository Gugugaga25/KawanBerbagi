# Project Context: Platform Donasi Demand-Driven

## 1. Project Overview
Aplikasi ini adalah platform donasi berbasis *demand-driven* (Pasar Terbalik) yang bertujuan mencegah *oversupply* barang di panti asuhan. Alih-alih donatur mengirim barang secara acak, panti asuhan akan merilis daftar kebutuhan spesifik beserta kuotanya, dan donatur dapat memenuhi kebutuhan tersebut. 

Pengembangan dibagi menjadi dua fase utama. Fase saat ini berfokus pada fungsionalitas inti (CRUD, Manajemen User, dan Pencocokan Berbasis Lokasi GPS). Fitur Artificial Intelligence (AI) ditangguhkan ke fase berikutnya.

## 2. Tech Stack & Architecture (MVP Phase)
* **Backend:** Laravel. Digunakan untuk RESTful API, logika kuota transaksional (mencegah *race condition* saat donatur *checkout*), dan kalkulasi radius jarak terdekat.
* **Frontend:** React dengan TypeScript. Digunakan untuk *dashboard* interaktif panti, antarmuka donatur, dan panel admin.
* **Database:** Relational Database (MySQL/PostgreSQL) dengan kapabilitas *spatial query* untuk pencarian lokasi.

## 3. Core Actors & Workflows

### A. Administrator (Manajemen Sistem & Keamanan)
* **Verifikasi Panti Asuhan:** Admin bertugas memeriksa dan memvalidasi pendaftaran panti asuhan beserta dokumen legalitasnya untuk memastikan panti tersebut valid dan mencegah entitas fiktif.
* **Manajemen Pengguna:** Melakukan operasi CRUD (Create, Read, Update, Delete) untuk entitas Panti Asuhan dan Donatur.
* **Manajemen Permintaan (Campaign):** Mengawasi, mengedit, atau menghapus permintaan barang dari panti asuhan jika terdapat pelanggaran atau ketidaksesuaian.
* **Monitoring:** Memantau seluruh arus data platform secara general.

### B. Panti Asuhan / Yayasan (Penerima Manfaat)
* **Registrasi & Legalitas:** Mengunggah dokumen legalitas untuk proses verifikasi oleh Admin.
* **Manajemen Permintaan (Wishlist):** Membuat daftar kebutuhan barang spesifik beserta jumlah/kuota yang dibutuhkan (misal: "Beras 50kg" atau "Buku Tulis 20 lusin").
* **Pembaruan Status:** Memperbarui status ketersediaan barang.

### C. Donatur (Penyumbang)
* **Discovery Berbasis Lokasi:** Sistem akan meminta izin akses lokasi (*Geolocation*) dari *device* donatur. Sistem kemudian menampilkan daftar permintaan dari panti asuhan yang berada di radius terdekat dari lokasi donatur tersebut.
* **Pemenuhan Kebutuhan (Pledge/Checkout):** Donatur dapat melihat *wishlist* panti, lalu mengajukan donasi barang sesuai dengan kuantitas yang ingin mereka berikan. 
* **Penguncian Kuota:** Saat donatur melakukan *checkout*, sistem akan mengunci kuota barang sementara agar tidak terjadi kelebihan pasokan dari donatur lain.

## 4. Development Guidelines & Priorities
* **Prioritas Pertama:** Selesaikan skema *database*, autentikasi, dan otorisasi *Role-Based Access Control* (RBAC) untuk Admin, Panti, dan Donatur.
* **Prioritas Kedua:** Bangun alur verifikasi Panti oleh Admin.
* **Prioritas Ketiga:** Bangun logika kalkulasi radius (menggunakan *Haversine formula* atau DB Spatial) untuk menampilkan panti terdekat di antarmuka Donatur.
* **Prioritas Keempat:** Terapkan *Pessimistic Database Locking* di Laravel saat donatur melakukan *checkout* donasi untuk memastikan integritas kuota.

## 5. Future Roadmap (Deferred AI & Analytics Phase)
Fitur-fitur berikut sudah ada dalam desain sistem namun **ditangguhkan** pembuatannya hingga core MVP stabil:
* AI Matchmaker Chatbot (NLP API).
* Automated Visual Assessment menggunakan Computer Vision (AI Vision) untuk cek kelayakan barang otomatis.
* Analisis prediktif berbasis R Language untuk mengetahui kapan pasokan panti akan habis.
* AI Generative Thank You letters.

## 6. Technical Conventions & Architecture

### A. Architecture & Separation of Concerns
* [cite_start]**API-Based Backend:** Backend (Laravel) harus sepenuhnya berbasis API dan terpisah dari *client* (Frontend)[cite: 172].
* [cite_start]**Clean API Design:** Desain API harus bersih dan memiliki pemisahan fokus (*separation of concerns*) yang jelas[cite: 674]. Semua interaksi dari Frontend ke Backend dilakukan melalui *endpoint* RESTful.

### B. Security & Data Integrity (Sangat Penting)
* [cite_start]**SQL Injection Prevention:** Wajib menggunakan *parameterized queries*, API ORM yang aman (seperti Eloquent di Laravel), atau metode akses database yang terbukti aman[cite: 594].
* [cite_start]**XSS Prevention:** Semua konten yang dibuat atau diinput oleh pengguna (*user-generated content*) wajib di- *escape* atau disanitasi sebelum di- *render* di Frontend (React)[cite: 595].
* [cite_start]**Strict Validation:** Wajib memvalidasi semua *field* yang dibutuhkan sebelum menyimpan data (seperti email, kuantitas, dll)[cite: 596]. [cite_start]Tolak input yang tidak valid atau berbahaya dengan pesan *error* yang jelas[cite: 597].

### C. Authentication & Role-Based Access Control (RBAC)
* [cite_start]**Server-Side Verification:** Backend **tidak boleh** mempercayai informasi *role* hanya karena muncul di UI Frontend[cite: 610]. [cite_start]Otorisasi untuk tindakan Admin, Panti, maupun Donatur harus selalu diverifikasi di sisi server (Server-Side) berdasarkan sesi atau *token* yang aktif[cite: 607].
* [cite_start]**Resource Isolation:** Cegah pengguna mengakses atau memodifikasi *resource* milik pengguna lain[cite: 608]. (Contoh: Donatur A tidak bisa mengubah donasi Donatur B; Panti A tidak bisa mengedit *wishlist* Panti B).
* [cite_start]**Protected Endpoints:** Pastikan *endpoint* atau halaman yang diproteksi tidak bisa diakses hanya dengan memanipulasi *routing* di Frontend secara manual[cite: 606]. [cite_start]Admin-only endpoints dilarang keras dapat diakses oleh user non-admin[cite: 614].

### D. Documentation & Deployment Standards
* [cite_start]**API Documentation:** Setiap *endpoint* yang dibuat harus didokumentasikan menggunakan format yang jelas seperti Swagger/OpenAPI atau koleksi Postman[cite: 618].
* [cite_start]**Seed Data:** Wajib menyediakan *seed data* (data awal) atau akun demo untuk peran Admin, Panti, dan Donatur untuk mempermudah pengujian[cite: 619].
* **Version Control:** Lakukan *commit* Git secara bertahap (step-by-step) seiring berjalannya progres. [cite_start]Dilarang menggabungkan semua perubahan ke dalam satu *commit* besar (squash)[cite: 691, 692].