# Truth or Dare — TruODe

Web game Truth or Dare dạng lá bài. Mỗi lá gồm 2 nửa — **TRUTH** (trên) và **DARE** (dưới) — đều bị làm mờ; người chơi chạm vào từng nửa để lật. Nội dung được chọn ngẫu nhiên **phía server** từ database, client chỉ nhận đúng 1 Truth + 1 Dare mỗi lần rút.

Stack: Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · PostgreSQL · Vitest · Playwright.

Kế hoạch và các quyết định thiết kế: xem [PLAN.md](PLAN.md).

---

## Installation

Yêu cầu: Node.js ≥ 20.

```bash
npm install
```

## Environment variables

Sao chép file mẫu rồi chỉnh sửa:

```bash
cp .env.example .env.local
```

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `CARD_SOURCE` | không (mặc định `memory`) | `memory` — dùng seed có sẵn, không cần database. `postgres` — dùng database thật. |
| `DATABASE_URL` | khi `CARD_SOURCE=postgres` | Chuỗi kết nối Postgres. **Chỉ dùng phía server** — không bao giờ đặt tiền tố `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SITE_URL` | khuyến nghị khi deploy | URL công khai của site, dùng để tạo link ảnh Open Graph tuyệt đối. |

Ở chế độ `memory`, việc chọn bài vẫn chạy trên server nên client không bao giờ nhận toàn bộ kho câu hỏi.

## Database setup

Bỏ qua bước này nếu dùng `CARD_SOURCE=memory`.

**Cách 1 — Docker (local):**

```bash
npm run db:up          # Postgres 17 tại localhost:5433, user/password/db = truode
```

`DATABASE_URL=postgres://truode:truode@localhost:5433/truode` (cổng 5433 để không trùng PostgreSQL cài sẵn trên máy ở 5432)

**Cách 2 — Supabase:** tạo project, lấy *Connection string (URI)* tại *Project Settings → Database* và đặt vào `DATABASE_URL`. Migration bật Row Level Security cho bảng `cards` và không tạo policy nào, nên client không thể đọc bảng trực tiếp bằng anon key.

**Cách 3 — Postgres có sẵn:** tạo một database trống và trỏ `DATABASE_URL` vào đó.

Sau đó chạy migration (an toàn khi chạy lại — các file đã áp dụng được ghi vào bảng `schema_migrations`):

```bash
npm run db:migrate
```

Schema nằm ở [db/migrations/001_init.sql](db/migrations/001_init.sql): bảng `cards`, enum `card_type`/`card_difficulty`, index cho truy vấn random, trigger `updated_at`, và function `get_random_card(...)`.

## Seed database

```bash
npm run db:seed
```

Nạp 55 Truth + 55 Dare tiếng Việt từ [src/data/seed/](src/data/seed/). Seed dùng upsert theo `id` nên chạy lại bao nhiêu lần cũng được. Khi thêm câu hỏi mới, **chỉ thêm vào cuối danh sách** — ID được sinh theo vị trí (`truth_001`, …).

Rồi đặt `CARD_SOURCE=postgres` trong `.env.local`.

## Development

```bash
npm run dev            # http://localhost:3000
```

Kiểm tra chất lượng:

```bash
npm run typecheck      # tsc --noEmit
npm run lint
npm test               # unit test (Vitest)
npx playwright install chromium   # lần đầu
npm run test:e2e       # E2E: luồng chơi, bàn phím, lỗi/rỗng, 6 kích thước màn hình
```

## Production build

```bash
npm run build
npm start              # cổng 3000; đổi bằng: npx next start -p 8080
```

Đặt `CARD_SOURCE`, `DATABASE_URL` và `NEXT_PUBLIC_SITE_URL` trong môi trường của nơi deploy.

---

## API

`GET /api/cards/random`

| Query | Giá trị | Mặc định |
|---|---|---|
| `language` | `vi` \| `en` | `vi` |
| `category` | `fun` `friends` `couples` `party` `embarrassing` `deep` `wild` `18+` | — |
| `difficulty` | `easy` \| `medium` \| `hard` | — |
| `excludeTruth`, `excludeDare` | ID cách nhau bởi dấu phẩy (tối đa 50) | — |

```json
{
  "truth": { "id": "truth_001", "type": "truth", "content": "…", "category": "fun", "difficulty": "easy" },
  "dare":  { "id": "dare_021",  "type": "dare",  "content": "…", "category": "party", "difficulty": "medium" },
  "recycled": { "truth": false, "dare": false }
}
```

`recycled: true` nghĩa là mọi lá phù hợp đều đã nằm trong danh sách loại trừ, nên server chọn lại từ toàn bộ pool. Lỗi: `400 INVALID_PARAMS`, `404 EMPTY`, `500 INTERNAL` (chi tiết chỉ được ghi log phía server).

## Cấu trúc

```text
src/
├── app/                 layout (metadata/SEO), page, globals.css (design tokens), API route, OG image
├── components/          Game, GameCard, CardSection/TruthSection/DareSection, Header, StartScreen, …
├── hooks/               useGame (logic + fetch), useSound (Web Audio, mặc định tắt)
├── lib/                 constants, gameReducer (state machine thuần)
├── services/            cardService (random + chống lặp), cardClient, repositories (memory | postgres)
├── data/seed/           nội dung Truth/Dare
├── types/               kiểu dùng chung
└── utils/               validation (zod), history, random
db/migrations/           SQL schema
scripts/                 migrate.ts, seed.ts
tests/unit, tests/e2e    Vitest, Playwright
```

## Lưu ý

- Nội dung của lá **đang hiển thị** nằm trong DOM (bị làm mờ bằng CSS), nên ai rành DevTools vẫn đọc trước được lá đó — nhưng không thể xem trước kho câu hỏi. Với một party game điều này chấp nhận được; PLAN.md §6 mô tả cách che chặt hơn nếu cần.
- Lịch sử 20 lá gần nhất được lưu trong `sessionStorage` nên tải lại trang cũng không lặp ngay các lá vừa rút.
