# Tauri Desktop

Proyek ini menggunakan Tauri 2 untuk menjalankan aplikasi React sebagai aplikasi desktop Windows.

## Persiapan

Pasang Node.js, Rust dengan toolchain MSVC, Microsoft C++ Build Tools, dan WebView2 Runtime. Saat tersedia koneksi internet, instal dependensi frontend:

```sh
npm install
```

## Development dan build

```sh
npm run tauri:dev
npm run tauri:build
```

Perintah Tauri memakai `npx` dan mengunduh CLI saat pertama kali dijalankan. Plugin SQLite perlu diunduh oleh `npm install`, dan build pertama mengunduh crate Rust. Tahap persiapan awal ini perlu internet.

## Penggunaan offline

Setelah aplikasi desktop selesai dibuild, jalankan installer hasil build. Aplikasi tidak memerlukan koneksi internet untuk membuka katalog, mengelola stok, atau membuat pesanan. Katalog, pesanan, dan pengaturan stok disimpan dalam database SQLite `toko-pakaian.db` lokal milik aplikasi; browser tetap memakai `localStorage`. Data `localStorage` lama dibaca sebagai fallback saat database belum berisi data. Jika gambar produk online tidak bisa dimuat, aplikasi menampilkan gambar cadangan yang sudah dibundel.

Proyek ini belum memiliki backend atau sinkronisasi online; data tidak dibagikan antarperangkat.