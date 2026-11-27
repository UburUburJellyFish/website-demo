# 01 · Design System

Semua warna di website **wajib** diambil dari `AppColor.swift` di app Claire
(`C5-M01-UburUbur/C5-M01-UburUbur/View/Theme/AppColor.swift`). Tidak boleh ada hex lain.

> **Website hanya light mode** (keputusan Aaron, 2026-11-25, phase 7). Kolom "Dark" di tabel bawah hanya catatan
> dari AppColor, tidak dipakai di web. `globals.css` memakai `color-scheme: light`, `layout.tsx` mengirim
> `colorScheme: "light"` dan `themeColor` `#FFFDF6` (`homeCream`).

## Aturan warna

1. Hanya hex dari tabel di bawah.
2. Transparansi hanya boleh dipakai pada hex yang ada di tabel, sama seperti app
   (contoh: `logField` = `homeInk` 10%). Di CSS tulis `color-mix(in srgb, var(--home-ink) 10%, transparent)`
   atau Tailwind `bg-home-ink/10`.
3. Tidak ada hitam (`#000`), abu-abu bawaan Tailwind (`zinc`, `gray`, `slate`), atau warna bebas.
   Bayangan dan garis pakai `voice-bottom` atau `navy` dengan transparansi.
4. Nama token web = nama di `AppColor`, ditulis kebab-case (`homeCream` → `--home-cream` → `bg-home-cream`).
   Jadi desainer dan developer bisa langsung mencocokkan.
5. Kalau nilai di `AppColor.swift` berubah, ubah juga di `src/app/globals.css` dan tabel ini.

## Semua warna AppColor

### Warna dengan versi light dan dark

| AppColor | Token web | Light | Dark | Dipakai di app untuk |
|---|---|---|---|---|
| `navy` | `--navy` | `#3F5996` | `#B0C5E8` | Judul, ikon di sheet, Profile, History |
| `homeBackground` | `--home-background` | `#EDF8FF` | `#141C24` | Latar biru muda |
| `homeCard` | `--home-card` | `#FFFFFF` | `#1F2A36` | Kartu putih |
| `homeCream` | `--home-cream` | `#FFFDF6` | `#181A1F` | Latar halaman utama, chip waktu |
| `homeTile` | `--home-tile` | `#EAF4FA` | `#222C38` | Kartu Last Glucose, Last Insulin, highlight |
| `homeAccent` | `--home-accent` | `#CCE6FF` | `#2B4360` | Chip status glukosa, lingkaran Daily log, tombol mic |
| `homeInk` | `--home-ink` | `#366799` | `#DFECF7` | Teks dan ikon utama |
| `insightCardExpanded` | `--insight-card-expanded` | `#C7DDED` | `#263747` | Kartu Insight terbuka |
| `insightCardCollapsed` | `--insight-card-collapsed` | `#DDEBF6` | `#1E2B38` | Kartu Insight tertutup |
| `insightCardInner` | `--insight-card-inner` | `#D8E9F4` | `#21303E` | Isi kartu Insight |
| `insightChartBadge` | `--insight-chart-badge` | `#FFFFFF` | `#2C3A47` | Badge di grafik Insight |

### Warna tetap (sama di light dan dark)

| AppColor | Token web | Hex | Dipakai di app untuk |
|---|---|---|---|
| `homeStar` | `--home-star` | `#FFD658` | Bintang, tombol "Okay, I'll do it!" |
| `homeButton` | `--home-button` | `#CCE6FF` | Jawaban utama di teks Home |
| `logSave` | `--log-save` | `#CCE6FF` | Tombol ✓ dan tombol utama sheet |
| `highlightChart` | `--highlight-chart` | `#FEE08E` | Grafik highlight |
| `orange` | `--orange` | `#F5B36F` | Aksen oranye |
| `glucoseStatus` | `--glucose-status` | `#E9E6FD` | Latar status glukosa |
| `lastGlucoseStatus` | `--last-glucose-status` | `#E5EEF4` | Status Last Glucose |
| `lastInsulinRing` | `--last-insulin-ring` | `#C7BAEE` | Ring insulin aktif |
| `rangeLow` | `--range-low` | `#FF8E86` | Bar rentang: di bawah batas bawah |
| `rangeNormal` | `--range-normal` | `#366799` | Bar rentang: normal |
| `rangeHigh` | `--range-high` | `#FFA458` | Bar rentang: di atas batas atas |
| `logError` | (pakai `--range-low`) | `#FF8E86` | Teks error dan peringatan |
| `glucosedeck` | `--glucose-deck` | `#7CB5D5` | Deck glukosa |
| `activitydeck` | `--activity-deck` | `#98D7F1` | Deck aktivitas |
| `insulindeck` | `--insulin-deck` | `#BFA9EF` | Deck insulin |
| `insightSegmentUnselected` | `--insight-segment-unselected` | `#A1AFCC` | Segmen Insight yang tidak dipilih |
| `insightChartDot` | `--insight-chart-dot` | `#DDEBF6` | Titik grafik Insight |
| `insightMutedText` | `--insight-muted-text` | `#6F83A8` | Teks samar di Insight |
| `voiceTop` | `--voice-top` | `#3F5996` | Gradasi voice log, atas |
| `voiceBottom` | `--voice-bottom` | `#1F2D57` | Gradasi voice log, bawah |
| `voiceGlow` | `--voice-glow` | `#BFA9EF` | Cahaya di belakang orb voice log |
| `card(.meal)` | `--card-meal` | `#608CAF` | Kartu meal di voice log |
| `card(.glucose)` | `--card-glucose` | `#7CB5D5` | Kartu glucose di voice log |
| `card(.activity)` | `--card-activity` | `#98D7F1` | Kartu activity di voice log |
| `card(.insulin)` | `--card-insulin` | `#BFA9EF` | Kartu insulin di voice log |

### Warna turunan (transparansi, sama seperti app)

| AppColor | Token web | Nilai |
|---|---|---|
| `homeDailyLogCard` | `--home-daily-log-card` | `homeAccent` 40% |
| `logField` | `--log-field` | `homeInk` 10% |
| `logChip` | `--log-chip` | `homeInk` 10% |
| `logPlaceholder` | `--log-placeholder` | `homeInk` 50% |
| `voiceMuted` | `--voice-muted` | `homeInk` 70% |

Khusus web (tetap dari hex app):

| Token web | Nilai | Untuk |
|---|---|---|
| `--on-dark` | `homeCream` `#FFFDF6` | Teks di atas `voice-top`/`voice-bottom` (`tone: "dark"`). Token sendiri supaya perannya jelas |
| `--frame-line` | `navy` 20% | Bingkai garis tipis di tepi layar (seperti referensi) |
| `--shadow` | `voiceBottom` 18% | Bayangan kartu dan HP |
| `--text-muted` | `homeInk` 70% (= `voiceMuted`) | Hanya dekorasi atau teks besar: di atas `home-cream` 3,1 dan di atas `home-tile` 3,0 (di bawah 4,5). Teks biasa pakai `home-ink` |

### Warna yang tidak dipakai di web

| AppColor | Alasan | Penggantinya di web |
|---|---|---|
| `logButton` (`secondarySystemFill`) | Warna sistem iOS, tidak punya hex | `--log-field` |
| `logDisabledIcon` (`tertiaryLabel`) | Warna sistem iOS, tidak punya hex | `--log-placeholder` |

### Rainbow (easter egg)

`AppColor.rainbow(progress:)` = `Color(hue: p, saturation: 0.45, brightness: 1)` (HSB).
Di CSS sama dengan **`hsl(<hue> 100% 77.5%)`**, hue berputar 0–360°. Hanya dipakai untuk easter egg (phase 7).

## Kontras (WCAG)

Sudah dihitung. Batas AA: 4,5 untuk teks biasa, 3 untuk teks besar (≥ 24px, atau ≥ 18,66px bold).

| Teks | Latar | Rasio | Boleh untuk |
|---|---|---|---|
| `homeInk` `#366799` | `homeCream` `#FFFDF6` | 5,80 | Semua teks |
| `homeInk` | `homeBackground` `#EDF8FF` | 5,47 | Semua teks |
| `homeInk` | `homeTile` `#EAF4FA` | 5,29 | Semua teks |
| `homeInk` | `homeCard` `#FFFFFF` | 5,90 | Semua teks |
| `homeInk` | `homeAccent` `#CCE6FF` | 4,59 | Semua teks (tipis) |
| `navy` `#3F5996` | `homeCream` | 6,70 | Semua teks |
| `navy` | `homeStar` `#FFD658` | 4,87 (light saja) | **Jangan** untuk tombol kuning: di dark mode `navy` jadi `#B0C5E8` (≈1,2) |
| `homeInk` | `homeStar` | 4,22 | **Hanya teks besar.** Tombol kuning pakai `voice-bottom` |
| `#FFFFFF` / `homeCream` | `navy` | 6,82 / 6,70 | Semua teks |
| `#FFFFFF` | `voiceBottom` `#1F2D57` | 13,37 | Semua teks |
| `voiceBottom` `#1F2D57` | `card-glucose`, `card-insulin`, `card-activity`, `range-low`, `range-high`, `orange`, `home-star` | 6,0 – 9,6 | Teks di atas kartu berwarna |
| `navy` | `card-glucose` / `card-insulin` / `range-low` | 3,06 / 3,29 / 3,07 | **Jangan** untuk teks biasa |
| `#FFFFFF` atau `voiceBottom` | `card-meal` `#608CAF` | 3,58 / 3,73 | **Hanya teks besar** |
| `insightMutedText` `#6F83A8` | `homeCream` | 3,76 | **Hanya teks besar** |
| `insightSegmentUnselected`, `rangeLow` | `homeCream` | 2,17 / 2,18 | **Bukan untuk teks**, hanya dekorasi |
| Semua pasangan dark mode (`#DFECF7`, `#B0C5E8` di atas latar gelap) | | 8,4 – 14,5 | Semua teks |

Ringkasnya:
- Teks utama: `home-ink` atau `navy` di atas latar terang.
- Semua teks di atas `home-star` (tombol kuning, latar CTA): **`voice-bottom` `#1F2D57`** (9,55). Warnanya tetap
  di dark mode, sedangkan `navy` dan `home-ink` berubah jadi terang dan tidak terbaca di atas kuning.
- Teks di atas kartu berwarna (deck, range, orange): pakai `voice-bottom`.

## Tipografi

| Peran | Font | Sumber | Class |
|---|---|---|---|
| Display (judul scene, angka besar) | Astonpoliz | `src/app/fonts/Astonpoliz.ttf` (dari `Demo-Video/fonts`) | `font-display` |
| Teks biasa | Geist | `next/font/google` (di-host sendiri saat build) | `font-sans` |

- SF Pro / SF Rounded **tidak boleh** dipakai di web (lisensi Apple hanya untuk platform Apple).
- Ukuran pakai `rem` dan `clamp()`, bukan `px`, supaya ikut setelan ukuran teks pengguna
  (padanan Dynamic Type di app).
- Label scene huruf kapital dengan jarak huruf lebar, seperti judul di referensi.

| Class | Ukuran | Font | Contoh |
|---|---|---|---|
| `type-display-xl` | `clamp(2.75rem, 7vw, 5.5rem)` | Astonpoliz | "Your dose, your call." |
| `type-display-l` | `clamp(2rem, 4.5vw, 3.5rem)` | Astonpoliz | "Hi! I'm Claire." |
| `type-label` | `0.8125rem`, `tracking-[0.25em]`, uppercase, semibold | Geist | "HANDS FULL? JUST TALK." |
| `type-body-l` | `clamp(1.0625rem, 1.4vw, 1.25rem)`, leading 1.6 | Geist | Teks scene |
| `type-body` | `1rem`, leading 1.6 | Geist | Kartu fitur, About |
| `type-small` | `0.875rem` | Geist | Footer, disclaimer |

## Bentuk, jarak, bayangan

| Elemen | Nilai |
|---|---|
| Radius kartu | `1.5rem` (`rounded-3xl`), sama seperti kartu di app |
| Radius tombol, chip | penuh (`rounded-full`) |
| Radius bingkai HP | `3rem` luar, `2.5rem` layar |
| Gutter samping | `1rem` di HP, `1.5rem` di tablet, max lebar konten `72rem` |
| Bayangan kartu | `0 12px 32px var(--shadow)` |
| Bingkai layar | garis `1px var(--frame-line)` dengan jarak `10px` dari tepi viewport (homage referensi) |

## Komponen visual

| Komponen | Tampilan |
|---|---|
| Tombol utama | latar `home-star`, teks `voice-bottom`, `rounded-full`, padding `0.875rem 1.5rem`, semibold |
| Tombol kedua | garis `1px navy` 50%, teks `navy`, latar transparan |
| Kartu fitur | latar `home-tile`, radius 3xl, ikon dalam lingkaran `home-accent` |
| Tile log (scene Burden) | latar warna kartu voice log (`card-*`), teks `voice-bottom`, radius 1rem. Isi: ikon (lucide, sama dengan DeckIcon) di kiri atas, nilai tebal 15px (18px dari xl) dan keterangan 12px di bawah, rata kiri, tidak pernah pecah baris. Tile meal: `card-meal` dicampur 35% `voice-bottom`, teks `on-dark` (5,46:1; `card-meal` biasa hanya 3,73). Ukuran tile 4.25 / 4.5 / 5 / 5.5rem (base / md / lg / xl). Bayangan dalam tipis di bawah |
| Balon Claire | latar `home-card`, teks `home-ink`, ekor kecil, bayangan `--shadow` |
| Bingkai HP | **Bezel iPhone resmi Apple** (`public/images/device/iphone-bezel.webp`, dari Aaron, phase 7) di atas screenshot. Layar = area transparan bezel (874×1900 di (52, 50) dalam gambar 978×2000). Aturan Apple "Apple Product Images" dipatuhi sebisanya (pilihan Aaron): **tanpa bayangan, tidak dimiringkan/diputar/dipotong, tidak ada yang menimpa bezel** (balon, chip, kartu, teks di samping). HP masih bergeser dan memudar ikut scroll (abu-abu menurut kata "animating"). Lihat `ui/PhoneFrame.tsx` |
| Ikon | SVG buatan sendiri atau `lucide-react` (lisensi ISC). **Jangan** SF Symbols (lisensi Apple) |
| Header | `fixed`, tinggi 4rem. Lapisan bar terpisah: `home-cream` 75% + `backdrop-blur-md` + garis bawah `frame-line`, teks `home-ink`. Saat `tone: "dark"`: `voice-bottom` 45%, teks `on-dark`. Di latar kuning CTA bar tetap krem (teks tidak pernah langsung di atas kuning). Tombol "Join the beta" = tombol utama |
| Menu HP | `<details>` (jalan tanpa JavaScript), panel `home-cream` 95% di bawah header, link besar (`type-body-l`) |
| Kartu prinsip (About) | latar `home-card`, `shadow-card`, bintang kecil `home-star` |
| Footer | latar `home-tile`, garis atas `frame-line`, semua teks `home-ink` / `navy` |
| Kartu clay (`/privacy`) | `shadow-clay` (utility di `globals.css`): bayangan luar `--shadow` + bayangan dalam bawah `voice-bottom` 7% + kilap dalam atas `home-card` 60%. Kartu berwarna diberi bingkai putih tebal `border-3 border-home-card`. Dari rekomendasi skill UI/UX Pro Max (Claymorphism), warna tetap AppColor |
| Bar bab (`/privacy`) | sticky di bawah header, chip `home-tile`/`navy`; chip aktif diisi warna bab dengan teks `voice-bottom`; bar progres `home-star` 4px |

## Latar panggung parallax

- Latar tetap (selama scene parallax): gradasi `home-background` (atas) ke `home-cream` (bawah).
- Bintang-bintang kecil (`home-star`, `highlight-chart`) di 3 lapis kedalaman, bergerak dengan kecepatan berbeda.
- Beberapa scene mengganti warna latar lewat keyframe (lihat `02-parallax.md`):
  cream → `voice-top` (Voice log) → cream → `voice-bottom` (Your dose) → `home-background` → `home-star` (CTA).
- Saat latar gelap (`voice-top`, `voice-bottom`), teks dan header berganti ke `home-cream`.

## Dark mode

**Dihapus di phase 7** (permintaan Aaron): website selalu light, apa pun setelan sistem pengunjung. Yang dihapus:
blok `@media (prefers-color-scheme: dark)` di `globals.css`, `claire-wordmark-dark.webp` (dan job-nya di
`scripts/optimize-images.mjs`), komponen `ThemeImage`, dan listener skema warna di engine. Kalau suatu hari dark mode
dibuat lagi, lihat riwayat git phase 6.

## Gerak

| Hal | Nilai |
|---|---|
| Easing scroll | kosinus: `(1 − cos(π·t)) / 2`, sama seperti referensi |
| Properti yang dianimasikan | hanya `transform` dan `opacity` (plus warna latar panggung) |
| Hover / fokus | `transition 150ms ease-out` |
| `prefers-reduced-motion: reduce` | parallax mati, semua scene tampil bertumpuk tanpa gerak |
| Kartu setelah cerita (`data-reveal`) | fade + naik 12px saat masuk layar, CSS scroll-driven animation (`animation-timeline: view()`), hanya kalau didukung dan tanpa reduced motion |
| Transisi antarhalaman (`/`, `/support`, `/privacy`) | `PageTransition`: lapisan `home-star` → `card-insulin` → langit malam (`voice-top` → `voice-bottom`) dengan 34 bintang dan Claire jatuh dari atas (tepi melengkung 15vh), jeda 90ms antarlapisan, 560ms per lapisan. Halaman berganti (navigasi klien `router.push`) begitu lapisan pertama menutup layar; setelah semua mendarat dan halaman baru siap, lapisan jatuh lagi ke bawah (langit dulu, 600ms). Hanya `transform`, Web Animations API. Reduced motion, tab baru, link ke `#bagian` di halaman yang sama, situs lain dan back/forward: tanpa transisi |
| Fokus keyboard | `:focus-visible` garis 2px `navy` (di panggung navy: `on-dark`), komponen boleh punya sendiri |
| Easter egg pelangi | `html[data-rainbow]`: latar halaman dan gradasi panggung berputar melewati `hsl(<hue> 100% 77.5%)` (= `AppColor.rainbow`), satu putaran 8 detik, 24 detik saat reduced motion (sama dengan app). Teks `home-ink` di atas warna biru/ungu pelangi kontrasnya ±2: diterima karena hanya muncul kalau pengunjung sengaja menyalakannya |
