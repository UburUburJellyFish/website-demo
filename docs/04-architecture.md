# 04 · Arsitektur

## Prinsip

- **Hanya frontend.** `output: "export"` → HTML/CSS/JS statis di `out/`.
  Tidak ada database, API route, Server Action, cookie, form, login, atau analytics.
- **Dua halaman**: `/` dan `/privacy` (Privacy Policy, phase 8), + halaman 404 bawaan.
- **Satu komponen per file**, nama file = nama komponen.
- **Teks hanya di `src/content/`.** Komponen menerima teks dari sana.
- **Warna hanya lewat token** di `src/app/globals.css` (lihat `01-design-system.md`).
- **Server Component** secara default. `"use client"` hanya untuk mesin parallax, header (state menu HP),
  easter egg, dan bar bab di `/privacy` (bab aktif lewat IntersectionObserver).
- **Hanya light mode** (phase 7). Tidak ada `dark:` dan tidak ada `prefers-color-scheme`.
- Sebelum menulis kode Next.js, baca panduan di `node_modules/next/dist/docs/` (Next 16 berbeda dari versi lama).

## Struktur folder akhir

```
claire-website/
  docs/                          rencana ini
  scripts/
    optimize-images.mjs          konversi gambar ke WebP (npm run images)
    make-og-image.mjs            gambar pratinjau link (npm run og)
  assets-src/                    frame mentah dari rekaman (tidak di-commit)
  public/
    images/
      brand/                     wordmark, ikon bintang, maskot
      screens/                   screenshot app (WebP)
      feelings/                  ikon perasaan dari app
      qr/                        QR TestFlight
      device/                    bezel iPhone resmi Apple (apa adanya)
  src/
    app/
      layout.tsx                 font, metadata, skrip px-on di head
      page.tsx                   menyusun Header, ParallaxStory, FeatureSection, AboutSection, Footer
      globals.css                token warna, CSS dasar parallax, gaya teks, fokus, easter egg pelangi
      icon.png                   favicon (256×256)
      opengraph-image.png        pratinjau link 1200×630 (npm run og) + .alt.txt
      twitter-image.png          sama + .alt.txt
      robots.ts                  robots.txt (force-static)
      sitemap.ts                 sitemap.xml (kosong sampai site.url diisi)
      privacy/page.tsx           /privacy: Privacy Policy (metadata sendiri, header/footer dengan linkBase "/")
      fonts/Astonpoliz.ttf
    content/
      site.ts                    nama, tagline, metadata, nav, footer
      scenes.ts                  teks semua scene parallax
      features.ts                kartu Everything in Claire (4 grup)
      about.ts                   teks About, prinsip, tim
      privacy.ts                 teks Privacy Policy (dari audit kode app), kontak
      screens.ts                 daftar screenshot: file, alt, lebar, tinggi
      images.ts                  brand, maskot, perasaan, QR: file, alt, lebar, tinggi
    lib/
      parallax/
        types.ts
        math.ts
        compile.ts
        state.ts
        useParallax.ts
    timeline/
      claire.ts                  buildTimeline(viewport)
    components/
      layout/
        SiteHeader.tsx
        HeaderNav.tsx            client: link header + menu HP (<details>); linkBase "/" di halaman selain Home
        SiteFooter.tsx
      parallax/
        ParallaxStage.tsx
        ParallaxScene.tsx
        ParallaxDebug.tsx
        StageBackground.tsx      gradasi + lapisan warna + 3 lapis bintang + bingkai garis
      scenes/
        ParallaxStory.tsx        client: ParallaxStage + timeline Claire, scene masuk sebagai children
        IntroScene.tsx
        BurdenScene.tsx
        MeetScene.tsx
        LogScene.tsx
        TipsScene.tsx
        DoseScene.tsx
        HistoryScene.tsx
        ConnectScene.tsx
        CtaScene.tsx
      ui/
        PhoneFrame.tsx           bezel iPhone resmi + screenshot di area layarnya
        PhoneScreen.tsx          satu screenshot di dalam HP (data-px untuk crossfade)
        ClaireBubble.tsx         balon kata Claire
        LogTile.tsx              tile di scene Burden
        DeckIcon.tsx             ikon deck glucose/insulin/activity
        TipCard.tsx              kartu tips low/high
        IngredientChip.tsx       chip bahan makanan (scene log)
        StackedPhone.tsx         HP untuk halaman bertumpuk (px:hidden)
        ConnectChip.tsx          chip di scene Connect
        SceneLabel.tsx           label huruf kapital berjarak
        FeelingRow.tsx           ikon perasaan kecil di kartu History
        SkipLink.tsx             link "Skip to ..." pertama untuk keyboard (Home dan /privacy)
      privacy/                   gaya Claire (claymorphism, dirancang dengan skill UI/UX Pro Max)
        PrivacyHero.tsx          langit bintang (StarField), judul Astonpoliz, maskot + balon
        PrivacyPromise.tsx       satu dari 4 kartu clay "The short version" (warna deck, sedikit miring di lg)
        PrivacyChapterNav.tsx    client: bar bab sticky + bar progres baca (CSS scroll timeline)
        PrivacyChapter.tsx       satu bab: nomor clay, judul, balon Claire, kartu bagian
        PrivacySectionBlock.tsx  satu bagian bernomor (paragraf, daftar bintang, link luar)
        PrivacyContact.tsx       kartu kuning terakhir: maskot + tombol email
        colors.ts                warna bab/kartu (bukan komponen)
        StarField.tsx            satu lapis bintang dekorasi
      sections/
        FeatureSection.tsx
        FeatureGroup.tsx
        FeatureCard.tsx
        AboutSection.tsx
        PrincipleCard.tsx
      easter-egg/
        RainbowStar.tsx          ketuk bintang header 8 kali (jeda ≤ 2 s) → latar pelangi, 8 lagi → normal
```

Komponen lama dari setup awal (`Hero`, `FeatureList`, `FeatureCard`, `AboutSection`, `SiteHeader`, `SiteFooter`
di `src/components/`) diganti atau dipindah di phase 0 dan 6.

## Alur data

```
src/content/*.ts  ──►  scene & section components  ──►  HTML statis saat build
src/timeline/claire.ts  ──►  ParallaxStage (client)  ──►  style transform/opacity di browser
```

Tidak ada fetch, tidak ada state yang disimpan. Satu-satunya state di browser:
- posisi scroll (dibaca mesin parallax),
- menu HP terbuka/tertutup,
- easter egg pelangi (hanya selama halaman terbuka, tidak disimpan).

## Dependensi

| Paket | Status | Alasan |
|---|---|---|
| `next`, `react`, `react-dom`, `tailwindcss`, `typescript`, `eslint` | sudah ada | dasar |
| `lucide-react` | boleh ditambah (phase 0) | ikon, lisensi ISC |
| Library animasi (GSAP, Motion, Lenis, jQuery) | **tidak dipakai** | mesin parallax kita sendiri, kecil, sesuai referensi |
| Smooth scroll library | **tidak dipakai** | scroll asli browser lebih aman untuk aksesibilitas |
| `vitest` | opsional (phase 2) | tes fungsi murni `math.ts`, `compile.ts`, `state.ts` |

## Konfigurasi Next

`next.config.ts` (sudah):
- `output: "export"`
- `images.unoptimized: true` (optimasi gambar butuh server)
- **Jangan** nyalakan `cacheComponents` / `partialPrefetching`: bentrok dengan static export
  (`PPR cannot be enabled in export mode`).
- **Jangan** pakai `new Date()` di Server Component: tahun ditulis di `site.ts`.

## Perintah

```bash
npm run dev
```

```bash
npm run lint
```

```bash
npm run build
```

`npm run build` menghasilkan `out/`. Untuk melihat hasil build:

```bash
npx serve out
```
