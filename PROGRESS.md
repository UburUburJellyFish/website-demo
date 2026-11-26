# PROGRESS · Claire Website

> **Baca file ini paling pertama.** File ini untuk serah terima antar AI (Claude, Gemini, atau lainnya)
> dan antar sesi. Kalau satu AI berhenti di tengah jalan (token habis, error, sesi ditutup),
> AI berikutnya melanjutkan dari bagian **Status sekarang**.

## Aturan update (wajib untuk semua AI)

1. **Sebelum mulai kerja:** isi "Sedang dikerjakan" (phase, langkah, file yang akan disentuh) dan tanggal.
2. **Setiap satu tugas di checklist phase selesai:** centang di file phase-nya (`docs/phases/...`) dan tulis
   satu baris di "Log" di bawah. Jangan tunggu sampai phase selesai, supaya kalau berhenti mendadak,
   jejaknya tetap ada.
3. **Setelah selesai / berhenti:** pindahkan isi "Sedang dikerjakan" ke "Terakhir selesai", isi
   "Langkah berikutnya", dan catat hal yang setengah jadi di "Belum beres".
4. Tulis jujur: kalau build gagal atau sesuatu belum dicek, tulis begitu.
5. Jangan hapus isi Log. Entri baru di paling atas.

## Status sekarang

| | |
|---|---|
| **Tanggal update** | 2026-11-26 |
| **Diupdate oleh** | Claude (Opus 5.5) |
| **Tahap** | **Phase 0–7 selesai. Website live** di https://claire-peach.vercel.app. Phase 8 tinggal cek di iPhone (Safari) |
| **Sedang dikerjakan** | 2026-11-26 — sinkronisasi Git: ambil perubahan `origin/main`, gabungkan dengan `main`, lalu dorong hasilnya; hanya operasi Git dan pembaruan log ini |
| **Terakhir selesai** | **Bintang interaktif di About** (`ui/StarPlayground.tsx`, dipasang di `AboutSection`, teks `about.ts` → `playground.hint`, `.claude/launch.json` untuk preview). Referensi igloo.inc: ±1150 partikel kuning (`home-star`/`highlight-chart`) membentuk bintang 5 sudut, mesh tipis, berputar halus di 3D — canvas + 1 rAF, tanpa library. Menyebar dari kursor, meledak saat diketuk; reduced motion → bingkai diam; animasi hanya saat panel terlihat (IntersectionObserver) + berhenti saat tab tersembunyi. Maskot `claire-star-main` tidak lagi dipakai di About. Diuji 1280×860 + 375 (mobile band), console bersih, `npm run lint` + `npm run build` lolos. **Belum di-commit.** (Sebelumnya `/support` juga belum di-commit — lihat log.) |
| **Langkah berikutnya** | (1) App Store Connect: Support URL `https://claire-peach.vercel.app/support`, Privacy Policy URL `https://claire-peach.vercel.app/privacy`, dan lengkapi metadata App Information. (2) Aaron cek website di iPhone (Safari) |
| **Build terakhir** | `npm run lint`, `tsc --noEmit`, `npm run build` lolos (2 halaman: `/`, `/privacy`; peringatan `metadataBase` sampai `site.url` diisi). Diuji di `scripts/test/gzip-server.mjs` port 4174 |

### Belum beres

- Safari iOS (address bar muncul/hilang) belum diuji di perangkat atau Simulator (Simulator dipakai sesi lain saat phase 7).
- Video promo: belum diputuskan Aaron, tidak dipasang.
- Privacy Policy: tim perlu cek paket Gemini API (gratis/berbayar) untuk label App Privacy di App Store Connect, dan apakah app punya tombol hapus semua data.
- Di app (repo iOS, bukan website): teks Profile tentang Apple Health menyebut "UburUbur" dan "C5-M01-UburUbur", padahal nama app di iPhone "Claire" (`ProfileView.swift` baris ±57).
- Daftar anggota tim dan kalimat privasi di About belum tampil (menunggu konfirmasi tim; isi `members` / `privacy.confirmed` di `src/content/about.ts`).
- HP masih bergeser dan memudar ikut scroll: menurut aturan Apple ("animating ... the images") ini abu-abu. Aaron memilih "patuhi sebisanya" (2026-11-25). Kalau mau patuh penuh, HP harus diam (hanya layarnya yang berganti).
- Di 375×600 (tinggi minimum parallax) ada satu tumpang tindih sesaat (opacity 0,34) antara HP dinding dan teks History saat pindah ke Insights.
- Scene Tips di HP (mobile) menyisakan ruang kosong di bawah kartu (HP sengaja memudar di sana).
- Timeline masih ±28,5 layar. Tidak dipendekkan di phase 7.
- `MeetScene` masih punya HP fallback sendiri (inline); bisa diganti `ui/StackedPhone` (opsional).

### Git

| | |
|---|---|
| Branch | `main`, remote `origin` = `git@github.com:UburUburJellyFish/website-demo.git`. Aaron sudah commit + push sampai `7054f3d` (phase 0–8 + revisi) |
| Commit terakhir | Phase 0–8 sudah di-commit terpisah dan di-push ke `origin/main` |
| Belum di-commit | `/support` + komponennya, `PageHero`/`pageMetadata`, link footer, sitemap, docs + PROGRESS; **bintang About** (`ui/StarPlayground.tsx`, `AboutSection.tsx`, `content/about.ts`, `.claude/launch.json`). Commit terakhir di `origin/main`: `0ea7dd0` |

## Cara melanjutkan (untuk AI mana pun)

1. Baca file ini, lalu `docs/README.md`, lalu file phase yang disebut di "Langkah berikutnya".
2. Baca `AGENTS.md`: Next.js di sini versi 16, banyak yang berbeda dari versi lama.
   Cek panduan di `node_modules/next/dist/docs/` sebelum menulis kode.
3. Ikuti aturan di `docs/README.md` (warna hanya AppColor, hanya frontend, teks bahasa Inggris di
   `src/content/`, satu komponen per file).
4. Jalankan:

```bash
cd /Users/aaron/Documents/App/claire-website && npm install
```

```bash
npm run dev
```

5. Sebelum menyatakan satu phase selesai: `npm run lint` dan `npm run build` harus lolos.
6. Commit per phase dengan pesan `Phase N: <nama>` (minta izin Aaron dulu).

## Lokasi penting

| Apa | Di mana |
|---|---|
| Website (repo ini) | `/Users/aaron/Documents/App/claire-website` |
| Repo app iOS (hanya dibaca, **jangan diubah**) | `/Users/aaron/Documents/App/C5-M01-UburUbur` |
| Warna app | `C5-M01-UburUbur/C5-M01-UburUbur/View/Theme/AppColor.swift` |
| Rekaman layar app | `C5-M01-UburUbur/Demo-Video/recordings/REC-01..16.mov` |
| Logo, font | `C5-M01-UburUbur/Demo-Video/logo/`, `C5-M01-UburUbur/Demo-Video/fonts/` |
| QR TestFlight | `C5-M01-UburUbur/QR-TestFlight/` |
| Referensi parallax | http://davegamache.com/parallax/ (butuh layar ≥ 1000px) |

## Keputusan yang sudah diambil

| Tanggal | Keputusan | Oleh |
|---|---|---|
| 2026-11-25 | Website di folder terpisah, bukan di dalam repo app | Aaron |
| 2026-11-25 | Next.js, hanya frontend, tanpa penyimpanan data (static export) | Aaron |
| 2026-11-25 | Teks website bahasa Inggris | Aaron |
| 2026-11-25 | Parallax seperti davegamache.com/parallax | Aaron |
| 2026-11-25 | Semua warna dari hex AppColor | Aaron |
| 2026-11-25 | Dikerjakan per phase, dokumen dulu baru kode | Aaron |
| 2026-11-25 | Versi iOS minimum: 26 | Aaron (edit di `03-content.md`) |
| 2026-11-25 | Easter egg dirahasiakan di website (kartu "A little secret") | Aaron (edit di `03-content.md`) |
| 2026-11-25 | Link TestFlight `https://testflight.apple.com/join/utWcPjDc` (dari QR) boleh dipakai di website | Aaron |
| 2026-11-25 | Mesin parallax buatan sendiri, tanpa GSAP/Motion/jQuery | Claude (di `02-parallax.md`) |
| 2026-11-25 | `cacheComponents` dimatikan (bentrok dengan static export) | Claude |
| 2026-11-25 | Website hanya light mode (dark mode dihapus) | Aaron |
| 2026-11-25 | Hosting: Vercel (Aaron sendiri yang login dan import repo `UburUburJellyFish/website-demo`) | Aaron |
| 2026-11-25 | Kontak di Privacy Policy: email Aaron (ditampilkan publik) | Aaron |
| 2026-11-26 | Kontak di Privacy Policy diganti ke email support tim `supportclaires@gmail.com` | Aaron |
| 2026-11-25 | Belum commit/push di phase 8 (kemudian Aaron sendiri yang commit + push) | Aaron |
| 2026-11-25 | URL live: https://claire-peach.vercel.app (project Vercel `claire`, akun Hobby Aaron) | Aaron |
| 2026-11-25 | Bingkai HP = bezel iPhone resmi Apple, aturan "Apple Product Images" dipatuhi sebisanya (tanpa bayangan, miring, putar; tidak ada yang menimpa HP; HP tetap bergeser/memudar ikut scroll) | Aaron |

## Masih menunggu jawaban

Lihat "Perlu konfirmasi" di `docs/03-content.md`: link TestFlight publik, kalimat privasi, nama anggota tim,
menyebut Accu-Chek Guide atau tidak, hosting dan domain.

## Jebakan yang sudah diketahui

- `cacheComponents: true` + `output: "export"` → build gagal "PPR cannot be enabled in export mode".
- `new Date()` di Server Component → build gagal saat prerender. Tahun ditulis di `src/content/site.ts`.
- `sips` di Mac tidak bisa menulis WebP, ffmpeg di Mac ini tidak punya encoder WebP → pakai `sharp` (phase 1).
- Teks `home-ink` di atas `home-star` (kuning) kontrasnya kurang (4,22). Pakai `navy`.
- Teks di atas `home-star` (kuning) pakai `voice-bottom`, **bukan** `navy`/`home-ink` (kontras kurang di kuning).
- Palet bawaan Tailwind dimatikan: `bg-white`, `text-black`, `bg-zinc-*` tidak ada. `bg-transparent` dan `text-current` tetap bisa.
- `priority` di `<Image>` deprecated di Next 16. Gambar LCP (wordmark) memakai `preload` sejak phase 7 (versi dark sudah tidak ada).
- Di dev server CSS disuntik lewat JS, jadi cek "gambar mana yang terunduh" harus di build produksi (`out/`), bukan di `npm run dev`.
- Screenshot dengan sesuatu yang perlu ditutup (label debug, pesan Simulator, "Mock data"): atur `cover` di job `scripts/optimize-images.mjs`, jangan edit PNG manual.
- Elemen `data-px` dikuasai engine untuk `transform` dan `opacity`: jangan beri class `translate-*`/`scale-*`/`rotate-*`/`opacity-*` di elemen itu (tengahkan dengan margin negatif).
- `next/script` `beforeInteractive` tidak jalan sebelum paint (diantrekan di akhir `<body>`). Skrip yang harus jalan sebelum paint = `<script>` inline di `<head>`.
- React Strict Mode di dev menjalankan effect dua kali: kode di effect harus aman dipasang-lepas-pasang.
- Kalau perubahan di `globals.css` tidak muncul di dev server (aturan hilang padahal ada di build), restart `npm run dev` dan hapus `.next/dev`.
- Saat menguji fokus keyboard lewat skrip, `element.focus()` tidak mengirim `focusin` kalau jendela tidak aktif. Pakai tombol Tab sungguhan.
- Class Tailwind tidak boleh disusun dengan template string (`px:left-[calc(${X})]`): Tailwind tidak menemukannya. Tulis class lengkap.
- Teks di latar `voice-top`/`voice-bottom` pakai `on-dark` (warna mewarisi dari panggung saat `tone: "dark"`), bukan `home-cream` (gelap di dark mode).
- Pergantian scene langsung menyembunyikan scene lama: pudarkan isinya di keyframe yang masih memakai scene lama.
- Dev server bisa menyajikan CSS lama lagi. Untuk uji yang penting (warna, dark mode), uji di build produksi (`npm run build` lalu sajikan `out/`).
- Elemen yang harus tampil di atas elemen lain dalam satu scene harus datang belakangan di DOM (mis. balon setelah HP Summary).
- Jangan beri dua class `display`/`position` beda variant di satu elemen (`px:contents` + `max-md:px:grid`); pisahkan per breakpoint (`md:px:contents`).
- Elemen `w-full` dengan `inset-x-*` di mode panggung melebar keluar layar: tambahkan `px:w-auto` untuk breakpoint itu.
- Header `fixed` setinggi 4rem menutupi bagian atas panggung. Elemen panggung yang diam harus mulai di bawah `4rem` (di mobile `px:top-[4.75rem]`, bukan persen kecil seperti `4%`/`7%`). Section dengan `id` pakai `scroll-mt-16`.
- Link ke anchor timeline (`#story`, `#beta`) ditangani engine lewat klik (bukan hanya `hashchange`). Kalau membuat link `#...` baru ke keyframe, cukup pakai `<a href="#anchor">` biasa; jangan pakai `next/link` untuk hash.
- `backdrop-filter` di sebuah elemen membuat anak-anaknya tidak bisa mem-blur halaman. Karena itu bar header adalah lapisan terpisah (`-z-10`), bukan class di `<header>`, supaya panel menu HP bisa blur sendiri.
- `text-muted` (home-ink 70%) di bawah 4,5:1 untuk teks biasa (3,1 di krem, 3,0 di `home-tile`). Pakai `home-ink`.
- `matchMedia` palsu (uji `rm.html`) tidak mengubah media query CSS. Animasi `data-reveal` tetap terlihat di uji itu; aturan CSS-nya sendiri ada di dalam `@media (prefers-reduced-motion: no-preference)`.
- **Bezel Apple:** tidak boleh ada yang menimpa HP (balon, chip, kartu, teks, label). Setelah mengubah posisi scene atau timeline, jalankan `scripts/test/bezel-scan.js` di beberapa ukuran (cara pakai di file itu). Jangan beri `shadow`, `rotate`, atau `scale` animasi pada HP.
- Parallax hanya jalan kalau tinggi layar ≥ 600px dan teks browser ≤ 20px. Untuk menguji mobile pakai tinggi ≥ 600 (mis. 390×664 = iPhone di Safari); 320×568 dan landscape memang halaman bertumpuk.
- Gambar panggung yang belum tampil `display:none` sampai `html.px-ready` (event `load`). Jangan pakai gambar di luar `[data-scene]`/HP panggung untuk hal yang harus langsung terlihat, kecuali dengan `preload`.
- `<Image preload>` = gambar LCP (wordmark). Jangan digabung dengan `fetchPriority`/`loading` (aturan Next 16).
- `robots.ts`/`sitemap.ts` di static export butuh `export const dynamic = "force-static"`, kalau tidak build gagal.
- Uji Lighthouse dengan `scripts/test/gzip-server.mjs` (server python tanpa gzip membuat skor mobile ±77, bukan angka hosting).
- Uji reduced motion dan teks besar: setelah build, `node scripts/test/make-test-pages.mjs` membuat `out/rm.html` dan `out/bigtext.html`.
- Halaman selain Home memakai `SiteHeader linkBase="/"` dan `SiteFooter linkBase="/"` supaya link `#story`/`#features` kembali ke Home. Link ke `/` pakai `next/link` (aturan lint).
- Static export menulis `privacy.html` **dan** folder `privacy/`. Server uji harus mencoba `<path>.html` sebelum `<path>/index.html` (sudah di `scripts/test/gzip-server.mjs`); Vercel menanganinya sendiri.
- Ref React (`refs.stage.current`) sudah `null` sesaat sebelum cleanup effect jalan (unmount/Fast Refresh). Kode yang jalan dari rAF/timer harus mengecek null (dulu memunculkan "1 Issue" di dev overlay).
- Skill **UI/UX Pro Max** ada di `~/.claude/skills/` (7 skill). Pakai skripnya dengan `python3 -I ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system` atau `--domain ux`. Warna dan font dari skill **jangan** dipakai: website wajib AppColor + Astonpoliz/Geist. Skrip lain di skill itu (logo, shadcn, fetch-background) memakai jaringan/subprocess: jangan dijalankan tanpa alasan.
- `/privacy`: anchor bab/bagian butuh `scroll-mt-40` (header 64px + bar bab ±72px). Kalau tinggi bar bab berubah, sesuaikan.
- Halaman dengan `openGraph`/`twitter` sendiri di `metadata` menimpa milik layout (termasuk gambar): ulangi `images`, `type`, `siteName`, `card` (lihat `src/app/privacy/page.tsx`).
- Uji klik link lewat skrip (`a.click()` beruntun) bisa terlihat "telat satu langkah" karena smooth scroll belum selesai; pakai klik sungguhan + tunggu beberapa detik sebelum menyimpulkan ada bug.
- Screenshot di built-in browser kadang memakai frame lama setelah navigasi (gambar/wordmark seolah tidak ada). Paksa repaint (scroll 1px lalu kembali) atau cek `elementFromPoint` sebelum menganggapnya bug.
- `document.querySelector('summary')` pertama di halaman adalah menu HP di header (juga `<details>`); targetkan FAQ dengan `#support details summary`.
- Port 3000 mungkin masih dipakai dev server dari sesi lain. Matikan dulu atau pakai `npm run dev -- --port 3001`.

## Log

Entri terbaru di atas. Format: `tanggal · AI · phase · apa yang dikerjakan · hasil`.

- 2026-11-26 · Claude · Tambahan · **Bintang interaktif di About (referensi igloo.inc).** `ui/StarPlayground.tsx` (client, canvas + 1 rAF, tanpa library): ±1150 partikel kuning dikemas dalam bintang 5 sudut (rejection sampling), sedikit ketebalan-z → terlihat 3D, goyang halus (bukan putar penuh) supaya bentuk bintang tetap terbaca, mesh tipis ke 2 tetangga terdekat, glow tengah. Interaksi: partikel menyebar menjauhi kursor (pegas balik) dan meledak saat diketuk; `prefers-reduced-motion` → satu bingkai diam tanpa input; loop hanya jalan saat panel terlihat (IntersectionObserver) dan tab aktif (visibilitychange). Warna dibaca dari token AppColor (`--home-star`, `--highlight-chart`) — tanpa hex di `.tsx`. `about.ts` + `playground.hint` ("Give the stars a nudge", pudar setelah ketukan pertama), dipasang di `AboutSection` menggantikan lingkaran maskot statis (maskot `claire-star-main` tidak lagi dipakai di About). `.claude/launch.json` (preview port 3100). Iterasi atas permintaan Aaron: bulat → bintang, lalu lebih banyak partikel + lebih bold. Diuji di dev 1280×860 (hover menyebar, tap meledak) dan 375 mobile band, console bersih, lint + build lolos. **Belum di-commit**
- 2026-11-25 · Gemini · Phase 8 · Commit seluruh pekerjaan Phase 0–8 secara terpisah per phase dan push ke `origin/main` (`UburUburJellyFish/website-demo`) · selesai

- 2026-11-26 · Claude · Phase 8 · Revisi Aaron: kalimat pembuka di intro (`scenes.intro.tagline`) diganti dari "A cheerful little logbook for type 1 diabetes." ke kalimat Aaron "A smart journal designed for people with Type 1 diabetes that learns daily habits, turns them into actionable insights, and brings clarity to their glucose patterns." Meta description, alt gambar pratinjau dan About masih memakai "cheerful" (tidak diminta). Build lolos; dicek 1280 (3 baris) dan 375 (4 baris, tanpa scroll horizontal). **Belum di-commit/push**
- 2026-11-26 · Claude · Phase 8 · Revisi Aaron: kartu kontak paling bawah di `/support` (`SupportContact`) dan `/privacy` (`PrivacyContact`) diganti dari kuning `home-star` ke biru muda `home-accent` (teks voice-bottom ≈ 10:1), supaya bintang Claire yang kuning tidak menyatu. Bullet bintang di kartu support jadi kuning, hover tombol email jadi teks on-dark. Lint + build lolos, dicek di 4174 (dua kartu). **Belum di-commit/push**
- 2026-11-26 · Claude · Phase 8 · App Store Connect **App Compliance**: Regulated Medical Device dideklarasikan **No** (atas OK Aaron; Claire hanya logbook, tidak mendiagnosis, tidak memilih dosis). Sisa wajib sebelum Add for Review: Build, screenshot iPad 13" (0/10; atau jadikan app iPhone saja), Content Rights. App Privacy sudah di-publish Aaron, screenshot iPhone 5 buah
- 2026-11-26 · Claude · Phase 8 · App Store Connect **Pricing and Availability** (Claude in Chrome): harga **Free** ($0.00, base United States, 175 negara) dan availability **147 negara**, tanpa China mainland (butuh nomor ICP) dan 27 negara Uni Eropa (butuh status trader DSA di akun), sesuai permintaan Aaron "negara tanpa requirement tambahan". Keduanya tersimpan (Confirm di modal). Opsi Mac (Apple Silicon) dan Apple Vision Pro dimatikan atas OK Aaron (belum diuji di sana), Save, dicek ulang setelah reload. Catatan: app target iPhone + iPad (`TARGETED_DEVICE_FAMILY = "1,2"`), jadi screenshot iPad juga diminta; `ITSAppUsesNonExemptEncryption = NO` sudah ada
- 2026-11-26 · Claude · Phase 8 · App Store Connect **App Information** (Claude in Chrome): Subtitle `Your friendly type 1 logbook`, Category Primary Health & Fitness + Secondary Medical (halaman **belum di-Save**, menunggu Aaron). Age Ratings disimpan lewat Save di modal: semua fitur NO, semua tema/kekerasan/seksual/judi NONE, Health or Wellness Topics YES, Medical or Treatment Information INFREQUENT → **13+** (12+ Brasil/Korea). Kalau Medical NONE hasilnya 9+; INFREQUENT dipilih karena app dibuat untuk mengelola T1D (lebih aman rating lebih tinggi daripada ditolak). Content Rights **belum diisi**: pernyataan hukum untuk Aaron (jawaban yang jujur "Yes": TKPI dan hasil Gemini adalah konten pihak ketiga)
- 2026-11-26 · Claude · Phase 8 · App Store Connect (via Claude in Chrome, atas permintaan Aaron), versi 1.0 diisi **tanpa Save/Submit**: Promotional Text, Description (dari teks website: fitur, "Your dose, your call", privasi + Gemini), Keywords (`type 1,T1D,glucose,insulin,blood sugar,logbook,carb counter,meal log,glucometer,diabetic,tracker`), Support URL `/support`, Marketing URL, Copyright `2026 UburUbur Team`, App Review Notes (tanpa akun, cara mencoba fitur, tidak ada rekomendasi dosis). Dibiarkan untuk Aaron: kontak App Review (data pribadi), screenshot, build, pilihan rilis, Save, Add for Review. Sebelumnya juga dibantu jawaban App Privacy: Yes collect → Photos or Videos + Other User Content, App Functionality, tidak linked, tidak tracking, **bukan Health**
- 2026-11-26 · Claude · Phase 8 · **Halaman `/support` selesai.** `content/support.ts` (email, catatan darurat, 10 FAQ dalam 4 topik dengan link TestFlight/Privacy, kartu kontak), `components/support/` (Emergency, Topic, FaqItem `<details>`, Contact), `ui/PageHero` (dipakai `/privacy` dan `/support`, `PrivacyHero` dihapus), `ui/EmailButton`, `lib/metadata.ts` `pageMetadata()` (gambar pratinjau + kartu besar untuk halaman selain Home), `site.supportLink` di footer, sitemap + `/support`. Diuji: 1280/375/320 tanpa scroll horizontal, `<details>` dengan klik dan keyboard (Enter buka, Tab ke link, Space tutup), footer link di semua halaman, Lighthouse `/support` 100/100/100/100 mobile+desktop, `/privacy` tetap 100. Catatan: screenshot built-in browser kadang menampilkan frame lama (gambar seolah hilang); cek dengan elementFromPoint/repaint sebelum menyimpulkan bug
- 2026-11-26 · Claude · Phase 8 · Mulai halaman `/support` (Apple mewajibkan Support URL dengan kontak)
- 2026-11-26 · Claude · Phase 8 · Email kontak Privacy Policy → `supportclaires@gmail.com` (permintaan Aaron), `lastUpdated` → November 26, 2026; docs 03/phase-8 + keputusan diperbarui. `PrivacyChapterNav`: geser bar ke chip aktif secara instan dalam 1,5 detik pertama (sebelumnya smooth, sehingga di HP chip bab 4 tidak terlihat saat membuka `/privacy#contact`), offset dihitung relatif ke daftar chip. Diuji 320×640: tombol email satu baris, `#contact` langsung menampilkan chip 4, scroll bab 1–4 chip aktif selalu terlihat. lint + tsc + build lolos
- 2026-11-25 · Claude · Phase 8 · **Website live** (deploy oleh Aaron): https://claire-peach.vercel.app. Dicek: `/`, `/privacy`, `robots.txt`, `sitemap.xml`, OG image, bezel, QR = 200, 404 benar, Brotli aktif; klik sungguhan Story/Join the beta/Features/About tepat; `/privacy` 375×812 tanpa scroll horizontal; console bersih; Lighthouse live 100/100/100/100 untuk Home dan `/privacy` (mobile LCP 1,5 s / 1,0 s). `site.url` diisi → sitemap 2 URL, robots dengan Sitemap, tanpa peringatan `metadataBase`. Ketemu dan diperbaiki: `/privacy` kehilangan `og:image` dan `twitter:card summary_large_image` karena metadata halaman menimpa layout. README/docs diperbarui. Belum: commit/push, uji iPhone Safari
- 2026-11-25 · Claude · Phase 8 · Maskot di pojok kiri atas scene meet dihapus (permintaan Aaron): keyframe 6 `star` sekarang y −6vh, scale 1.1, opacity [1, −1] (hilang di tengah keyframe), animasi `star` di keyframe meet keluar dihapus. Diuji: `#story` 1280×800 dan 375×812 tanpa bintang di pojok, sapaan tetap tampil, scan bezel bersih (tidak ada yang menimpa HP)
- 2026-11-25 · Claude · Phase 8 · **Revisi tile Burden selesai.** `LogTileContent` = `{ kind, value, caption }`, 16 tile baru (`scenes.ts`), `ui/LogTile` ditulis ulang (ikon lucide, nilai 15px / 18px dari xl, keterangan 12px, rata kiri, `whitespace-nowrap`, tile meal `color-mix(card-meal 65%, voice-bottom)` + `on-dark`), ukuran tile naik di lg (5rem) dan xl (5.5rem), `text-pretty`/`text-balance` di teks Burden. Diuji: tidak ada tile meluber di 320/375/768/1024/1280/1920, grid tidak menabrak teks (1024: teks s/d 486px, grid dari 514px; 768: 349 / 383), Lighthouse Home mobile 96 / desktop 100, a11y 100, kontras 1
- 2026-11-25 · Claude · Phase 8 · Aaron: desain `/privacy` sudah oke. Revisi berikut: tulisan tile Burden. Skill UI/UX Pro Max: skala huruf konsisten, label kecil tidak boleh pecah baris, minimal 12px
- 2026-11-25 · Claude · Phase 8 · **Revisi `/privacy` selesai.** Komponen baru: `PrivacyPromise`, `PrivacyChapterNav` (client), `PrivacyChapter`, `PrivacyContact`, `colors.ts`; `PrivacyHero`/`PrivacySectionBlock` ditulis ulang; `PrivacyToc`/`PrivacyHighlight`/`PrivacyPolicy` dihapus. `privacy.ts`: 4 bab, balon per bab, rujukan "section 6". `globals.css`: `shadow-clay`, `.reading-progress`. Diuji: 320/375/768/1280/1440 tanpa scroll horizontal, klik 4 chip bab mendarat di bawah bar (judul 160px, bar 137px), chip aktif berganti, bar bab HP menggeser chip aktif ke tengah, email kontak satu baris di 320px, Lighthouse 100 semua (mobile/desktop)
- 2026-11-25 · Claude · Phase 8 · Revisi dimulai: skill UI/UX Pro Max (github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT, 7 skill) dipasang di `~/.claude/skills/` setelah isinya dicek (skrip pencarian hanya membaca data lokal). Rekomendasi skill: Claymorphism, pola storytelling per bab dengan indikator progres, panjang baris 65–75 karakter, navigasi aktif ditandai. Warna/font dari skill tidak dipakai (wajib AppColor + Astonpoliz/Geist)
- 2026-11-25 · Claude · Phase 8 · Sebagian selesai, menunggu Aaron (commit/push + import Vercel). Diuji: `/privacy` 1280/375 (tanpa scroll horizontal, daftar isi sticky dan link ke bagian tepat), link header/footer dari `/privacy` ke `/#features` tepat, link Privacy di footer, tombol "Back to home" (navigasi klien, engine menyala lagi), QR di 1920/1280/1024/768 (tidak menimpa teks, utuh di layar), Lighthouse `/privacy` 100/100/100/100 (mobile dan desktop), Home 95/100 mobile, 100 desktop. README.md: deploy Vercel + App Store Connect. Docs 03/04/phase-8 diperbarui
- 2026-11-25 · Claude · Phase 8 · Halaman `/privacy`: `content/privacy.ts` (14 bagian, dari audit kode), `components/privacy/` (Hero, Highlight, Toc, Policy, SectionBlock), `ui/SkipLink` (dipakai juga di Home), header/footer `linkBase`, link "Privacy Policy" di footer, sitemap + `/privacy`. QR CTA diperbesar (30rem max, QR 900px). Perbaikan: error "1 Issue" di dev overlay (`placeAfterStage` saat ref null), server uji untuk `privacy.html`
- 2026-11-25 · Claude · Phase 8 · Mulai. Permintaan Aaron: QR diperbesar, halaman Privacy Policy untuk App Store. Audit app: satu-satunya koneksi = Gemini (foto/nama/bahan makanan), data lain di iPhone (SwiftData, App Group untuk widget, tanpa iCloud), HealthKit hanya baca (workout, active energy, tidur), speech on-device kalau tersedia, tanpa analytics/SDK pihak ketiga. Remote GitHub sudah ada: `UburUburJellyFish/website-demo` (hanya commit awal)
- 2026-11-25 · Claude · Phase 7 · **Phase 7 selesai** (kecuali uji Safari iOS dan video). Lighthouse (gzip): mobile 95/100/100/100 (LCP 2,9 s), desktop 100/100/100/100. Scan bezel bersih di 1920, 1440, 1280, 1024, 768, 414, 390, 375 lebar; tidak ada scroll horizontal di 320–1920; landscape 812×375, zoom/teks besar → halaman bertumpuk; peralihan mode menjaga posisi (scene dan section bawah); link header/footer dan `/#features` `/#about` `/#beta` tepat; skip link; easter egg nyala di ketukan ke-8 dan mati 8 ketukan berikutnya; reduced motion bertumpuk dengan bezel; median 8,3 ms/frame, 0 long task, CLS 0. Docs 01/02/03/04/05/README/phase-7, CLAUDE.md, GEMINI.md diperbarui; `scripts/test/` (bezel-scan, gzip-server)
- 2026-11-25 · Claude · Phase 7 · Performa: wordmark `preload`; HP panggung `opacity: 0` lewat CSS sampai engine jalan (sebelumnya tampil sekilas dan jadi LCP); gambar panggung yang belum tampil ditunda sampai `load` (`html.px-ready`); favicon 139 KB → 8 KB. Mobile 74 → 95
- 2026-11-25 · Claude · Phase 7 · Engine: parallax hanya kalau tinggi ≥ 600px dan teks ≤ 20px (juga di skrip `px-on`), nyala/mati saat ukuran berubah (layar sentuh: hanya lebar), posisi dicatat setiap scroll dan dipulihkan setelah peralihan. A11y: skip link "Skip to features", `SceneLabel` jadi `h2`, `:focus-visible` global. SEO: metadata openGraph/twitter, `opengraph-image.png`/`twitter-image.png` + alt (`npm run og`), `robots.ts`, `sitemap.ts`, `site.url` (null). Easter egg `easter-egg/RainbowStar` (aturan app: 8 ketukan, jeda ≤ 2 s, 8 s/putaran, 24 s saat reduced motion, getar)
- 2026-11-25 · Claude · Phase 7 · Bezel resmi Apple di `PhoneFrame` (layar = area transparan 874×1900 di (52,50), sudut dicek tanpa celah), tanpa bayangan. Kepatuhan: `wall-hero` tanpa putar/skala, dinding History tegak di samping kartu (3 HP ≥1280, 2 HP di bawahnya), balon di kiri HP (mobile: hanya pembaca layar), chip bahan makanan tidak menimpa HP, kartu tips dari kiri, mobile: HP di bawah layar, teks dari `4.75rem`, deck disembunyikan, HP memudar di Tips. Dark mode dihapus (token gelap, wordmark gelap, `ThemeImage`, listener skema), `viewport` light + `themeColor`
- 2026-11-25 · Claude · Phase 7 · Mulai. Aaron minta: dark mode dihapus (light saja) dan bezel iPhone resmi Apple (gambar dari Aaron). Aturan Apple (developer.apple.com/app-store/marketing/guidelines, "Apple Product Images") melarang bayangan, miring, putar, animasi, menimpa bezel; Aaron memilih "patuhi sebisanya": tanpa bayangan/miring/putar, balon dan kartu di samping HP, HP tetap bergeser/memudar ikut scroll
- 2026-11-25 · Claude · Phase 6 · **Phase 6 selesai.** Diuji di build produksi: klik Story/Features/About/Join the beta dari header dan footer dari posisi mana pun (termasuk hash yang sama dua kali dan tombol Back) tepat; `/#features`, `/#about`, `/#beta` dibuka langsung di tab baru tepat; menu HP: klik, Enter/Tab/Enter, Escape (fokus kembali ke tombol), tap di luar, pilih link; 1280×800, 768×1024, 375×812 tanpa scroll horizontal; header ikut tone (navy: teks `#FFFDF6`, kuning CTA: bar krem); dark mode; reduced motion (anchor 64px dari atas); 18 kartu, 4 grup, 3 prinsip, privasi tidak tampil; median 8,3 ms/frame, maks 14 ms, 0 long task, 0 layout shift. Docs 01/02/04/README/phase-6 diperbarui
- 2026-11-25 · Claude · Phase 6 · Perbaikan saat uji: label + chip Connect dan kartu teks History di mobile tertutup header (dipindah ke `4.75rem`/`6.75rem`), area tap link footer diperbesar (`py-1.5`) · build lolos
- 2026-11-25 · Claude · Phase 6 · `SiteHeader` fixed (bar blur terpisah, ikut `data-tone`), `HeaderNav` (client, menu `<details>`, Escape/tap di luar), `FeatureSection`/`FeatureGroup`/`FeatureCard` (ikon lucide per `id`, garis warna deck di kartu Log, `ui/FeelingRow` di kartu History), `AboutSection` + `PrincipleCard` (maskot, anggota/privasi hanya kalau diisi/dikonfirmasi), `SiteFooter` (link sama dengan header, tanpa `text-muted`), animasi masuk `data-reveal` CSS-only, `FeatureList` dihapus, `scroll-mt-16` di scene. Engine: klik link ke anchor timeline + scroll ulang ke hash apa pun saat dibuka. `features.ts` + `id` per kartu, `site.ts` + label nav/menu · lint + tsc lolos
- 2026-11-25 · Claude · Phase 6 · Mulai
- 2026-11-25 · Claude · Phase 5 · **Phase 5 selesai.** Diuji: 1280×800, 768×1024, 375×812 (tanpa scroll horizontal), dark mode (dose `#FFFDF6`, CTA `voice-bottom`, kartu QR krem), lompat akhir/awal tepat, Tab ke "Join the beta" (link TestFlight, tab baru) dan `#beta` mendarat di CTA lengkap, reduced motion bertumpuk (CTA jadi kartu kuning), produksi median 8,3 ms/frame, 0 long task, 0 layout shift, 29 resource 200. Docs 02/03/README/phase-5 diperbarui. Ikon perasaan opsional dilewati
- 2026-11-25 · Claude · Phase 5 · Timeline +16 keyframe (log keluar, tips, dose, history, insight, connect, cta; tiap scene punya keyframe keluar). Perbaikan saat uji: balon insight tertutup HP Summary (urutan DOM), teks CTA tertimpa QR di tablet (blok dipersempit), teks CTA mobile `textMobile` karena QR disembunyikan, kartu tips `w-auto` di mobile, class Connect dipisah per breakpoint · lint + tsc + build lolos
- 2026-11-25 · Claude · Phase 5 · Komponen: `ui/TipCard`, `ui/ConnectChip` (ikon lucide, mode ringkas di mobile), `PhoneFrame` ukuran `wall`; scene `TipsScene`, `DoseScene`, `HistoryScene` (dinding HP miring, kolom bergerak, HP Summary terpisah), `ConnectScene`, `CtaScene` (teks `voice-bottom` eksplisit, kartu QR `on-dark`, link TestFlight tab baru); `StagePhone` + `screen-tips`, `screen-widget`; semua scene di `page.tsx` · belum ada keyframe, belum di-build
- 2026-11-25 · Claude · Phase 5 · Mulai
- 2026-11-25 · Claude · Phase 4 · **Phase 4 selesai.** Diuji di build produksi: 1280×800 (voice/meal/glucose/insulin/activity), 375×812 tanpa scroll horizontal, dark mode (teks di navy `#FFFDF6`, balon gelap), lompat langsung akhir/awal (nilai tepat), reduced motion (3 baris bertumpuk dengan HP masing-masing), median 8,3 ms/frame, 0 long task, 0 layout shift, request 200/304. Docs 01/02/04/README/phase-4 diperbarui. Dev server di-restart (CSS basi lagi)
- 2026-11-25 · Claude · Phase 4 · Timeline +9 keyframe (meet keluar, voice + jeda, meal + jeda, glucose, insulin, activity, jeda), `LogScene` di `page.tsx`. Class posisi ditulis lengkap (template string tidak terbaca Tailwind) dan `StackedPhone` dipisah ke file sendiri · lint + tsc + build lolos
- 2026-11-25 · Claude · Phase 4 · Token `--on-dark` (#FFFDF6 tetap di dark mode) untuk teks di latar `voice-top`/`voice-bottom` (catatan Gemini), dipakai di `html[data-tone=dark]` dan overlay debug. Komponen baru: `ui/DeckIcon`, `ui/IngredientChip`, `ui/StackedPhone` (HP untuk halaman bertumpuk), `scenes/LogScene` (3 bagian, posisi panggung dihitung dari lebar HP). `StagePhone`: class `opacity-0` dihapus (timeline yang menahan), `voice-glow` di belakang frame. `scenes.ts`: `ingredientChips` (Nasi putih, Telur ceplok, Kerupuk udang) · belum di-build
- 2026-11-25 · Claude · Phase 4 · Mulai. Phase 3 dari Gemini dicek: lint + build lolos, scene meet tampil benar di browser. Timeline sekarang 9 keyframe (Gemini menambah jeda + fade di burden), jadi keyframe 8–14 di dokumen menjadi keyframe ke-10 dst. di kode
- 2026-11-25 · Gemini · Phase 3 · **Phase 3 selesai.** Diuji di headless Chrome (`out/`): 1440×900, 1280×800, 768×1024, 375×812 (tidak ada scroll horizontal maupun overflow teks di tile meal), dark mode (`claire-wordmark-dark.webp`, token gelap), reduced motion (3 scene bertumpuk rapi), klik `#story` mendarat di keyframe 9 (`meet`), console/network bersih. `npm run lint`, `npx tsc --noEmit`, `npm run build` lolos
- 2026-11-25 · Gemini · Phase 3 · Perbaikan setelah uji visual: (1) `IntroScene` naik ke `top-[32%]` + `bottom-24` agar `scroll-hint` terlihat di atas fold 1280×800 meski header belum fixed; (2) `LogTile` mobile `4.25rem` + `text-[1.167rem]` (18.67px bold) agar "Snack?" muat tanpa overflow; (3) `burden` diberi jeda 55vh + fade-out 45vh untuk `relief-text` agar tidak terpotong mendadak saat pindah ke `meet`
- 2026-11-25 · Gemini · Phase 3 · Membuat `SceneLabel`, `LogTile`, `PhoneFrame`, `PhoneScreen`, `ClaireBubble`, `IntroScene`, `BurdenScene`, `MeetScene`, `StagePhone` (HP bersama di lapisan panggung + fallback `px:hidden` di `MeetScene`); mengganti demo scene & timeline tes di `page.tsx` dan `claire.ts` (keyframe 1–7 desktop + mobile, `anchor: "story"`) · lint, tsc, build lolos

- 2026-11-25 · Claude · Phase 2 · **Phase 2 selesai.** Diuji di browser: scroll pelan + lompat langsung ke akhir/awal (nilai tepat), resize di tengah keyframe (posisi terjaga), `#story`/link header/`px:goto`, Tab ke scene tidak aktif, tanpa JS (bertumpuk), reduced motion via matchMedia palsu (mati/nyala/mati), mobile 375×812 tanpa scroll horizontal, produksi: median 8,3 ms/frame, 0 long task, 0 layout shift, console bersih. Docs: catatan "Seperti yang dibangun di phase 2" di 02, 04, phase-3, phase-6 diperbarui. Vitest opsional dilewati
- 2026-11-25 · Claude · Phase 2 · Perbaikan saat uji: (1) skrip `px-on` pindah dari `next/script` ke `<script>` inline di `<head>` (beforeInteractive diantrekan di akhir body → kedip); (2) engine menyala berdasarkan media query, bukan class (Strict Mode mematikannya); (3) dev server di-restart karena `globals.css` basi
- 2026-11-25 · Claude · Phase 2 · `useParallax.ts` (kelas `Engine`: scroll pasif + 1 rAF, resize debounce 150ms + abaikan tinggi < 15% di layar sentuh, fokus keyboard, `hashchange`, event `px:goto` via `goToAnchor()`, reduced motion & color scheme berubah, overlay `?px-debug`), `ParallaxStage`/`ParallaxScene`/`StageBackground`/`ParallaxDebug`, `ui/StarField`, `scenes/ParallaxStory` (client, membawa timeline), CSS dasar + variant `px:` dan `tone-dark:`, skrip `px-on` (`next/script` beforeInteractive) + `suppressHydrationWarning`, timeline tes 4 keyframe + `DemoIntroScene`/`DemoBurdenScene` (teks asli dari `scenes.ts`), `Hero.tsx` dihapus · lint + build lolos, belum diuji di browser
- 2026-11-25 · Claude · Phase 2 · Fungsi murni di `src/lib/parallax/`: `types.ts` (plus `ColorToken` dengan "stage" = gradasi bawaan), `math.ts` (ease kosinus, lerp, toPx, lerpColor), `compile.ts`, `state.ts` (keadaan dari seluruh timeline; elemen diam di "from" keyframe pertamanya; opacity yang diteruskan di-clamp; tone ganti di tengah keyframe) · belum di-build
- 2026-11-25 · Aaron · – · Link TestFlight dari QR dikonfirmasi boleh dipakai · selesai
- 2026-11-25 · Claude · Phase 1 · **Phase 1 selesai.** `src/content/images.ts` (brand, perasaan, QR), `screens.ts` diisi 900×1957 + alt sesuai isi screenshot, `ThemeImage` (light/dark, panduan Next "Theme detection") dipakai di `Hero`, ikon header pakai `claire-icon.webp`, gambar lama dihapus, bahan makanan dari screenshot di `scenes.ts` (nama saja, app tidak menampilkan gram). Docs 01/02/03/04/05/phase-3/phase-7 diperbarui. Cek: `public/images` 1,1 MB, tidak ada file > 300 KB, skrip kedua kali "0 made, 28 up to date", lint + build lolos, light/dark dicek di browser
- 2026-11-25 · Claude · Phase 1 · `sharp` terpasang, `scripts/optimize-images.mjs` + `npm run images`, `assets-src/` di `.gitignore`. 15 frame dipilih dari lembar kontak REC-01..16 (data contoh Sticky). Ditutup warna latar: label debug "AI · 17,9 s" (meal), "This device doesn't support Bluetooth glucometers." (glucometer, Simulator), badge "Mock data" (summary, REC-11). Summary sengaja dari REC-11, bukan REC-14 (REC-14 menyapa "Hey Vey!" dan status bar beda). 28 WebP jadi: brand 5 (termasuk `claire-wordmark-dark.webp`), perasaan 7, QR 1, screenshot 15; terbesar 72 KB · dicek visual
- 2026-11-25 · Claude · Phase 1 · QR dicek dengan Vision macOS: terbaca. Isinya link TestFlight publik `https://testflight.apple.com/join/utWcPjDc` (sama di QR Cream dan Peek), dipakai untuk `site.testflightUrl` · perlu dikonfirmasi Aaron
- 2026-11-25 · Claude · Phase 0 · **Phase 0 selesai.** Cek: tidak ada hex di `.tsx`, 36 hex di `globals.css` = AppColor persis, class lama/Tailwind bawaan tidak ada, 18 kartu fitur tampil, light/dark/mobile dicek di browser, tidak ada scroll horizontal, lint + build lolos. Perbaikan tambahan: teks tombol kuning `navy` → `voice-bottom` (dark mode tidak terbaca), docs 01/05/phase-1/phase-5 diperbarui (aturan teks di atas kuning + wordmark dark di phase 1)
- 2026-11-25 · Claude · Phase 0 · Komponen pakai class baru + teks dari `src/content/`; tombol kuning `text-navy`; folder baru dibuat (`.gitkeep`); `SiteHeader`/`SiteFooter` → `components/layout/`, `AboutSection`/`FeatureCard` → `components/sections/`; `Hero` dan `FeatureList` tetap di root sebagai sementara (hapus di phase 6); metadata dari `site.ts`; `lucide-react` terpasang · belum di-build
- 2026-11-25 · Claude · Phase 0 · Konten dipecah ke `src/content/`: `site.ts` (metadata, nav, footer, `testflightUrl: null` = TODO), `scenes.ts` (9 scene, 16 tile), `features.ts` (18 kartu, 4 grup), `about.ts` (privasi `confirmed: false`, `members: []`), `screens.ts` (15 screenshot, width/height `null` sampai phase 1) · belum di-build, komponen belum disesuaikan
- 2026-11-25 · Claude · Phase 0 · `globals.css`: semua 36 hex AppColor sebagai token (`--home-cream` → `bg-home-cream`), token turunan, palet bawaan Tailwind dimatikan (`--color-*: initial`), gaya teks `type-*`, `shadow-card` · build lolos; dicek: `bg-zinc-50`/`bg-white`/`text-black` tidak ada lagi, `bg-transparent`/`text-current` tetap ada. **Komponen masih pakai class lama (`bg-tile`, `bg-star`, ...) jadi warnanya hilang sampai tugas berikutnya**
- 2026-11-25 · Claude · – · Membuat `PROGRESS.md`, `GEMINI.md`, aturan update log di `CLAUDE.md` dan `docs/README.md` · selesai
- 2026-11-25 · Claude · Perencanaan · Menulis `docs/` lengkap: README, 01 design system (36 hex AppColor, sudah dicocokkan otomatis), 02 parallax (analisis referensi + timeline 24 keyframe), 03 konten (19 fitur, About), 04 arsitektur, 05 aset, phase 0–8 · selesai, kode belum diubah
- 2026-11-25 · Aaron · – · Commit setup awal `9e6cce2 initial` · selesai
- 2026-11-25 · Claude · Setup · Membuat project Next.js 16 di `claire-website/`, static export, warna brand, logo, font, halaman awal sederhana · build dan lint lolos
