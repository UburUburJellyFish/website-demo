# 02 · Parallax

Referensi: **http://davegamache.com/parallax/** (Dave Gamache). Website Claire memakai cara kerja yang sama,
tapi dengan warna, konten, dan aset Claire, dan dengan beberapa perbaikan.

> Kode referensi tidak disalin. Kita menulis mesin sendiri dengan cara kerja yang sama.

## 1. Apa yang terjadi di referensi

Halaman referensi hanya bisa dibuka di layar ≥ 1000px. Tingginya sekitar 12–13 layar. Urutannya:

| Scene | Yang terlihat | Gerakan saat di-scroll |
|---|---|---|
| Intro | Judul besar huruf kapital berjarak + byline, di tengah foto hutan gelap | Judul dan byline naik sambil memudar |
| Explosion | Teks kecil di kiri, grid 4×4 kotak putih di kanan | Teks dan grid naik dari bawah layar sambil muncul. Lalu 16 kotak "meledak": tiap kotak bergeser ke arah sendiri, membesar dengan skala berbeda, dan memudar. Teks lalu naik dan hilang |
| Images | Screenshot website desktop dan iPhone naik dari bawah | Keduanya naik dengan kecepatan berbeda (efek kedalaman). Lalu screenshot desktop mengecil dan hilang, iPhone **berputar −90°**, membesar, dan layarnya berganti isi. Lalu iPhone turun keluar layar |
| Links | Kalimat ajakan + tombol | Muncul sambil membesar dari 0,8 ke 1 |

Selama semua scene, latar foto **diam** (fixed), dengan **bingkai garis tipis** 10px dari tepi layar.

## 2. Cara kerjanya

1. **Satu timeline untuk seluruh halaman.** Timeline adalah daftar *keyframe*. Tiap keyframe punya:
   scene yang tampil, durasi (dalam % tinggi layar), dan daftar animasi.
2. **Tinggi halaman = jumlah semua durasi.** Scroll tidak menggerakkan konten. Konten selalu `fixed`.
   Posisi scroll hanya dipakai sebagai "jarum" timeline.
3. **Tiap animasi** menyebut elemen dan properti yang berubah: `translateX`, `translateY`, `scale`, `rotate`,
   `opacity`. Satu nilai berarti "dari nilai awal ke nilai ini", dua nilai berarti `[dari, ke]`.
   Nilai persen diubah ke piksel dari lebar atau tinggi layar.
4. **Progres keyframe** = `(scrollY − awal keyframe) / durasi`, lalu dihaluskan dengan easing kosinus
   `(1 − cos(π·t)) / 2`. Hasilnya ditulis ke `transform: translate3d(...) scale(...) rotate(...)` dan `opacity`.
5. **Keyframe kosong** (tanpa animasi) = jeda. Pengunjung tetap scroll tapi tampilan diam sebentar.
6. **Trik opacity:** nilai di luar 0–1 (misalnya `[0, 1.75]`) membuat fade terasa lebih cepat,
   karena browser memotongnya di 1.
7. Hanya scene milik keyframe aktif yang ditampilkan.

## 3. Yang kita ambil dan yang kita perbaiki

| Hal | Referensi | Claire |
|---|---|---|
| Timeline keyframe + durasi % layar | Ya | **Sama** |
| Properti x, y, scale, rotate, opacity | Ya | **Sama**, plus warna latar panggung |
| Easing kosinus | Ya | **Sama** |
| Latar diam + bingkai garis | Foto hutan + garis putih | Gradasi `home-background` → `home-cream` + garis `navy` 20% + lapisan bintang |
| Lebar layar | Gagal di < 1000px | Jalan di HP, tablet, desktop (timeline punya versi mobile) |
| Resize | Gagal, minta reload | Dihitung ulang, posisi scroll dijaga |
| Scroll cepat | Elemen bisa "tertinggal" di tengah animasi kalau satu keyframe terlewati | Tiap frame menghitung keadaan semua elemen dari seluruh timeline, jadi selalu tepat |
| Loop | `setInterval` 10ms + jQuery | Event `scroll` pasif + satu `requestAnimationFrame`, tanpa jQuery |
| Konten setelah parallax | Tidak ada | Panggung `sticky`, jadi setelah timeline selesai halaman lanjut scroll biasa (All features, About, Footer) |
| Nilai satu angka | Selalu dari nilai default | Dari nilai **terakhir** elemen itu di keyframe sebelumnya, jadi tidak perlu mengulang angka |
| Aksesibilitas | Tidak ada | `prefers-reduced-motion`, tanpa JS tetap terbaca, fokus keyboard pindah ke scene yang benar |
| Navigasi | Tidak ada | Link header lompat ke scene |

## 4. Spesifikasi mesin parallax

### File

```
src/lib/parallax/
  types.ts          tipe Timeline, Keyframe, Animation, Viewport
  math.ts           ease, lerp, lerpColor, toPx, clamp (fungsi murni)
  compile.ts        timeline → keyframe dengan piksel, awal tiap keyframe, total tinggi, daftar animasi per elemen
  state.ts          keadaan semua elemen pada posisi scroll tertentu (fungsi murni)
  useParallax.ts    hook client: event scroll/resize/fokus, menulis style ke DOM
src/components/parallax/
  ParallaxStage.tsx     wadah sticky + spacer + latar + bingkai (client component)
  ParallaxScene.tsx     satu scene (data-scene)
  ParallaxDebug.tsx     overlay debug (?px-debug)
  StageBackground.tsx   gradasi + lapisan warna + 3 lapis bintang + bingkai
src/components/ui/StarField.tsx   satu lapis bintang
src/components/scenes/ParallaxStory.tsx   client: ParallaxStage + timeline Claire
src/timeline/
  claire.ts          buildTimeline(viewport) untuk website Claire
```

### Tipe

```ts
// types.ts
export type Length = number | `${number}vw` | `${number}vh`; // angka = piksel
export type Range<T> = T | [T, T];

export type Animation = {
  target: string;            // nilai atribut data-px pada elemen
  x?: Range<Length>;
  y?: Range<Length>;
  scale?: Range<number>;
  rotate?: Range<number>;    // derajat
  opacity?: Range<number>;   // boleh di luar 0–1 untuk mempercepat fade
};

export type Keyframe = {
  scene: string;                              // id scene (data-scene) yang tampil
  duration: `${number}vh`;
  animations: Animation[];                    // [] = jeda
  background?: Range<ColorToken>;             // token AppColor, mis. ["home-cream", "voice-top"]
  tone?: "light" | "dark";                    // dark = teks dan header jadi home-cream
  anchor?: string;                            // id untuk navigasi, mis. "features"
};

export type Viewport = { width: number; height: number; isMobile: boolean }; // isMobile = width < 768
export type BuildTimeline = (viewport: Viewport) => Keyframe[];
```

`ColorToken` adalah union dari nama token di `01-design-system.md` (`"home-cream" | "voice-top" | ...`).
Nilai hex dibaca dari CSS variable saat mesin mulai, jadi warna tetap satu sumber.

### Cara pakai di komponen

```tsx
<ParallaxStage timeline={buildTimeline}>
  <ParallaxScene id="intro">
    <img data-px="wordmark" ... />
    <p data-px="tagline">...</p>
  </ParallaxScene>
  ...
</ParallaxStage>
```

Elemen yang dianimasikan cukup diberi `data-px="<nama>"`. Posisi awalnya diatur dengan CSS biasa
(Tailwind), mesin hanya menambah `transform` dan `opacity`.

### Algoritma

1. **Mulai (client):**
   baca viewport → `buildTimeline(viewport)` → `compile`: ubah `vh`/`vw` ke piksel, hitung awal tiap keyframe
   dan total durasi. Tinggi wadah = total durasi + 1 tinggi layar. Kumpulkan elemen `[data-px]`.
   Untuk tiap elemen, simpan daftar `(index keyframe, animasi)` yang menyentuhnya.
2. **Panggung sticky:** wadah setinggi timeline berisi satu `div` `position: sticky; top: 0; height: 100svh`.
   Semua scene `absolute` di dalamnya. Posisi timeline = `scrollY − offsetTop wadah`, dibatasi 0..total.
3. **Tiap scroll:** event `scroll` pasif hanya memasang satu `requestAnimationFrame` (pakai flag).
   Di dalam frame:
   - cari keyframe aktif `i` dan progres `t` (0–1), lalu `e = ease(t)`;
   - untuk tiap elemen: mulai dari nilai default (x 0, y 0, scale 1, rotate 0, opacity 1),
     lalu jalankan semua keyframe yang menyentuhnya sampai `i`. Keyframe sebelum `i` memakai nilai akhir,
     keyframe `i` memakai interpolasi `e`. Nilai tunggal = dari nilai terakhir ke nilai itu;
   - tulis `transform` dan `opacity` (opacity di-clamp 0–1) hanya kalau berubah;
   - latar panggung: interpolasi warna RGB dari `background` keyframe aktif
     (atau warna akhir keyframe terakhir yang punya `background`);
   - kalau scene aktif berganti: pasang `data-active` di scene itu, hapus dari yang lain;
     pasang `data-tone` di `<html>`.
4. **Resize:** debounce 150ms, hitung ulang semuanya, lalu kembalikan scroll ke keyframe dan progres yang sama.
   Di perangkat sentuh, abaikan perubahan **tinggi saja** di bawah 15% (address bar Safari muncul/hilang).
5. **Navigasi:** `scrollToAnchor(id)` lompat ke awal keyframe yang punya `anchor: id`.
   Link header memakai ini. Kalau halaman dibuka dengan `#hash`, lompat setelah mesin siap.
   Anchor yang bukan bagian timeline (`#about`, `#features` di bagian biasa) cukup scroll biasa.
6. **Fokus keyboard:** kalau `focusin` terjadi di dalam scene yang tidak aktif, lompat ke scene itu.
7. **Reduced motion dan tanpa JS:**
   - HTML hasil build menampilkan scene **bertumpuk biasa** (tiap scene `position: relative`, tinggi otomatis,
     elemen di posisi akhirnya). Ini juga yang dibaca mesin pencari.
   - Skrip kecil di `<head>` menambah class `px-on` ke `<html>` sebelum halaman digambar,
     kecuali `prefers-reduced-motion: reduce`. Mesin hanya jalan kalau ada `px-on`.
     Pasang `suppressHydrationWarning` di `<html>`. Cek cara resmi menaruh skrip di head di
     `node_modules/next/dist/docs/` sebelum menulisnya.
   - Kalau setelan reduced motion berubah saat halaman terbuka, mesin berhenti dan class dicabut.
8. **CSS dasar:**
   ```css
   .px-on [data-scene] { position: absolute; inset: 0; opacity: 0; pointer-events: none; }
   .px-on [data-scene][data-active] { opacity: 1; pointer-events: auto; }
   ```
   Scene yang tidak aktif tetap ada di pohon aksesibilitas (tidak `display: none`), jadi pembaca layar
   tetap bisa membaca semuanya berurutan.

### Aturan performa

- Hanya `transform` dan `opacity` yang berubah tiap frame. Tidak ada `top`/`left`/`width` yang dianimasikan.
- Tidak ada `setState` React per frame. Style ditulis langsung lewat ref.
- `will-change: transform, opacity` hanya untuk elemen di scene aktif.
- Semua gambar punya `width` dan `height`. Screenshot WebP, lebar maksimal 900px.
- Target: 60 fps di MacBook dan iPhone 12 ke atas. Cek dengan Performance panel.

### Debug

Buka `/?px-debug`. Overlay di pojok kanan bawah menampilkan: index keyframe, scene, progres %, scrollY,
total tinggi. Overlay ini hanya dirender kalau query itu ada.

### Seperti yang dibangun di phase 2

Hal yang berbeda dari rencana di atas, dan alasannya:

| Hal | Rencana | Yang dibangun | Kenapa |
|---|---|---|---|
| Skrip `px-on` | `next/script` / cara resmi | `<script>` inline biasa di `<head>` (`layout.tsx`) | `next/script` `beforeInteractive` ternyata diantrekan di akhir `<body>`, jadi halaman bertumpuk sempat berkedip |
| Kapan engine menyala | Kalau `<html>` punya `px-on` | Dari media query reduced motion; class hanya untuk paint pertama | React Strict Mode (dev) menjalankan effect dua kali; cleanup pertama menghapus class sehingga engine tidak menyala lagi |
| Header lompat ke scene | Context `scrollToAnchor` | `goToAnchor(id)` (event `px:goto`) + link `#hash` biasa (engine mendengar `hashchange`) | Header ada di luar panggung; event lebih sederhana daripada context |
| Penempatan elemen | CSS biasa | Variant Tailwind `px:` (hanya saat parallax jalan) dan `tone-dark:` (saat keyframe gelap) | Satu komponen bisa punya tata letak bertumpuk dan tata letak panggung |
| Warna latar | Token AppColor | Token AppColor + `"stage"` = tanpa lapisan warna (gradasi bawaan terlihat) | Supaya bisa kembali ke gradasi |
| Overlay debug | Dirender kalau ada `?px-debug` | Selalu dirender dengan `hidden`, engine yang menampilkannya | Tanpa state React dan tanpa beda HTML server/klien |
| Cerita Claire | `ParallaxStage timeline={buildTimeline}` di `page.tsx` | `scenes/ParallaxStory.tsx` (client) membawa timeline, scene masuk sebagai `children` | Fungsi tidak bisa dikirim dari Server Component ke Client Component |

Aturan nilai yang dipakai `state.ts`:
- Sebelum keyframe pertamanya, elemen diam di nilai `from` keyframe itu (`opacity: [0, 1]` di keyframe 4 = tersembunyi
  sampai keyframe 4).
- Satu nilai = dari nilai terakhir elemen itu ke nilai ini.
- Opacity yang diteruskan ke keyframe berikutnya di-clamp 0–1, jadi trik `[0, 1.75]` hanya mempercepat keyframe itu.
- `tone` berganti di tengah keyframe (saat latarnya sudah setengah jalan).

Aturan untuk scene (berlaku di phase 3–5):
- Elemen dengan `data-px` **dikuasai engine** untuk `transform` dan `opacity`. Jangan beri class `translate-*`, `scale-*`,
  `rotate-*`, `-translate-x-1/2`, atau `opacity-*` di elemen itu. Untuk menengahkan pakai margin negatif atau bungkus
  dengan elemen lain. Opacity dekorasi taruh di anak elemennya (lihat `StarField`).
- Tata letak panggung pakai `px:` (contoh `px:absolute px:top-[63%]`), tata letak bertumpuk tanpa awalan.
- Scene pertama diberi `initial` supaya paint pertama tidak kosong.

Hasil uji phase 2 (timeline tes, 1280×800 kecuali disebut lain):
- Scroll pelan dan lompat langsung ke akhir lalu kembali ke atas: semua nilai tepat (mis. `tile-1` di −10vw/−15vh, skala 2, op 0).
- Resize 1280×800 → 1024×700 di keyframe 3 progres 50%: tetap di keyframe 3 progres 50%.
- `/#story`, klik link header, dan `px:goto`: semuanya ke awal keyframe 2.
- Tab ke tombol di scene yang belum aktif: lompat ke akhir keyframe pertama scene itu.
- Tanpa JavaScript: scene bertumpuk, teks terbaca. Reduced motion (matchMedia dipalsukan): mati saat load, menyala saat
  dimatikan, mati lagi dengan bersih.
- Build produksi, scroll 24px per frame: median 8,3 ms/frame, maks 14 ms, 0 long task, 0 layout shift, console bersih.
- Mobile 375×812: jalan, tidak ada scroll horizontal.

### Seperti yang dibangun di phase 4

- Sebelum `log` ada satu keyframe `meet` (60vh) yang memudarkan `meet-text` dan `star`. Pergantian scene
  langsung menyembunyikan scene lama, jadi isi scene lama harus sudah hilang **di keyframe scene lama**.
- Urutan di kode (setelah 9 keyframe phase 3): meet keluar 60vh → voice 100vh → jeda 60vh → meal 100vh → jeda 60vh
  → glucose 100vh → insulin 100vh → activity 100vh → jeda 60vh. Total timeline sekarang 18 keyframe (±16,5 layar).
- Layar HP berganti dengan cara layar berikutnya muncul di atas layar sebelumnya (urutan DOM di `StagePhone`),
  jadi cukup `opacity: [0, 1]` pada layar baru.
- `voice-glow` ada di dalam elemen `phone` (di belakang frame, `isolate` + `-z-10`), jadi selalu ikut posisi HP.
- Deck membesar dengan `scale` 0.5 → 1 (bukan 0, karena scale tidak bisa memakai trik nilai negatif) dan muncul
  bergantian lewat opacity bertingkat. Deck yang sedang ditampilkan membesar ke 1.15.
- Posisi balon dan chip dihitung dari lebar HP panggung (`min(11rem,13vw,17.5svh)` = setengah lebar HP) dan posisi
  HP (20vw kanan dari tengah). Kalau `PhoneFrame` atau `x` HP diubah, ubah juga `LogScene.tsx`.
- Hasil uji (build produksi): 1280×800 dan 375×812 rapi, tanpa scroll horizontal; dark mode teks di latar navy
  `#FFFDF6`; lompat langsung ke akhir/awal tepat; reduced motion bertumpuk dengan 3 HP; median 8,3 ms/frame,
  0 long task, 0 layout shift.

### Seperti yang dibangun di phase 5

- Urutan di kode setelah phase 4: log keluar 50vh → tips 120vh → jeda 50 → tips keluar 50 → dose 100 → jeda 50 →
  dose keluar 50 → history 120 → insight 120 → jeda 50 → history keluar 50 → connect 120 → jeda 50 → connect keluar 50 →
  cta 80 → jeda akhir 80 (`anchor: "beta"` di jeda akhir, supaya `#beta` mendarat saat CTA sudah lengkap).
  Total 34 keyframe, ±28,5 layar. Durasi dipendekkan dari tabel di atas supaya tidak terlalu panjang.
- HP panggung: tips `x` 24vw (mobile turun 8vh, skala 0.82) → keluar ke bawah saat tips keluar → saat history keluar
  (di luar layar) pindah ke tengah dan ganti ke layar widget → naik lagi di connect → memudar saat connect keluar.
- Dinding History: wadah luar `data-px="wall"` (opacity), wadah dalam miring dengan class `-rotate-12` (tanpa
  `data-px`), kolom `wall-col-*` bergerak sepanjang sumbu miring. Kolom ke-3 disembunyikan di mobile.
- `wall-hero` bukan HP yang keluar dari dinding, tapi HP Summary terpisah di posisi HP panggung (20vw kanan) yang naik,
  berputar −12° → 0°, dan membesar. Harus ada **sebelum** balon di DOM, kalau tidak balon tertutup.
- CTA: semua teks `voice-bottom` eksplisit (warna warisan panggung jadi terang di dark mode). Kartu QR `on-dark`.
  Di mobile QR dan balon disembunyikan dan teksnya diganti `textMobile`. Di tablet blok teks dipersempit (19rem).
- Connect: di md+ chip `absolute` di kiri/kanan HP; di mobile wadahnya jadi grid 2×2 di atas HP dan chip hanya
  menampilkan judul (teks tetap ada untuk pembaca layar). Class dipisah per breakpoint (`md:px:contents`,
  `md:px:absolute`) supaya dua class `display`/`position` tidak berebut di satu elemen.
- Hasil uji (build produksi + dev server untuk tablet): 1280×800, 768×1024, 375×812 rapi tanpa scroll horizontal;
  dark mode (dose `#FFFDF6`, CTA `voice-bottom`); lompat ke akhir/awal tepat; Tab ke "Join the beta" dan `#beta`
  mendarat di CTA lengkap; reduced motion bertumpuk; median 8,3 ms/frame, maks 14 ms, 0 long task, 0 layout shift.

### Seperti yang dibangun di phase 6

- Header sekarang `fixed` (tinggi 4rem, `z-50`) di atas panggung. Elemen panggung di mobile yang dekat atas dipindah
  ke bawah header: label dan chip Connect (`4.75rem` / `6.75rem`), kartu teks History (`4.75rem`). Di 1280×800 dan
  768×1024 tidak ada teks yang diam di bawah header (hanya lewat sebentar saat masuk/keluar).
- Engine mendengar **klik** link `a[href^="#"]` di seluruh halaman. Kalau tujuannya anchor timeline (`#story`, `#beta`):
  `preventDefault`, `history.pushState` hash-nya (tanpa `hashchange`), lalu `scrollToAnchor(..., "smooth")`. Tanpa ini,
  browser menggulir ke elemen scene (yang ada di kotak sticky) dan klik ke hash yang sama tidak memicu `hashchange`.
  Link ke `#features`/`#about` dibiarkan ke browser (`scroll-mt-16` memberi jarak untuk header).
- Saat halaman dibuka dengan hash apa pun, engine memanggil `scrollToAnchor(hash, "instant")` setelah panggung punya
  tinggi. Untuk `#features`/`#about` ini perlu: browser sudah menggulir ke section itu, tapi sebelum panggung setinggi
  ±28 layar.
- Tombol Back di antara hash memicu `hashchange`, jadi engine ikut lompat ke anchor sebelumnya.
- Hasil uji (build produksi): klik Story/Features/About/Join the beta dari posisi mana pun (header dan footer, termasuk
  hash yang sama dua kali) tepat; `/#features`, `/#about`, `/#beta` dibuka langsung di tab baru tepat; reduced motion:
  semua anchor mendarat 64px dari atas (tepat di bawah header); median 8,3 ms/frame, maks 14 ms, 0 long task, 0 layout
  shift (header blur tidak menambah beban).

### Seperti yang dibangun di phase 7

- **Kapan parallax jalan:** tidak reduced motion **dan** tinggi layar ≥ 600px (`MIN_STAGE_HEIGHT`) **dan** ukuran teks
  browser ≤ 20px (`MAX_STAGE_FONT_SIZE`). Selain itu halaman bertumpuk: HP landscape, iPhone SE, zoom 200%, teks
  besar. Skrip `px-on` di `layout.tsx` memakai angka yang sama. Saat ukuran layar berubah melewati batas, engine
  menyala/mati sendiri (di layar sentuh hanya kalau **lebar** berubah, supaya address bar tidak memicunya).
- **Posisi pengunjung dijaga** saat berganti mode: scene yang sedang tampil, atau section setelah panggung dan jarak
  atasnya. Dicatat setiap scroll (bukan saat resize ditangani, karena section `min-h-svh` sudah berubah tinggi).
- **Gambar ditunda:** sampai event `load` (`html.px-ready`), gambar di scene yang tidak aktif dan di HP panggung
  `display:none` (gambar lazy tidak diunduh). Wordmark memakai `preload`. Mobile LCP 6,7 s → 2,9 s (simulasi
  Lighthouse).
- **HP panggung disembunyikan dengan CSS** (`.px-on [data-px="phone"] { opacity: 0 }`) sampai engine menulis frame
  pertama. Sebelumnya HP sempat tampil sebelum JavaScript jalan (dan jadi elemen LCP).
- **Bezel resmi Apple** (aturan "Apple Product Images", dipatuhi sebisanya):
  - `wall-hero` tidak berputar dan tidak membesar lagi (hanya naik + muncul).
  - Dinding History tegak (tanpa `-rotate-12`), 3 HP berdiri di samping kartu teks (2 HP di bawah 1280px), semua
    utuh di layar. Memudar habis di tengah keyframe insight sebelum HP Summary muncul.
  - Balon Claire di kiri HP dengan jarak (`+ 1rem`, dulu menimpa 2.5rem). Di HP (mobile) balon hanya untuk pembaca
    layar (`max-md:px:sr-only`).
  - Chip bahan makanan: kanan HP (lg), di bawah teks (md), satu baris di atas HP (mobile).
  - Kartu "Running high?" masuk dari kiri (dulu dari kanan, melintasi HP). `hello` dan teks yang bergantian memudar
    lebih cepat (`opacity: [1, -1]`).
  - Connect keluar: HP memudar di tempat (dulu naik ke bawah label).
- **Mobile:** HP panggung menempel di bawah layar (`items-end pb-[max(1rem,2svh)]`, dulu `pt-[41svh]`), teks mulai
  di `4.75rem` (di bawah header). Ikon deck disembunyikan di panggung mobile. Di scene Tips HP memudar (tidak ada
  tempat untuk kartu dan HP sekaligus) dan kembali di Connect.
- **Uji otomatis "tidak ada yang menimpa bezel"** (`__scan.js` di scratchpad, disalin ke `out/` saat uji): di
  1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 414×896, 390×664, 375×812 tidak ada elemen yang terlihat
  menimpa bezel; HP hanya terpotong tepi layar saat masuk/keluar. Di 375×600 (batas bawah) ada satu tumpang tindih
  sesaat dengan opacity 0,34 saat pergantian History → Insights.

## 5. Timeline Claire (desktop)

Total sekitar **24 layar**. Scene dan isinya ada di `03-content.md`. Angka di bawah adalah titik awal,
silakan disetel saat phase 3–5.

Singkatan: `y↑` = naik, `op` = opacity, `vh`/`vw` = persen tinggi/lebar layar.

| # | Scene | Durasi | Latar | Animasi |
|---|---|---|---|---|
| 1 | `intro` | 100vh | `home-background`→`home-cream` gradasi (tetap) | `wordmark` y −140px, op 0. `tagline` y −110px, op 0. `scroll-hint` op [1, 0]. Bintang latar 3 lapis: `stars-far` y −10vh, `stars-mid` y −25vh, `stars-near` y −45vh |
| 2 | `burden` | 150vh | sama | `burden-text` (mulai di 63% tinggi) y −25vh, op [0, 1.75]. `tile-grid` (mulai di bawah layar) y −70vh, op [0, 1] |
| 3 | `burden` | 150vh | sama | 16 `tile-1..16` meledak: tiap tile x dan y berbeda (−20vw..+20vw, −17vh..+14vh), scale 1–2, op [1, 0]. Nilainya di tabel bawah |
| 4 | `burden` | 100vh | sama | `burden-text` y [−25vh, −40vh], op [1, 0]. `relief-text` op [0, 1.5], y 4vh→0 |
| 5 | `meet` | 100vh | `home-cream`→`home-background` | `relief-text` op 0. `star` scale [0.4, 1], rotate [−30, 0], op [0, 1]. `hello` y [10vh, 0], op [0, 1.5] |
| 6 | `meet` | 150vh | sama | `phone` y [100vh, 0] (naik dari bawah). `meet-text` y −25vh, op [0, 1.75]. `star` y −6vh, scale 1.1, op [1, −1] (memudar setelah menyapa; **tidak lagi pindah ke kiri atas**, permintaan Aaron phase 8). `hello` op [1, −1] |
| 7 | `meet` | 50vh | | jeda (anchor `story`) |
| 8 | `log` | 100vh | `home-background`→`voice-top`, tone dark | `meet-text` op 0. `voice-text` op [0, 1.5]. `screen-home` op 0, `screen-voice` op [0, 1]. `voice-glow` scale [0.6, 1.2], op [0, 0.6]. `bubble-voice` y [3vh, 0], op [0, 1] |
| 9 | `log` | 50vh | | jeda |
| 10 | `log` | 100vh | `voice-top`→`home-cream`, tone light | `voice-text`, `bubble-voice`, `voice-glow` op 0. `meal-text` op [0, 1.5]. `screen-voice`→`screen-meal`. `ingredient-1..3` (nama bahan) x [30vw, 0], op [0, 1] (berurutan dengan opacity range bertingkat). `bubble-meal` op [0, 1] |
| 11 | `log` | 50vh | | jeda |
| 12 | `log` | 100vh | | `meal-text`, `ingredient-*`, `bubble-meal` op 0. `quick-text` op [0, 1.5]. `screen-meal`→`screen-glucose`. `deck-glucose`, `deck-insulin`, `deck-activity` scale [0, 1] berurutan |
| 13 | `log` | 100vh | | `screen-glucose`→`screen-insulin`. Deck insulin membesar 1.15 lalu kembali |
| 14 | `log` | 100vh | | `screen-insulin`→`screen-activity`. Deck activity membesar 1.15 lalu kembali |
| 15 | `tips` | 150vh | | `quick-text`, `deck-*` op 0. `phone` x 22vw. `tips-text` op [0, 1.5]. `card-low` x [−40vw, 0], op [0, 1]. `card-high` x [40vw, 0], op [−0.5, 1] (sedikit telat) |
| 16 | `tips` | 50vh | | jeda |
| 17 | `dose` | 100vh | `home-cream`→`voice-bottom`, tone dark | `tips-text`, `card-*` y −20vh, op 0. `phone` y 100vh. `dose-statement` scale [0.8, 1], op [0, 2]. `dose-sub` op [−0.5, 1] |
| 18 | `dose` | 50vh | | jeda |
| 19 | `history` | 150vh | `voice-bottom`→`home-background`, tone light | `dose-*` op 0. Dinding HP miring −12°, 3 kolom: `wall-col-1` y [20vh, −40vh], `wall-col-2` y [−10vh, −70vh], `wall-col-3` y [30vh, −30vh] (kecepatan beda = kedalaman). `history-text` op [0, 1.5] |
| 20 | `history` | 150vh | | Homage iPhone berputar: `wall-hero` (HP Summary di kolom tengah) rotate [−12, 0], scale [1, 1.3], x ke tengah. `wall-col-*` op 0.25. `history-text` op 0, `insight-text` op [0, 1.5]. `bubble-insight` op [0, 1] |
| 21 | `connect` | 150vh | | `wall-*`, `insight-*` op 0. `phone` kembali ke tengah dengan `screen-widget`. 4 `chip-*` mulai di pojok (x ±40vw, y ±40vh, scale 1.5, op 0) → posisi melingkari HP (scale 1, op 1). Kebalikan dari "ledakan" |
| 22 | `connect` | 50vh | | jeda |
| 23 | `cta` | 100vh | `home-background`→`home-star` | `phone`, `chip-*` op 0. `cta-block` scale [0.8, 1], op [0, 2]. `qr-card` y [20vh, 0], op [0, 1]. Anchor `beta` |
| 24 | `cta` | 100vh | | jeda akhir, lalu halaman lanjut scroll biasa |

### Nilai ledakan 16 tile (keyframe 3)

Grid 4×4, tile 4.5rem dengan jarak 0.75rem. Arah dan skala dibuat acak tapi tetap (tidak random tiap load):

| Tile | x | y | scale | | Tile | x | y | scale |
|---|---|---|---|---|---|---|---|---|
| 1 | −10vw | −15vh | 2 | | 9 | −12vw | 3vh | 1.5 |
| 2 | −4vw | −5vh | 1 | | 10 | −4vw | 5vh | 1 |
| 3 | 2vw | −9vh | 1.2 | | 11 | 6vw | 8vh | 1.4 |
| 4 | 8vw | −17vh | 1.5 | | 12 | 20vw | 1vh | 1.9 |
| 5 | −15vw | −2vh | 2 | | 13 | −12vw | 8vh | 1.8 |
| 6 | −7vw | −1vh | 1.2 | | 14 | −3vw | 4vh | 1.3 |
| 7 | 2vw | −4vh | 1.1 | | 15 | 5vw | 14vh | 1.7 |
| 8 | 12vw | −3vh | 1.8 | | 16 | 9vw | 6vh | 2 |

Semua tile op [1, 0].

## 6. Timeline Claire (mobile, < 768px)

Durasi dan urutan sama. Yang berbeda:

| Scene | Perbedaan |
|---|---|
| Semua | Teks di atas (top 12–14%), HP di bawah (lebar 62vw, mulai di 42% tinggi). Lebar teks max 90vw |
| `burden` | Grid 4×4 tile 3.5rem, di bawah teks. Jarak ledakan pakai vw jadi otomatis lebih kecil |
| `meet` | Bintang memudar setelah menyapa (sama seperti desktop) |
| `log` | Bahan makanan (`ingredient-*`) muncul di bawah HP, bukan di samping |
| `tips` | HP tidak geser ke kanan, tapi turun dan mengecil (scale 0.8). Kartu muncul di atasnya bergantian |
| `history` | Dinding HP 2 kolom |
| `connect` | Chip 2×2 di atas dan bawah HP |
| `cta` | QR disembunyikan (orang sudah di HP), tombol "Join the beta" lebih besar |

## 7. Tips menyetel

- Mulai dari durasi panjang, lalu pendekkan. Scene yang terasa "lama diam" kurangi jedanya.
- Teks harus diam cukup lama untuk dibaca: minimal 50vh jeda setelah teks muncul penuh.
- Pakai `?px-debug` untuk melihat keyframe mana yang sedang jalan.
- Kalau ada elemen "nyangkut" setelah scroll cepat, berarti ada keyframe yang tidak menutup animasinya
  (op terakhir bukan 0). Cek tabel di atas.
