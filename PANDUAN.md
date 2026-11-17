# Panduan Website Katalog Mitra Riau Bangunan

## 1. Cara memasang
1. Buka folder website Anda yang sekarang (yang berisi folder `Vellino`, `Magia`, `cat`, dst).
2. Salin 5 file dari zip ini ke folder itu, timpa yang lama:
   `index.html`, `style.css`, `script.js`, `products.js`, `PANDUAN.md`
3. Folder foto dan `logo.png` JANGAN diubah. Buka `index.html` di browser.
4. Upload ke GitHub seperti biasa (`git add .`, `git commit`, `git push`).

## 2. Peran tiap file
| File | Isi | Sering diedit? |
|---|---|---|
| `products.js` | Data toko, kategori, semua produk | **Ya** |
| `index.html` | Susunan halaman & teks (hero, tentang, lokasi) | Kadang |
| `style.css` | Warna, font, ukuran, tata letak | Kadang |
| `script.js` | Mesin: filter, pencarian, popup, WhatsApp | Jarang |

## 3. Menambah produk
Satu baris = satu produk. Cara:
1. Taruh foto di folder yang sesuai (misal `Kobin/Nama Motif.jpg`).
2. Buka `products.js`, cari produk yang mirip (Ctrl+F), salin SATU barisnya.
3. Tempel tepat di bawahnya, lalu ubah hanya tulisan di dalam tanda kutip.
4. Simpan (Ctrl+S), buka index.html, tekan Ctrl+F5.

Contoh baris dan artinya (juga ada di dalam products.js sebagai komentar):
```
{ brand: "KOBIN",                      // merek
  name: "BORGHINI GRIGIO",             // nama produk / motif
  category: "Keramik & Granit",        // harus sama persis dengan nama kategori di CONFIG
  size: "60x60",                       // ukuran (kosongkan "" jika bukan keramik)
  surface: "glossy",                   // glossy | matt | anti-slip (kosongkan jika bukan keramik)
  image: "Kobin/Borghini Grigio.jpg",  // folder/nama-file.jpg (huruf besar-kecil harus sama)
  description: "60 x 60 cm • Glossy" },// keterangan singkat
```
Opsional: `sizes: ["1 Inch","2 Inch"]` (pilihan ukuran) dan `color: ["Merah","Biru"]` (pilihan warna).
Belum punya foto? Isi `image: ""`, nanti tampil "Foto segera hadir". Kolom id tidak perlu ditulis.
Merek baru: cukup tulis baris baru dengan brand baru; otomatis muncul di bagian Merek dan filter.

## 4. Mengubah foto
- Ganti isi file foto dengan nama yang sama, atau ubah `image:"..."` di `products.js`.
- Foto hero (latar besar di atas): taruh `foto-hero.jpg`, lalu di `style.css` buka komentar baris `--hero-foto`.
- Foto toko di bagian Tentang: taruh `foto-toko.jpg` di folder utama.
- Saran foto: persegi, lebar 800 px, ukuran di bawah 200 KB (kompres di squoosh.app). Foto besar membuat web lambat.

## 5. Mengubah deskripsi & teks
- Deskripsi produk: field `description` di `products.js`.
- Teks hero, Tentang Kami, footer: langsung di `index.html`, cari komentar `<!-- ============ ... -->`.
- Nama toko, WhatsApp, alamat, jam buka: bagian `CONFIG` paling atas `products.js`.
- Kalimat pesan WhatsApp otomatis: `script.js`, cari komentar "UBAH: kalimat pesan WhatsApp".

## 6. Mengubah tampilan / layout
Semua di `style.css`, mulai dari blok `:root` paling atas:
- Warna: `--aksen` (tombol), `--gelap` (navbar, hero), `--bg` (latar).
- Jumlah kolom produk: `--kolom-produk` (190px; kecilkan untuk kolom lebih banyak).
- Bentuk foto kartu: cari `.card img`, ubah `aspect-ratio:1/1` jadi `4/3`.
- Produk per halaman: `perPage` di `CONFIG`.
- Urutan bagian halaman: di `index.html`, pindahkan blok `<section>` ke atas/bawah.
- Menghapus bagian: hapus blok `<section>` dan menunya di `<nav>`.
- Menambah kategori: satu baris di `CONFIG.categories`.

## 7. Kesalahan yang sering terjadi
- **Foto tidak muncul:** nama file/folder tidak sama persis (huruf besar-kecil dibedakan di GitHub Pages). Hindari spasi ganda dan ekstensi `.Jpeg`; pakai `.jpg`.
- **Halaman kosong setelah edit `products.js`:** biasanya kurang/lebih tanda koma atau kurung. Buka Console browser (F12) untuk melihat baris yang salah.
- **Perubahan tidak terlihat:** tekan Ctrl+F5 (muat ulang paksa).
- Harga sengaja tidak ditampilkan. Harga dan stok dikonfirmasi lewat WhatsApp.

## 8. Yang masih perlu Anda isi
- Ukuran & permukaan produk **Platinum** dan **IKAD** (di `products.js`, sekarang kosong).
- `hours` (jam buka) di `CONFIG`.
- Foto: `Cat Kayu & Besi Kilap`, `foto-toko.jpg`, dan (opsional) `foto-hero.jpg`.
- Rename `Closet Jongkok Kia.Jpeg` jadi `.jpeg`, lalu sesuaikan path di `products.js`.
