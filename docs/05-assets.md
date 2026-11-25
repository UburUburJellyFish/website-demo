# 05 · Aset

Semua aset diambil dari repo app (`/Users/aaron/Documents/App/C5-M01-UburUbur`). Repo app **tidak diubah**,
file hanya disalin ke `claire-website/public/images/`.

Aturan:
- Screenshot hanya dari rekaman dengan **data contoh** (nama "Sticky"), bukan data kesehatan asli.
- Gambar besar dikecilkan dulu. Screenshot max lebar 900px, maskot max 800px.
- Format web: **WebP** (kualitas 82). `sips` di Mac tidak bisa menulis WebP dan ffmpeg di Mac ini tidak punya
  encoder WebP, jadi konversi memakai skrip `scripts/optimize-images.mjs` dengan `sharp` (devDependency).
- Tidak memakai gambar perangkat Apple, SF Symbols, atau logo pihak lain.

## Yang sudah ada (dari setup awal)

| File | Asal |
|---|---|
| `public/images/claire-wordmark.webp` (2000×1067, transparan) | `Demo-Video/logo/Claire-wordmark.webp` |
| `public/images/claire-star.png` (512×512) | `Demo-Video/logo/AppIcon.icon/Assets/bintang miring.png` |
| `src/app/icon.png` | sama dengan `claire-star.png` |
| `src/app/fonts/Astonpoliz.ttf` | `Demo-Video/fonts/Astonpoliz.ttf` |

Di phase 1 file-file ini dipindah ke `public/images/brand/`.

## Brand dan maskot → `public/images/brand/`

| File tujuan | Asal (di repo app) | Ukuran asli | Ukuran web | Dipakai di |
|---|---|---|---|---|
| `claire-wordmark.webp` | `Demo-Video/logo/Claire-wordmark.webp` | 2000×1067 | 1200 lebar | `intro`, OG image |
| `claire-icon.webp` | `Demo-Video/logo/AppIcon.icon/Assets/bintang miring.png` | 4267² | 512² | header, favicon |
| `claire-star-main.webp` | `C5-M01-UburUbur/Assets.xcassets/BINTANG UTAMA.imageset/BINTANG UTAMA.png` | 4500² | 800² | `meet`, `cta` |
| `claire-star-widget.webp` | `C5-M01-UburUbur/Assets.xcassets/WidgetBintang.imageset/WidgetBintang.png` | 668² | 400² | `connect` |
| `claire-star-animated.gif` (opsional) | `C5-M01-UburUbur/Resources/BintangHome.gif` | – | cek ukuran file, max 600 KB | `meet` kalau mau bintang bergerak |

## Ikon perasaan → `public/images/feelings/`

Dari `C5-M01-UburUbur/Assets.xcassets/` (4500², dikecilkan ke 256²):

| File tujuan | Asal |
|---|---|
| `sleep-good.webp` | `GoodSleep.imageset/It was good!.png` |
| `sleep-okay.webp` | `OkaySleep.imageset/OK I guess.png` |
| `sleep-bad.webp` | `BadSleep.imageset/it was bad.png` |
| `mood-calm.webp` | `Calm.imageset/Calm.png` |
| `mood-thrilled.webp` | `Thrilled.imageset/Thrilled.png` |
| `mood-exhausted.webp` | `Exhausted.imageset/Exhausted.png` |
| `mood-frustrated.webp` | `Frustated.imageset/Frustrated.png` |

Dipakai di kartu History (fitur grid) dan dekorasi scene `history`.

## Screenshot app → `public/images/screens/`

Semua rekaman ada di `Demo-Video/recordings/`, ukuran 1206×2622 (iPhone, portrait), data contoh.
Frame dipilih di phase 1 dari lembar kontak (satu frame per detik).

| File tujuan | Rekaman | Detik | Isi | Ditutup (warna latar) |
|---|---|---|---|---|
| `onboarding.webp` | REC-01 | 9,3 | Langkah Glucose Range (180 / 100–130 / 70) | – |
| `home.webp` | REC-02 | 4,3 | "Rise and shine, Sticky!", Last Glucose 168, Last Insulin 4 u, kartu highlight | – |
| `home-basal.webp` | REC-12 | 0,5 | "How was your sleep last night?" dengan 3 wajah | – |
| `voice.webp` | REC-03 | 3,3 | "Hi, Sticky!", Claire bertanya mau log apa | – |
| `meal.webp` | REC-04 | 9,3 | Nasi goreng telur ceplok + daftar bahan (nama saja, app tidak menampilkan gram) | label debug "AI · 17,9 s" |
| `glucose.webp` | REC-05 | 4,3 | Sheet Glucose 205 dengan catatan insulin masih bekerja | – |
| `insulin.webp` | REC-06 | 3,3 | Alert "Insulin Dose Still Active" | – |
| `activity.webp` | REC-07 | 4,0 | Walking, 30min, effort Moderate | – |
| `history.webp` | REC-16 | 0,5 | Timeline 23 November | – |
| `summary.webp` | REC-11 | 1,3 | Summary: range 62–228, grafik, Daily Average | badge "Mock data" |
| `tips-low.webp` | REC-13 | 7,5 | Glukosa 62 Low + "Low blood glucose!" saran camilan | – |
| `tips-high.webp` | REC-13 | 9,5 | "Meal recorded!" + ajakan jalan 15 menit | – |
| `glucometer.webp` | REC-09 | 3,3 | Sheet Connect: glukometer yang didukung + langkah | "This device doesn't support Bluetooth glucometers." (pesan Simulator) |
| `reminders.webp` | REC-09 | 0,3 | Profile: insulin, Reminders Smart timing, Glucose Range, Apple Health | – |
| `widget.webp` | REC-15 | 0,5 | Home Screen dengan widget Claire | – |

Semua 900×1957 WebP. Area yang ditutup diatur di `cover` pada job-nya di `scripts/optimize-images.mjs`
(koordinat piksel sumber 1206×2622 + titik contoh warna latar).

Catatan pemilihan:
- Summary diambil dari REC-11 (Simulator, nama Sticky) dan badge "Mock data" ditutup. REC-14 tidak dipakai karena
  menyapa "Hey Vey!" dan status bar-nya beda dari rekaman lain. Angkanya sama persis dengan data contoh.
- REC-03 (voice) berhenti di layar "Hi, Sticky!" karena speech recognition di Simulator gagal.
  Rekam ulang dari iPhone asli kalau mau layar dengan jawaban Claire.
- Widget Lock Screen belum ada rekamannya.
- REC-15 detik 3–4 menampilkan "Rise and shine, Mock!" (nama contoh lain), jangan dipakai.

### Perintah mengambil frame

Frame diambil dalam resolusi penuh ke `assets-src/screens/` (PNG), lalu dikonversi oleh skrip:

```bash
mkdir -p assets-src/screens
```

```bash
ffmpeg -ss 4.3 -i "/Users/aaron/Documents/App/C5-M01-UburUbur/Demo-Video/recordings/REC-02.mov" -frames:v 1 assets-src/screens/home.png
```

Ulangi untuk tiap baris tabel (ganti detik, nama rekaman, dan nama file), lalu `npm run images`.
`assets-src/` masuk `.gitignore`. Hanya hasil WebP di `public/` yang di-commit.

## QR → `public/images/qr/`

| File tujuan | Asal | Ukuran |
|---|---|---|
| `claire-qr.webp` | `QR-TestFlight/Claire-QR-3-Peek.png` | 1200×1600 → 600 lebar |

Pakai versi **Peek** (sama dengan penutup video). Kualitas WebP 92. Sudah dicek dengan Vision macOS: terbaca,
isinya `https://testflight.apple.com/join/utWcPjDc` (sama dengan QR Cream).

## Bezel iPhone → `public/images/device/`

| File | Asal | Ukuran | Dipakai di |
|---|---|---|---|
| `iphone-bezel.webp` | Bezel resmi Apple, diberikan Aaron di chat (phase 7) | 978×2000, 31 KB, layar transparan | `ui/PhoneFrame` (semua HP) |

Disalin **apa adanya**, tidak lewat `optimize-images.mjs` (aturan Apple: gambar produk tidak boleh diubah). Area
layar diukur dari kanal alpha: 874×1900 di (52, 50), sudut ±140 px.

## Gambar pratinjau link → `src/app/`

`opengraph-image.png` dan `twitter-image.png` (1200×630, 61 KB) + `*.alt.txt`, dibuat oleh `npm run og`
(`scripts/make-og-image.mjs`): wordmark di gradasi panggung dengan bintang kecil dan garis bingkai, warna AppColor
saja. `icon.png` (favicon) dikecilkan ke 256×256 palet (8 KB).

## Video (opsional)

`Demo-Video/Claire-Promo.mp4` (1920×1080, 92 detik, 13 MB). Kalau mau ditaruh di website (misalnya di bawah About):
- kompres ke sekitar 4–6 MB (H.264, 1280×720),
- `preload="none"`, ada `poster`, tidak autoplay dengan suara,
- taruh di `public/video/claire-promo.mp4`.

Keputusan memakai video ada di phase 7. **Belum diputuskan** (phase 7 selesai tanpa video): tanya Aaron dulu.

## Skrip konversi `scripts/optimize-images.mjs`

Dibuat di phase 1. Spesifikasinya:

- Input: daftar `{ from, to, width }` di dalam skrip (sesuai tabel di atas).
- `from` boleh path absolut ke repo app atau ke `assets-src/`.
- Output: WebP kualitas 82 ke `public/images/...`, lebar sesuai `width`, tinggi otomatis.
- Melewati file yang sudah ada dan lebih baru dari sumbernya.
- Mencetak ukuran sebelum dan sesudah.
- Dijalankan dengan:

```bash
npm run images
```

(`"images": "node scripts/optimize-images.mjs"` di `package.json`, `sharp` di `devDependencies`.)

Setelah dikonversi, ukuran dan alt ada di `src/content/screens.ts` (screenshot) dan `src/content/images.ts`
(brand, perasaan, QR).

## Alt text screenshot

Ada di `src/content/screens.ts` (disesuaikan dengan isi screenshot yang benar-benar dipakai).
Alt untuk brand, perasaan, dan QR ada di `src/content/images.ts`.

