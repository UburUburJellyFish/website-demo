# 03 · Konten

Semua teks website dalam **bahasa Inggris** (sama dengan bahasa app). Penjelasan dalam bahasa Indonesia.
Di kode, teks ditaruh di `src/content/` (lihat `04-architecture.md`), bukan di komponen.

Aturan isi:
- Claire **tidak pernah** menentukan dosis insulin. Jangan ada kalimat yang terdengar seperti saran dosis.
- Saran makanan/aktivitas selalu disebut "idea" atau "tip", bukan "treatment".
- Jangan menjanjikan hasil medis ("lower your A1c", "control your diabetes").
- Data di screenshot harus data contoh (nama "Sticky"), bukan data kesehatan asli.

## Daftar semua fitur app

Diambil dari kode app (`View/`, `Service/`, `QuickLogWidget/`) dan naskah video (`Demo-Video/Script.md`).

| # | Fitur | Di app | Scene parallax | Kartu "Everything in Claire" | Screenshot |
|---|---|---|---|---|---|
| 1 | Onboarding: profil, rentang glukosa (Lowest ≥ 70, Highest ≤ 180 mg/dL, ADA 2026), insulin, kalori harian (Mifflin-St Jeor atau Katch-McArdle) | `View/Onboarding` | – | Ya | `onboarding.webp` |
| 2 | Home "Let's start the day!": bintang animasi, Last Glucose, Last Insulin, kartu highlight, Daily log | `View/Home` | `meet` | Ya | `home.webp` |
| 3 | Teks Home sesuai waktu: pertanyaan tidur, basal yang jatuh tempo, cek sebelum tidur | `Service/HomeFlow` | – | Ya | `home-basal.webp` |
| 4 | Voice log: bicara untuk mencatat, paham Inggris dan Indonesia, Claire menjawab | `View/VoiceLog`, `Service/Voice` | `log` (voice) | Ya | `voice.webp` |
| 5 | Foto makanan: bahan dan gram dari foto atau nama, gizi dari TKPI | `View/LogMeal`, `Service/MealAnalyzer` | `log` (meal) | Ya | `meal.webp` |
| 6 | Log glukosa: dibandingkan rentang sendiri, catatan "a little high" | `View/LogGlucose` | `log` (quick) | Ya | `glucose.webp` |
| 7 | Log insulin: rapid dan basal, ring insulin aktif sesuai durasi insulin pengguna, peringatan "dose still active" | `View/Insulin` | `log` (quick) | Ya | `insulin.webp` |
| 8 | Log aktivitas: jenis olahraga seperti Apple Fitness, durasi, effort | `View/Activity` | `log` (quick) | Ya | `activity.webp` |
| 9 | Pengingat cek ulang setelah gula rendah | `Service/RecheckNotifier` | `log` (quick) | Ya | – |
| 10 | Tips: rendah → camilan dulu, tinggi → jalan sebentar. Ide makan (dari log sendiri + TKPI) dan satu aktivitas sore | `Service/Recommendation` | `tips` | Ya | `tips-low.webp`, `tips-high.webp` |
| 11 | Peringatan sebelum olahraga dari pola 14 hari terakhir, bisa di-mute | `Service/Warning` | – | Ya | – |
| 12 | Claire tidak menentukan dosis | prinsip app | `dose` | Ya (di About) | – |
| 13 | History: timeline per hari, termasuk perasaan (tidur, mood) | `View/Logbook`, `Model/FeelingEntry` | `history` | Ya | `history.webp` |
| 14 | Weekly Summary: 7 hari terakhir, rentang, rata-rata per waktu (Fasting, Pre-Lunch, Pre-Dinner, Post-Lunch, Post-Dinner), pola (Apriori) | `View/Summary`, `Service/Summary` | `history` (insight) | Ya | `summary.webp` |
| 15 | Glukometer Bluetooth (Glucose Profile, mis. Accu-Chek Guide), sync otomatis | `Service/GlucoseMeterSync` | `connect` | Ya | `glucometer.webp` |
| 16 | Apple Health: workout dan tidur | `Service/HealthKitWorkoutHelper`, `SleepReader` | `connect` | Ya | – |
| 17 | Pengingat pintar ("Smart timing") yang belajar dari rutinitas | `Service/HomeFlow/ReminderTiming` | `connect` | Ya | `reminders.webp` |
| 18 | Widget: Quick Log di Home Screen (4 tombol), Last Glucose dan Last Insulin di Lock Screen | `QuickLogWidget` | `connect` | Ya | `widget.webp` |
| 19 | Easter egg: ketuk bintang di Home 8 kali → latar pelangi | `View/Home/HomeView.swift` | – | Ya (rahasia) | – |

## Metadata

| Field | Isi |
|---|---|
| `title` | Claire · Live beyond diabetes |
| `description` | Claire is a cheerful little logbook for type 1 diabetes. Log glucose, insulin, meals and activity by tapping, talking or snapping a photo. |
| Open Graph image | `public/og.png` 1200×630 (dibuat di phase 7): wordmark di latar `home-cream` dengan bintang |
| `lang` | `en` |

## Header (tetap di atas)

| Elemen | Isi |
|---|---|
| Logo | ikon bintang + "Claire" (font display) |
| Nav | Story (`#story`) · Features (`#features`) · About (`#about`) |
| Tombol | Join the beta (`#beta`) |

## Scene parallax

### 1. `intro`

| Elemen | Isi |
|---|---|
| `wordmark` | gambar `claire-wordmark.webp`, alt: "Claire, live beyond diabetes" |
| `tagline` | A cheerful little logbook for type 1 diabetes. |
| `scroll-hint` | Scroll to meet Claire ↓ |

### 2. `burden`

| Elemen | Isi |
|---|---|
| label | EVERY. SINGLE. DAY. |
| `burden-text` | Glucose checks. Insulin shots. Meals. Workouts. Writing every one of them down is a lot. |
| `relief-text` | Claire takes it from here. |

16 tile, masing-masing seperti entri log: ikon jenis, **nilai** (tebal, satu baris, ≤ 6 karakter) dan **keterangan**
(kecil, satu baris, ≤ 7 karakter). Revisi phase 8 (tulisan lama ukurannya campur dan sesak):

| Glucose (`card-glucose`) | Insulin (`card-insulin`) | Meal (`card-meal` digelapkan, teks `on-dark`) | Activity (`card-activity`) |
|---|---|---|---|
| 180 · mg/dL | 4 u · rapid | Lunch · 12:05 | 20 min · walk |
| 95 · mg/dL | 10 u · basal | 45 g · carbs | 30 min · cycling |
| 62 · low | 2 h · active? | Snack? · 15:00 | Hard · effort |
| 110 · fasting | Dose? · 21:00 | 350 · kcal | 15:00 · gym |

Urutan di grid diacak supaya warna tercampur (bukan per kolom).

### 3. `meet`

| Elemen | Isi |
|---|---|
| `star` | maskot bintang (`claire-star-main.webp`) |
| `hello` | Hi! I'm Claire. |
| label | LET'S START THE DAY! |
| `meet-text` | Every morning Claire shows your last glucose, your last insulin and a little idea to try today. |
| `phone` | `screen-home` = `home.webp` |

### 4. `log`

| Bagian | Label | Teks | Balon Claire | Layar HP |
|---|---|---|---|---|
| voice | HANDS FULL? JUST TALK. | Say what you ate or did, and Claire writes it down for you. Claire understands English and Bahasa Indonesia. | Got it! All saved. | `voice.webp` |
| meal | SNAP YOUR MEAL | Take a photo or type the dish. Claire finds the ingredients and their grams, with nutrition from TKPI, Indonesia's food composition table. | Yum, nasi goreng! | `meal.webp` |
| quick | JUST A FEW TAPS | Glucose, insulin and activity take seconds. A little high? Claire can remind you to check again. Last dose still working? Claire gives you a heads-up. | – | `glucose.webp` → `insulin.webp` → `activity.webp` |

`ingredient-1..3`: tiga chip bahan dari screenshot `meal.webp`: Nasi putih, Telur ceplok, Kerupuk udang
(daftar lengkap di `scenes.ts`). **Nama saja**: app tidak menampilkan gram (gram disimpan, tidak ditampilkan).
`deck-glucose`, `deck-insulin`, `deck-activity`: ikon dalam lingkaran warna deck, dengan label Glucose, Insulin, Activity.

### 5. `tips`

| Elemen | Isi |
|---|---|
| label | LITTLE TIPS, RIGHT ON TIME |
| `tips-text` | Ideas come from your own logs and from TKPI. |
| `card-low` (aksen `range-low`) | **Running low?** Have a snack first, then check again. |
| `card-high` (aksen `range-high`) | **Running high?** Maybe a short walk. |
| `phone` | `tips-low.webp` |

### 6. `dose`

| Elemen | Isi |
|---|---|
| `dose-statement` | Your dose, your call. |
| `dose-sub` | Claire never picks your insulin dose. That stays between you and your doctor. |

### 7. `history`

| Bagian | Label | Teks | Balon |
|---|---|---|---|
| history | YOUR DAYS AT A GLANCE | Look back on any day: checks, doses, meals, workouts and how you slept. | – |
| insight | WEEKLY INSIGHTS | At the end of the week, Claire puts it all together: your glucose range, your averages by time of day and a few patterns worth knowing. | Here's what I noticed this week. |

Dinding HP: 3 kolom × 3 HP berisi `history.webp`, `summary.webp`, `home.webp`, `glucose.webp`, `insulin.webp`,
`meal.webp`, `activity.webp`, `voice.webp`, `reminders.webp`. `wall-hero` = `summary.webp`.

### 8. `connect`

| Elemen | Isi |
|---|---|
| label | CONNECT & LOG FAST |
| `chip-glucometer` | **Bluetooth glucometer.** Readings sync on their own. |
| `chip-health` | **Apple Health.** Workouts and sleep come in by themselves. |
| `chip-reminders` | **Smart reminders.** They learn your routine. |
| `chip-widgets` | **Widgets.** Log from your Home Screen. See your last glucose and insulin on your Lock Screen. |
| `phone` | `widget.webp` |

### 9. `cta`

| Elemen | Isi |
|---|---|
| judul | Claire is in beta on TestFlight. |
| teks | Scan the code with your iPhone, or tap the button. |
| teks (mobile, QR disembunyikan) | Tap the button to join on your iPhone. |
| tombol | Join the beta → `https://testflight.apple.com/join/utWcPjDc` (dari QR, dikonfirmasi Aaron) |
| `qr-card` | `claire-qr.webp` (dari `QR-TestFlight/Claire-QR-3-Peek.png`) |
| kecil | iPhone only. Requires iOS 26 or later. |
| balon Claire | See you there! |

## Bagian biasa (setelah parallax)

### `#features` · Everything in Claire

Judul: **Everything in Claire**
Sub: Built for people who use insulin pens and a glucometer every day.

Kartu dikelompokkan dalam 4 grup:

**Log**

| Kartu | Teks |
|---|---|
| Talk to log | Say it out loud in English or Bahasa Indonesia. Claire fills in the log and reads it back to you. |
| Snap your meal | A photo or a dish name is enough. Claire lists the ingredients and their grams, with nutrition from TKPI. |
| Glucose | Every check is compared with your own range, so a high or low stands out right away. |
| Insulin | Log rapid and basal doses. A ring shows how long your last dose keeps working, based on your insulin. |
| Activity | Pick a workout, how long and how hard. Workouts from Apple Health come in too. |

**Every day**

| Kartu | Teks |
|---|---|
| Let's start the day | Your last glucose, your last insulin and one idea for today, on one calm screen. |
| Right on time | Claire asks how you slept in the morning, reminds you when a basal dose is due and checks in at bedtime. |
| Little tips | Running low? A snack first. Running high? Maybe a short walk. Meal and activity ideas come from what worked for you. |
| Check again | After a low, Claire reminds you to check again. |
| Workout heads-up | If a workout like this one ended low before, Claire gives you a heads-up. You can mute it any time. |

**Look back**

| Kartu | Teks |
|---|---|
| History | Every day on one timeline: checks, doses, meals, workouts and how you felt. |
| Weekly summary | Your glucose range, averages for fasting, before and after meals, and patterns from the last seven days. |

**Connect**

| Kartu | Teks |
|---|---|
| Bluetooth glucometer | Meters with the standard Bluetooth Glucose Profile sync their readings to Claire. |
| Apple Health | Workouts and sleep come in from Apple Health. |
| Smart reminders | Reminders move to the times you usually eat, work out and go to bed. Or keep the default times. |
| Widgets | Quick Log on your Home Screen. Last glucose and insulin on your Lock Screen. |
| Quick setup | Tell Claire your glucose range, your insulins and your daily calories in a few steps. |
| A little secret | There's a surprise hidden on Home. Can you find it? |

### `#about` · About Claire

**Judul:** About Claire

**Paragraf 1:** Claire started with conversations with people who live with type 1 diabetes and use insulin pens
and a glucometer every day. Many told us logging felt like homework. So we built a logbook that is quick,
friendly and on your side.

**Paragraf 2:** Our mission is in our name tag: live beyond diabetes. Less time writing things down, more time living.

**Tiga prinsip** (tiga kartu kecil):

| Judul | Teks |
|---|---|
| Your dose, your call | Claire never picks your insulin dose. That stays between you and your doctor. |
| Built on your own logs | Tips and patterns come from your own days, not from a one-size-fits-all rule. |
| Friendly, not clinical | A cheerful star, plain words and as few taps as possible. |

**Tim:** Claire is made by the UburUbur team at Apple Developer Academy @ UC Surabaya.
Daftar anggota: `[nama anggota tim]` (**belum ada, lihat Perlu konfirmasi**).

**Privasi** (**konfirmasi dulu dengan tim sebelum ditampilkan**):
Your logs are kept on your iPhone. Meal photos and descriptions are sent to Google Gemini to find the
ingredients. This website doesn't collect any data.

### Footer

| Elemen | Isi |
|---|---|
| Disclaimer | Claire helps you keep track. It does not replace advice from your doctor. |
| Link | Story · Features · About · Join the beta |
| Hak cipta | © 2026 Claire · UburUbur Team |
| Merek | Apple, iPhone, Apple Health and TestFlight are trademarks of Apple Inc. |

### `/privacy` · Privacy Policy (phase 8)

Halaman sendiri untuk **Privacy Policy URL** di App Store Connect. Teks lengkap di `src/content/privacy.ts`.
Tata letak **gaya Claire, sengaja berbeda dari referensi website teman** (revisi Aaron): hero langit bintang dengan
maskot dan balon "Hi! Here's how I keep your logbook yours.", "The short version" = 4 kartu clay warna deck, lalu
14 bagian dalam **4 bab** dengan ringkasan satu kalimat di balon Claire:

| Bab | Warna | Bagian |
|---|---|---|
| 1 What stays on your iPhone | `card-glucose` | 1 Information we collect, 2 Data stored on your iPhone, 3 Apple Health, 4 Bluetooth glucometer, 5 Tips, insights and reminders |
| 2 What leaves your iPhone | `card-insulin` | 6 Meal analysis with Google Gemini, 7 Voice log |
| 3 Your choices | `card-activity` | 8 Permissions, 9 Keeping and deleting your data |
| 4 The fine print | `home-star` | 10 Data sharing, 11 Analytics, tracking and ads, 12 This website, 13 Changes to this policy, 14 Contact us |

Rujukan di teks memakai nomor baru ("section 6" = Gemini).

Isi berasal dari audit kode app (2026-11-25, repo app hanya dibaca):

| Hal | Temuan di kode | Di policy |
|---|---|---|
| Koneksi internet | Hanya `generativelanguage.googleapis.com` (Gemini) di `Service/GeminiClient.swift` | Bagian 3 |
| Yang dikirim ke Gemini | Foto makanan (dikompres), nama makanan, bahan yang diketik (`MealAnalyzer.prompt`). Tanpa profil/glukosa/insulin | Bagian 3 |
| Kapan dikirim | Tombol "Find ingredients", saat menyimpan makanan, atau saat makanan yang sudah dianalisis diubah (`MealLogViewModel`) | Bagian 3 |
| Penyimpanan | SwiftData di iPhone, App Group `group.com.uburuburjellyfish.t1d.shared` untuk widget, tanpa CloudKit/iCloud | Bagian 2 |
| Profil | nama, tanggal lahir, gender, tinggi, berat, body fat, leher, pinggang, pinggul, kalori, satuan & rentang glukosa (`Model/User.swift`) | Bagian 2 |
| Suara | `SFSpeechRecognizer`, on-device kalau model bahasa tersedia; teks dibaca Foundation Models (on-device); rekaman tidak disimpan | Bagian 4 |
| Apple Health | baca saja: workout, active energy, sleep (`HealthKitWorkoutHelper`, `SleepReader`) | Bagian 5 |
| Bluetooth | Glucose Profile 0x1808 (`GlucoseMeterSync`) | Bagian 6 |
| Notifikasi | lokal (`UNUserNotificationCenter`) | Bagian 7 |
| Izin | kamera, mikrofon, speech, Health, Bluetooth (Info.plist), Photos lewat `PhotosPicker` | Bagian 8 |
| Analytics/SDK | tidak ada (hanya framework Apple + REST Gemini) | Bagian 10 |
| Kontak | email Aaron (dipilih Aaron) | Bagian 14 |

Perlu dicek tim sebelum submit: paket Gemini API yang dipakai (gratis atau berbayar menentukan bagaimana Google boleh
memakai data, dan jawaban label **App Privacy** di App Store Connect), dan apakah app punya tombol hapus semua data.

## Perlu konfirmasi

| Hal | Kenapa | Siapa |
|---|---|---|
| Versi iOS minimum | Project berisi target iOS 26.0 | Aaron |
| Domain website | Isi `site.url` di `src/content/site.ts`. Sebelum diisi: `og:image` menunjuk ke `localhost:3000` (Next memberi peringatan saat build), `sitemap.xml` kosong, `robots.txt` tanpa baris Sitemap. **Wajib sebelum rilis (phase 8)** | Aaron |
| Video promo | Phase 7 selesai tanpa video. Mau dipasang di bawah About atau tidak (`05-assets.md`) | Aaron |
| Kalimat privasi | Harus benar. App memakai penyimpanan lokal dan mengirim foto makanan ke Gemini. Halaman `/privacy` sudah ditulis dari audit kode (phase 8); kalimat pendek di About masih disembunyikan | Tim |
| Paket Gemini API | Gratis atau berbayar: memengaruhi isi label App Privacy di App Store Connect | Tim |
| Support URL | Wajib di App Store Connect; website belum punya halaman Support | Aaron |
| Nama anggota tim | Untuk bagian About | Tim |
| Menyebut "Accu-Chek Guide" | Boleh disebut sebagai contoh yang sudah dites, atau cukup "standard Bluetooth Glucose Profile" | Tim |
| Easter egg dirahasiakan | Kartu "A little secret" sengaja tidak memberi tahu caranya | Aaron |
