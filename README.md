# Truth or Dare — TruODe

Web game Truth or Dare dạng lá bài. Mỗi lá gồm 2 nửa — **TRUTH** (trên) và **DARE** (dưới) — đều bị làm mờ; người chơi chạm vào từng nửa để lật. Nội dung được chọn ngẫu nhiên **phía server** từ database, client chỉ nhận đúng 1 Truth + 1 Dare mỗi lần rút.

Có 3 bộ câu hỏi, chọn qua nút chế độ (icon cạnh nút âm thanh) hoặc pill dưới nút "Rút bài". Có thể **tick nhiều bộ cùng lúc** — khi đó lá bài trộn ngẫu nhiên từ tất cả các bộ đã chọn:

| Bộ câu hỏi | Dành cho | Level |
|---|---|---|
| **Mặc định** | Bạn bè, nhóm đông người | — |
| **Couple Mode** | Cặp đôi mới quen, tìm hiểu nhau | Warm-up → Getting Closer → Deep Talk → Chemistry |
| **Dark Mode (18+)** | Cặp đôi trưởng thành, đồng thuận | Tease → Flirty → Intimate → Wild |

- Khi **chỉ chọn 1 bộ có level** (Couple hoặc Dark), màn chọn level hiện ra với lựa chọn **"Tất cả cấp độ"** ở đầu danh sách — không bắt buộc chọn 1 level cụ thể, có thể để trộn ngẫu nhiên cả 4 level.
- Khi **chọn từ 2 bộ trở lên**, bước chọn level được bỏ qua (áp dụng ngay, trộn mọi level của các bộ đã chọn).
- Dark Mode yêu cầu xác nhận 18+ một lần (lưu trong `localStorage`), nội dung gợi cảm nhưng không mô tả hành vi tình dục rõ ràng.
- Đổi lựa chọn sẽ quay về màn hình bắt đầu và xoá lịch sử lá vừa rút (vì mỗi lựa chọn có thể trỏ tới một kho câu hỏi khác nhau).

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

Schema nằm ở [db/migrations/](db/migrations/): `001_init.sql` tạo bảng `cards`, enum `card_type`/`card_difficulty`, index, trigger `updated_at` và function `get_random_card(...)`; `002_modes.sql` thêm cột `mode` (`default`/`couple`/`dark`) + `level` (1–4, bắt buộc với couple/dark, cấm với default) và cập nhật lại `get_random_card(...)` để lọc theo mode/level; `003_mode_array.sql` đổi tham số mode của `get_random_card(...)` từ 1 giá trị sang mảng `card_mode[]`, để lọc theo nhiều mode cùng lúc.

## Seed database

```bash
npm run db:seed
```

Nạp 206 lá tiếng Việt từ [src/data/seed/](src/data/seed/): 55 Truth + 55 Dare chế độ mặc định, 24 Truth + 24 Dare Couple Mode (6/level × 4 level), 24 Truth + 24 Dare Dark Mode (6/level × 4 level). Seed dùng upsert theo `id` nên chạy lại bao nhiêu lần cũng được. Khi thêm câu hỏi mới, **chỉ thêm vào cuối danh sách tương ứng** trong file nguồn ([truths.vi.ts](src/data/seed/truths.vi.ts), [coupleDares.vi.ts](src/data/seed/coupleDares.vi.ts), …) — ID được sinh theo vị trí.

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
npx playwright install chromium webkit   # lần đầu
npm run test:e2e       # E2E trên Chromium + iPhone (WebKit): luồng chơi, bàn phím, lỗi/rỗng, 10 kích thước màn hình kể cả xoay ngang
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
| `modes` | `default`/`couple`/`dark`, cách nhau bởi dấu phẩy, 1 hoặc nhiều giá trị (vd. `couple,dark`) | `default` |
| `level` | `1`–`4`; chỉ áp dụng khi `modes` có **đúng 1** giá trị và giá trị đó khác `default` — bị bỏ qua (trộn mọi level) trong mọi trường hợp khác | — |
| `category` | `fun` `friends` `couples` `party` `embarrassing` `deep` `wild` `18+` | — |
| `difficulty` | `easy` \| `medium` \| `hard` | — |
| `excludeTruth`, `excludeDare` | ID cách nhau bởi dấu phẩy (tối đa 50) | — |

```json
{
  "truth": { "id": "truth_001", "type": "truth", "content": "…", "category": "fun", "difficulty": "easy", "mode": "default", "level": null },
  "dare":  { "id": "dare_021",  "type": "dare",  "content": "…", "category": "party", "difficulty": "medium", "mode": "default", "level": null },
  "recycled": { "truth": false, "dare": false }
}
```

`recycled: true` nghĩa là mọi lá phù hợp đều đã nằm trong danh sách loại trừ, nên server chọn lại từ toàn bộ pool. Lỗi: `400 INVALID_PARAMS`, `404 EMPTY`, `500 INTERNAL` (chi tiết chỉ được ghi log phía server).

## Cấu trúc

```text
src/
├── app/                 layout (metadata/SEO), page, globals.css (design tokens), API route, OG image
├── components/          Game, GameCard, CardSection/TruthSection/DareSection, Header, StartScreen, ModeSheet, …
├── hooks/               useGame (logic + fetch), useSound (Web Audio, mặc định tắt)
├── lib/                 constants, modes (metadata 3 chế độ + level), gameReducer (state machine thuần)
├── services/            cardService (random + chống lặp), cardClient, repositories (memory | postgres)
├── data/seed/           nội dung Truth/Dare theo từng mode
├── types/               kiểu dùng chung
└── utils/               validation (zod), history, random, modePrefs (lưu mode/level/consent)
db/migrations/           SQL schema
scripts/                 migrate.ts, seed.ts
tests/unit, tests/e2e    Vitest, Playwright
```

## Lưu ý

- Nội dung của lá **đang hiển thị** nằm trong DOM (bị làm mờ bằng CSS), nên ai rành DevTools vẫn đọc trước được lá đó — nhưng không thể xem trước kho câu hỏi. Với một party game điều này chấp nhận được; PLAN.md §6 mô tả cách che chặt hơn nếu cần.
- Lịch sử 20 lá gần nhất được lưu trong `sessionStorage` nên tải lại trang cũng không lặp ngay các lá vừa rút.
