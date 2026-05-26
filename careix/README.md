# Careix — Sanal evcil hayvan (taslak)

Web taslak uygulama: kayıt/giriş, hayvan seçimi, isim verme, besleme/oyun/temizlik/dinlenme aksiyonları. UI wireframe; tasarımlar sonra `apps/web/src/styles/` ve bileşenlere entegre edilecek.

## Gereksinimler

- Node.js 20+
- npm 10+

## Kurulum

```bash
cd careix
npm install
npm run build -w @careix/shared
```

API ortam dosyası:

```bash
copy apps\api\.env.example apps\api\.env
```

Veritabanı (SQLite, varsayılan):

```bash
npm run db:generate
npm run db:migrate
```

İlk migration adı sorulursa `init` yazıp Enter'a basın.

## Çalıştırma

İki terminal:

```bash
# Terminal 1 — API (http://localhost:3001)
npm run dev:api

# Terminal 2 — Web (http://localhost:5173)
npm run dev:web
```

Web, `/api` isteklerini Vite proxy ile API'ye yönlendirir.

## API uçları

| Method | Path | Açıklama |
|--------|------|----------|
| POST | `/auth/register` | Kayıt |
| POST | `/auth/login` | Giriş |
| GET | `/auth/me` | Oturum + pet |
| POST | `/pets` | Pet oluştur `{ species, name }` |
| GET | `/pets/current` | Güncel statlar |
| POST | `/pets/actions/:action` | `feed`, `play`, `clean`, `rest` |

## Manuel test checklist

1. http://localhost:5173/register — yeni hesap
2. Hayvan seç (ör. Kuş) → isim ver → ana ekran
3. Besle / Oyna — stat çubukları değişmeli
4. Çıkış → tekrar giriş — pet ve statlar kalmalı
5. Yeni kullanıcıda pet yoksa `/onboarding` açılmalı

## PostgreSQL (opsiyonel)

```bash
docker compose up -d
```

`apps/api/prisma/schema.prisma` içinde `provider = "postgresql"` ve `.env`:

```
DATABASE_URL="postgresql://careix:careix@localhost:5432/careix"
```

Sonra `npm run db:migrate`.

## Mobil (Phase 2)

`apps/mobile` (Expo) henüz yok. `@careix/shared` ve aynı REST API kullanılacak.

## Proje yapısı

```
careix/
  apps/api/     Express + Prisma + JWT
  apps/web/     React + Vite wireframe
  packages/shared/  Ortak tipler ve species config
```
