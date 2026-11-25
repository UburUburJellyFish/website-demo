# Phase 2 · Mesin parallax

## Tujuan

Mesin parallax sendiri yang bekerja seperti referensi davegamache.com/parallax, plus perbaikannya
(mobile, resize, scroll cepat, reduced motion, panggung sticky). Diuji dengan **dua scene dummy**.

## Prasyarat

- Phase 0 selesai (token warna).
- Phase 1 tidak wajib.

## Baca dulu

- `docs/02-parallax.md` bagian 1–4 (wajib, semua)
- `node_modules/next/dist/docs/` tentang Client Components dan cara menaruh skrip di `<head>`

## Tugas

### Fungsi murni

- [x] `types.ts`: tipe persis seperti di `02-parallax.md` + `ColorToken` (union nama token dari `globals.css`).
- [x] `math.ts`: `ease(t)` kosinus, `lerp`, `lerpColor(hexA, hexB, t)`, `toPx(length, viewport)`, `clamp`.
- [x] `compile.ts`: `compileTimeline(keyframes, viewport)` → `{ keyframes (px), starts[], total, byTarget }`.
      `byTarget` = untuk tiap `data-px`, daftar `(index keyframe, animasi)`.
- [x] `state.ts`: `stateAt(compiled, position)` → `{ index, progress, targets: Map<target, {x,y,scale,rotate,opacity}>,
      background, tone, scene }`. Aturan nilai tunggal = dari nilai terakhir elemen itu. Opacity di-clamp 0–1
      setelah interpolasi.
- [ ] (Opsional, **dilewati**) `vitest` + tes: ease(0)=0, ease(0.5)=0.5, ease(1)=1; nilai tunggal mengikuti nilai sebelumnya;
      lompat dari keyframe 1 ke 5 menghasilkan nilai akhir keyframe 2–4; total = jumlah durasi.

### Hook dan komponen

- [x] `useParallax.ts`: mulai hanya kalau `<html>` punya class `px-on`. Pasang event `scroll` (pasif) +
      satu `requestAnimationFrame`, `resize` (debounce 150ms, abaikan perubahan tinggi < 15% di perangkat sentuh),
      `focusin`, dan perubahan `prefers-reduced-motion`. Tulis style langsung ke elemen, hanya kalau nilai berubah.
      Kembalikan `scrollToAnchor(id)`.
- [x] `ParallaxStage.tsx` (`"use client"`): wadah setinggi `total + 100svh`, isi `div` sticky `100svh`,
      `StageBackground`, scene-scene sebagai children. Header memakai `goToAnchor()` / link `#hash` (bukan context).
- [x] `ParallaxScene.tsx`: `<section data-scene={id} aria-labelledby=...>`.
- [x] `StageBackground.tsx`: gradasi `home-background` → `home-cream`, bingkai garis `--frame-line` 10px dari tepi,
      slot 3 `StarField` (`stars-far`, `stars-mid`, `stars-near`) dengan `data-px`.
- [x] `StarField.tsx`: bintang kecil SVG berwarna `home-star` / `highlight-chart`, posisi tetap (bukan random tiap load).
- [x] `ParallaxDebug.tsx`: overlay kalau URL punya `?px-debug`.
- [x] Skrip `px-on` di `<head>` lewat `layout.tsx` (inline `<script>`, bukan `next/script`) + `suppressHydrationWarning`.
- [x] CSS dasar di `globals.css`: scene bertumpuk biasa tanpa `px-on`; `absolute` + `data-active` dengan `px-on`;
      `data-tone="dark"` mengganti warna teks dan header ke `home-cream`.

### Uji coba

- [x] `src/timeline/claire.ts` sementara berisi 2 scene dummy:
      `demo-a` (judul naik dan memudar, 100vh) dan `demo-b` (grid 4×4 meledak, 150vh + jeda 50vh),
      plus perubahan latar `home-cream` → `voice-top` dan `tone: "dark"`.
- [x] Pasang di `page.tsx` di atas konten lama. Konten lama harus tetap muncul **setelah** parallax selesai.

## Selesai jika

- [x] Scroll pelan dan cepat: elemen selalu di posisi yang benar, tidak ada yang nyangkut setengah jalan.
- [x] Resize jendela di tengah scene: posisi scroll tetap di scene yang sama, tidak ada error.
- [x] Mobile (375×812): jalan, tidak ada scroll horizontal.
- [x] `prefers-reduced-motion: reduce`: tidak ada gerakan, semua scene tampil bertumpuk dan terbaca (diuji dengan
      matchMedia dipalsukan, browser pane tidak punya emulasi reduced motion).
- [x] JS dimatikan: semua teks scene tetap tampil bertumpuk.
- [x] Tab dengan keyboard ke link di scene yang belum aktif: halaman lompat ke scene itu.
- [x] `?px-debug` menampilkan keyframe, progres, dan scrollY.
- [x] Performa: diukur lewat skrip di build produksi (median 8,3 ms/frame, 0 long task, 0 layout shift), bukan
      Performance panel. Engine hanya menulis `transform`/`opacity` (+ warna latar).
- [x] `npm run lint` dan `npm run build` lolos, tidak ada hydration warning di console.

## Cara cek

Built-in browser / Chrome DevTools:
- Rendering → Emulate CSS `prefers-reduced-motion`.
- Settings → Debugger → Disable JavaScript.
- Device toolbar → iPhone 12 Pro.

## Bukan bagian phase ini

Scene Claire yang sebenarnya (phase 3–5), header nav (phase 6).
