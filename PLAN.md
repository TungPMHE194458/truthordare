# TruODe — Kế hoạch dự án Truth or Dare Card Game

> Tài liệu kế hoạch cho MVP. Đây là nguồn tham chiếu chính khi triển khai: mọi quyết định kiến trúc, schema, API, UI và tiêu chí nghiệm thu đều nằm ở đây.

---

## 1. Tổng quan

Web game **Truth or Dare** dạng lá bài. Người chơi rút một lá bài ngẫu nhiên, lá bài chia làm 2 nửa:

- **Nửa trên — TRUTH (Sự thật)**
- **Nửa dưới — DARE (Thử thách)**

Cả hai nửa bị **làm mờ (blur)** khi lá bài xuất hiện. Người chơi chạm vào từng nửa để lật nội dung tương ứng; nửa kia vẫn mờ. Nội dung lấy ngẫu nhiên **từ database, phía server**.

**Trải nghiệm mong muốn:** mở web → muốn bấm *Rút bài* ngay → thấy một lá bài bí ẩn → tò mò chạm Truth/Dare → nội dung hiện ra mượt mà → muốn chơi tiếp.

**Thứ tự ưu tiên:** Vui → Đơn giản → Nhanh → Đẹp → Mobile-first → Tương tác mượt.

---

## 2. Phạm vi MVP

### Có trong MVP

- [ ] Một màn hình game duy nhất (start → chơi)
- [ ] Rút bài ngẫu nhiên (1 Truth + 1 Dare) từ server
- [ ] Truth và Dare bị blur ban đầu, chạm để reveal từng phần
- [ ] Nút **Lá mới** — reset trạng thái reveal
- [ ] Chống lặp bài gần đây (recent history)
- [ ] Database + schema + seed (≥ 50 Truth, ≥ 50 Dare, tiếng Việt)
- [ ] Loading / Error / Empty state
- [ ] Responsive (320px → 1440px), không cần cuộn trên mobile
- [ ] Animation bằng CSS, bật/tắt âm thanh (mặc định tắt)
- [ ] Accessibility (bàn phím, focus, screen reader)
- [ ] SEO metadata + Open Graph
- [ ] README + `.env.example`

### Không có trong MVP

Login, thanh toán, admin, multiplayer, chat, mạng xã hội, custom cards. Kiến trúc vẫn phải cho phép thêm sau (xem §15).

---

## 3. Tech stack

| Lớp | Lựa chọn | Lý do |
|---|---|---|
| Framework | **Next.js (App Router)** + **React** | API Route Handler sẵn có, SSR metadata cho SEO |
| Ngôn ngữ | **TypeScript** (`strict: true`) | An toàn kiểu |
| Styling | **Tailwind CSS** + CSS variables (design tokens) | Nhẹ, nhanh, mobile-first |
| Animation | **CSS thuần** (keyframes + transition) | Không cần thư viện animation nặng |
| Icon | `lucide-react` (tree-shaken) | Nhẹ, chỉ import icon dùng tới |
| Validation | `zod` | Validate query params và dữ liệu từ DB |
| Database | **PostgreSQL** (Supabase hoặc Docker local) | Production-ready, random query phía DB |
| DB driver | `postgres` (porsager) qua `DATABASE_URL` | Chạy được với Supabase hoặc Postgres bất kỳ |
| Âm thanh | Web Audio API (tạo tone bằng code) | Không cần tải file âm thanh |
| Test | **Vitest** (logic) + **Playwright** (E2E + viewport) | |

**Data source có thể chuyển đổi** qua biến môi trường `CARD_SOURCE`:

- `postgres` — dùng database thật (production).
- `memory` — đọc seed ngay trên server, không cần cài DB (dev/demo nhanh). Vẫn random **phía server**, client không nhận toàn bộ dữ liệu.

---

## 4. Kiến trúc

```text
UI (components)
   ↓  gọi hook
Game Logic (useGame + gameReducer)          ← client
   ↓  fetch GET /api/cards/random
API Route Handler (validate params)         ← server
   ↓
Card Service (random + loại trừ history)
   ↓  interface CardRepository
Repository: PostgresCardRepository | MemoryCardRepository
   ↓
Database (Postgres)
```

Nguyên tắc:

- UI **không** biết dữ liệu đến từ đâu; chỉ gọi `useGame`.
- Logic game là **reducer thuần** → test được không cần render.
- Service chỉ làm việc qua `CardRepository` interface → đổi DB không ảnh hưởng tầng trên.
- Không hard-code nội dung trong component. Không có magic number — gom vào `src/lib/constants.ts`.

### Cấu trúc thư mục

```text
TruODe/
├── db/
│   └── migrations/
│       └── 001_init.sql              # enum, bảng cards, index, function random
├── scripts/
│   ├── migrate.ts                    # chạy các file SQL migration
│   └── seed.ts                       # upsert seed vào Postgres
├── src/
│   ├── app/
│   │   ├── layout.tsx                # font, metadata, OG
│   │   ├── page.tsx                  # GamePage
│   │   ├── globals.css               # design tokens + keyframes
│   │   └── api/cards/random/route.ts # GET /api/cards/random
│   ├── components/
│   │   ├── Header.tsx                # logo + nút âm thanh
│   │   ├── StartScreen.tsx           # "Sẵn sàng?" + nút Rút bài
│   │   ├── GameCard.tsx              # khung lá bài, ghép 2 nửa
│   │   ├── CardSection.tsx           # nửa bài dùng chung (blur/reveal)
│   │   ├── TruthSection.tsx          # wrapper của CardSection, variant truth
│   │   ├── DareSection.tsx           # wrapper của CardSection, variant dare
│   │   ├── NewCardButton.tsx
│   │   ├── CardSkeleton.tsx          # loading "Đang rút bài..."
│   │   ├── ErrorState.tsx
│   │   └── EmptyState.tsx
│   ├── hooks/
│   │   ├── useGame.ts                # drawCard, revealTruth, revealDare, drawNewCard, resetGame
│   │   └── useSound.ts               # bật/tắt + phát tone
│   ├── lib/
│   │   ├── constants.ts              # HISTORY_SIZE, thời lượng animation, BLUR_PX...
│   │   └── gameReducer.ts            # state machine thuần
│   ├── services/
│   │   ├── cardService.ts            # getRandomPair(filters, exclude)
│   │   ├── cardClient.ts             # fetch phía client, map lỗi
│   │   └── repositories/
│   │       ├── CardRepository.ts     # interface
│   │       ├── postgresCardRepository.ts
│   │       └── memoryCardRepository.ts
│   ├── data/seed/
│   │   ├── truths.vi.ts
│   │   └── dares.vi.ts
│   ├── types/
│   │   └── game.ts                   # Card, CardType, GameState, ApiResponse
│   └── utils/
│       ├── random.ts                 # pickRandom (crypto.randomInt) cho memory repo
│       ├── history.ts                # ring buffer recent IDs
│       └── validation.ts             # zod schemas
├── tests/
│   ├── unit/                         # reducer, history, random, validation, service
│   └── e2e/                          # Playwright flows + viewport
├── .env.example
├── README.md
└── PLAN.md
```

---

## 5. Database

### Schema (`db/migrations/001_init.sql`)

```sql
create type card_type as enum ('truth', 'dare');
create type card_difficulty as enum ('easy', 'medium', 'hard');

create table cards (
  id          text primary key,                 -- 'truth_001', 'dare_021'
  type        card_type not null,
  content     text not null check (length(btrim(content)) > 0),
  category    text not null default 'fun',      -- fun | friends | couples | party | embarrassing | deep | wild | 18+
  difficulty  card_difficulty not null default 'easy',
  language    text not null default 'vi',       -- vi | en
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index phục vụ truy vấn random theo bộ lọc
create index cards_lookup_idx
  on cards (type, language, category, difficulty)
  where is_active;

-- Tự cập nhật updated_at
create function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger cards_set_updated_at
  before update on cards
  for each row execute function set_updated_at();
```

### Truy vấn random

```sql
create function get_random_card(
  p_type       card_type,
  p_language   text,
  p_category   text            default null,
  p_difficulty card_difficulty default null,
  p_exclude    text[]          default '{}'
) returns setof cards language sql stable as $$
  select * from cards
  where type = p_type
    and is_active
    and language = p_language
    and (p_category   is null or category   = p_category)
    and (p_difficulty is null or difficulty = p_difficulty)
    and not (id = any(p_exclude))
  order by random()
  limit 1;
$$;
```

**Về hiệu năng:** `order by random()` quét toàn bộ tập đã lọc — ổn với vài chục nghìn bản ghi (MVP chỉ ~100). Khi dữ liệu lớn, chuyển sang cột `random_key double precision` có index: `where random_key >= random() order by random_key limit 1` (kèm wrap-around nếu không có kết quả). Thay đổi này chỉ nằm trong repository, không ảnh hưởng API.

### Bảo mật DB

- `DATABASE_URL` **chỉ dùng phía server** (không có tiền tố `NEXT_PUBLIC_`).
- Nếu dùng Supabase: bật RLS trên `cards`, không tạo policy cho `anon` → client không thể query trực tiếp.
- Khuyến nghị dùng role Postgres chỉ có quyền `SELECT` + `EXECUTE get_random_card` cho app runtime; role đầy đủ chỉ dùng khi migrate/seed.

### Seed data

- **≥ 50 Truth + ≥ 50 Dare**, tiếng Việt tự nhiên, vui, dễ hiểu, hợp chơi nhóm.
- Phân bổ category (dự kiến cho mỗi loại): `fun` ~15, `friends` ~10, `party` ~10, `embarrassing` ~8, `deep` ~7, `couples` ~5.
- Phân bổ difficulty: ~50% easy, ~35% medium, ~15% hard.
- **Không** có nội dung vi phạm pháp luật, nguy hiểm, tự gây hại, đồ uống có cồn bắt buộc, hay ép buộc tiếp xúc thân thể. Category `18+` và `wild` để trống trong MVP (chỉ chuẩn bị schema).
- ID ổn định (`truth_001`…) → `seed.ts` dùng `insert ... on conflict (id) do update` để chạy lại an toàn.

---

## 6. API

### `GET /api/cards/random`

**Query params** (validate bằng zod):

| Param | Kiểu | Mặc định | Ghi chú |
|---|---|---|---|
| `language` | `vi` \| `en` | `vi` | |
| `category` | string | — | tùy chọn |
| `difficulty` | `easy` \| `medium` \| `hard` | — | tùy chọn |
| `excludeTruth` | danh sách ID cách nhau bởi dấu phẩy | — | tối đa `MAX_EXCLUDE` (50) |
| `excludeDare` | như trên | — | |

**200 OK**

```json
{
  "truth":  { "id": "truth_001", "content": "...", "category": "fun", "difficulty": "easy" },
  "dare":   { "id": "dare_021",  "content": "...", "category": "party", "difficulty": "medium" },
  "recycled": { "truth": false, "dare": false }
}
```

`recycled = true` nghĩa là pool sau khi loại trừ đã hết, server đã chọn lại từ toàn bộ pool → client xóa history của loại đó.

**Lỗi** (không bao giờ trả stack trace):

| Status | Body | Khi nào |
|---|---|---|
| 400 | `{ "error": "INVALID_PARAMS" }` | params sai |
| 404 | `{ "error": "EMPTY" }` | không có bài nào khớp bộ lọc (kể cả khi bỏ exclude) |
| 500 | `{ "error": "INTERNAL" }` | lỗi DB/không xác định (log chi tiết phía server) |

**Header:** `Cache-Control: no-store`; route đặt `dynamic = 'force-dynamic'` để không bị cache kết quả random.

### Logic trong `cardService.getRandomPair`

```text
Song song cho truth & dare:
  1. repo.getRandom(type, filters, exclude)
  2. Không có kết quả & exclude không rỗng → thử lại với exclude = [] → recycled = true
  3. Vẫn không có → EmptyError
Validate bản ghi bằng zod (content không rỗng, type đúng, is_active) trước khi trả về
```

### Lưu ý về "bí mật" nội dung

Random chạy trên server và client chỉ nhận **đúng 1 Truth + 1 Dare** → không thể xem trước toàn bộ kho câu hỏi. Tuy nhiên nội dung của lá bài **hiện tại** nằm trong DOM (bị blur bằng CSS), người rành DevTools vẫn đọc được. Với party game điều này chấp nhận được. Nếu sau này cần chặt hơn: API chỉ trả ID khi rút bài, nội dung lấy qua `GET /api/cards/:id` lúc reveal.

---

## 7. Game logic

### State (`src/types/game.ts`)

```ts
type CardType = 'truth' | 'dare';

type Card = {
  id: string;
  type: CardType;
  content: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

type GameStatus = 'idle' | 'loading' | 'ready' | 'error' | 'empty';

type GameState = {
  status: GameStatus;
  currentTruth: Card | null;
  currentDare: Card | null;
  truthRevealed: boolean;
  dareRevealed: boolean;
  history: { truth: string[]; dare: string[] }; // ring buffer, tối đa HISTORY_SIZE
  round: number;                                 // hiển thị "Lá #12"
};
```

### Reducer actions

| Action | Tác dụng |
|---|---|
| `DRAW_START` | `status = 'loading'` (giữ card cũ để chạy exit animation) |
| `DRAW_SUCCESS` | gán card mới, `truthRevealed = dareRevealed = false`, đẩy ID vào history (xóa history nếu `recycled`), `round++`, `status = 'ready'` |
| `DRAW_FAILURE` | `status = 'error'` |
| `DRAW_EMPTY` | `status = 'empty'` |
| `REVEAL_TRUTH` / `REVEAL_DARE` | chỉ bật phần tương ứng (idempotent) |
| `RESET` | về `idle` |

### API của hook `useGame`

```ts
drawCard()      // lần đầu từ màn Start
drawNewCard()   // nút "Lá mới" — không cần confirm kể cả khi chưa reveal
revealTruth()
revealDare()
resetGame()
```

Chi tiết:

- Chống double-click: bỏ qua khi đang `loading`; huỷ request cũ bằng `AbortController`.
- Chuyển bài: chạy **exit animation và fetch song song**, chờ cả hai (`Promise.all`) rồi mới render card mới → không nhấp nháy.
- History lưu thêm vào `sessionStorage` (bọc try/catch) để refresh trang không lặp lại ngay các lá vừa rút.
- `HISTORY_SIZE = 20`; server tự xử lý khi pool nhỏ hơn history (recycled).

---

## 8. UI / UX

### Luồng màn hình

```text
[Start]   TRUTH OR DARE · "Sẵn sàng chưa?" · [ RÚT BÀI ]
   ↓
[Loading] Card skeleton · "Đang rút bài..."
   ↓
[Playing] Header · "Lá #n" · GameCard (2 nửa blur) · [ LÁ MỚI ]
   ↘ [Error]  "Úi! Không rút được bài." · [ Thử lại ]
   ↘ [Empty]  "Hết bài phù hợp rồi." · "Thử chủ đề khác nhé."
```

### Lá bài

```text
┌──────────────────────────┐
│ 💬 TRUTH                  │   ← nửa trên: nút <button> chiếm toàn bộ vùng
│                          │
│   ████████████████       │   ← nội dung blur
│   ███████████            │
│      Chạm để lật         │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤   ← đường chia (kiểu răng cưa/đứt nét như vé xé)
│ 🔥 DARE                   │   ← nửa dưới
│                          │
│   ████████████████       │
│   ███████████            │
│      Chạm để lật         │
└──────────────────────────┘
```

- Hai nửa **cao bằng nhau**, mỗi nửa là một `<button>` lớn → chạm vào đâu trong nửa cũng được.
- Bo góc lớn (~24–28px), shadow mềm nhiều lớp tạo chiều sâu, viền mảnh.
- Mỗi nửa có nhãn + icon (Truth: `MessageCircleQuestion`, Dare: `Flame`) + màu accent riêng → phân biệt bằng **cả chữ, icon và màu**, không chỉ bằng màu.
- Nội dung dài: font tự co (clamp) + `overflow-wrap: anywhere`, không tràn.
- Sau khi lật: ẩn hint "Chạm để lật", hiển thị nhãn trạng thái "Đã lật".

### Cơ chế blur / reveal

- Nội dung thật được render nhưng áp `filter: blur(BLUR_PX)` (≈ 10px) + `opacity: 0.6` + `scale(0.98)` + `user-select: none`.
- Reveal: transition 400ms `blur → 0`, `opacity → 1`, `scale → 1`, ease-out.
- **Không** dùng overlay che nội dung.
- Khi chưa lật, phần nội dung có `aria-hidden="true"` để screen reader không đọc trước.

### Design tokens (`globals.css`)

```css
:root {
  --background:  #14121f;  /* tím than đậm */
  --foreground:  #f5f3ff;
  --card:        #fffaf3;  /* kem, cảm giác giấy bài */
  --card-fg:     #1d1b2a;
  --card-border: #e9e1d4;
  --truth:       #2f6fed;  /* xanh dương */
  --truth-soft:  #e6eeff;
  --dare:        #f0513b;  /* đỏ cam */
  --dare-soft:   #ffe9e5;
  --primary:     #ffd23f;  /* vàng — nút chính */
  --primary-fg:  #1d1b2a;
  --secondary:   #2a2740;
  --muted:       #9b97b3;
  --focus-ring:  #ffd23f;
}
```

- Gradient chỉ dùng nhẹ ở nền trang (radial glow) và dải accent trên mỗi nửa bài.
- Kiểm tra contrast ≥ 4.5:1 cho chữ thường, ≥ 3:1 cho chữ lớn/icon.
- Typography: font display tròn, đậm cho logo/nhãn (vd. *Bricolage Grotesque* hoặc *Baloo 2* — hỗ trợ tiếng Việt), font body dễ đọc (vd. *Be Vietnam Pro*), tải qua `next/font`.

### Micro-interactions (CSS)

| Sự kiện | Hiệu ứng | Thời lượng |
|---|---|---|
| Card xuất hiện | fade + scale 0.96→1 + trượt lên 8px | ~350ms |
| Reveal | blur→clear, opacity→1, scale 0.98→1 | ~400ms |
| Card cũ rời đi | fade out + scale 0.98 | ~200ms |
| Nút hover / active | scale 1.03 / 0.97 | ~120ms |
| Hover nửa bài (desktop) | nâng nhẹ nền accent | ~150ms |

Tôn trọng `prefers-reduced-motion`: bỏ scale/translate, chỉ giữ fade ngắn. Mọi thời lượng nằm trong `constants.ts` và CSS variables.

### Responsive

| Breakpoint | Card |
|---|---|
| 320–767px | rộng `100% − 32px`, cao ≈ `min(68dvh, …)` → không cần cuộn |
| 768px+ | rộng ~400px, căn giữa |
| 1024px+ | rộng ~420px, nền có trang trí nhẹ (họa tiết lá bài mờ) |

- Dùng `dvh` thay vì `vh` để tránh thanh địa chỉ mobile.
- Touch target ≥ 44px; nút chính ≥ 52px chiều cao.
- Header gọn: logo + nút âm thanh. Không sidebar, không nav kiểu desktop.

### Âm thanh

- **Mặc định TẮT**, nút toggle *Âm thanh bật/tắt* ở header (có `aria-pressed`), lưu lựa chọn trong `localStorage`.
- 3 âm: rút bài (whoosh ngắn), lật (chime), click (tick) — tạo bằng Web Audio API, không tải file, không nhạc nền.

---

## 9. Accessibility

- Mỗi nửa bài là `<button>` với `aria-label` động: *"Sự thật — đang ẩn, nhấn để lật"* / *"Sự thật: {nội dung}"*.
- Vùng nội dung có `aria-live="polite"` để đọc nội dung khi vừa lật.
- Điều hướng bằng Tab; Enter/Space để lật. Focus ring rõ ràng (`:focus-visible`, màu `--focus-ring`, offset 3px).
- Khi rút lá mới, đưa focus về nửa Truth.
- Trạng thái được truyền tải bằng chữ + icon, không chỉ bằng màu.
- `<html lang="vi">`.

---

## 10. SEO & Performance

**Metadata (`layout.tsx`):**

- Title: `Truth or Dare — Fun Party Game`
- Description: `Play Truth or Dare with random questions and challenges.`
- Open Graph + Twitter card, ảnh OG tạo bằng `opengraph-image.tsx`.
- Favicon, `theme-color`.

**Performance:**

- Trang chính render tĩnh; chỉ phần game là client component.
- Không dùng thư viện animation; icon import lẻ.
- Không fetch toàn bộ cards về client — mỗi lần chỉ 1 cặp.
- Mục tiêu: Lighthouse Performance & Accessibility ≥ 95 trên mobile.

---

## 11. Biến môi trường (`.env.example`)

```bash
# postgres | memory
CARD_SOURCE=memory

# Bắt buộc khi CARD_SOURCE=postgres (chỉ dùng phía server)
DATABASE_URL=postgres://user:password@localhost:5432/truode
```

`.env.local` được thêm vào `.gitignore`; không commit secret.

---

## 12. Kiểm thử

### Unit (Vitest)

- `gameReducer`: mọi action, reset reveal khi rút bài mới, reveal idempotent, xử lý `recycled`.
- `history`: ring buffer giới hạn đúng kích thước.
- `cardService`: loại trừ history; pool cạn → recycled; không có bài → EmptyError; dữ liệu không hợp lệ bị loại.
- `validation`: query params sai → 400.
- Seed: đủ ≥ 50/50, ID không trùng, content không rỗng.

### E2E (Playwright)

- Start → Rút bài → cả hai nửa đang blur.
- Chạm Truth → chỉ Truth hiện; Dare vẫn blur.
- Chạm Dare → cả hai hiện.
- Lá mới → cả hai blur lại, nội dung khác.
- Rút 20 lá liên tiếp → không lặp ID trong cửa sổ history.
- Chơi hoàn toàn bằng bàn phím.
- API trả 500 (mock route) → hiện Error state, Thử lại hoạt động.
- API trả 404 → hiện Empty state.
- Refresh trang → về màn Start, không lỗi.
- Viewport: **320, 375, 390, 768, 1024, 1440** → card nằm trọn trong viewport, không cuộn ngang, không tràn chữ.
- Không có lỗi console.

### Kiểm tra thủ công

- Điện thoại thật (iOS Safari, Android Chrome): cảm giác chạm, animation, thanh địa chỉ.
- `tsc --noEmit` và `next lint` sạch.

---

## 13. Lộ trình triển khai

| Phase | Nội dung | Kết quả |
|---|---|---|
| **1. Setup** | Khởi tạo Next.js + TS strict + Tailwind, ESLint, Vitest, Playwright, cấu trúc thư mục, `constants.ts`, design tokens | App chạy được trang trống |
| **2. Data layer** | Migration SQL, `CardRepository` + 2 implementation, seed 50+50, `scripts/migrate.ts`, `scripts/seed.ts`, `cardService`, route `/api/cards/random` + test | API trả cặp bài ngẫu nhiên |
| **3. Game logic** | Types, `gameReducer`, `useGame`, `cardClient`, history + sessionStorage + test | Logic hoàn chỉnh, test xanh |
| **4. UI** | Header, StartScreen, GameCard, CardSection/Truth/Dare, NewCardButton, Skeleton, Error, Empty | Chơi được end-to-end |
| **5. Animation & âm thanh** | Keyframes entrance/exit/reveal, trạng thái nút, reduced-motion, `useSound` | Tương tác mượt |
| **6. Responsive** | Kiểm tra 6 viewport, tinh chỉnh kích thước card/chữ | Không cuộn, không tràn |
| **7. Polish** | Rà spacing, typography, shadow, radius, states, a11y, SEO/OG | Cảm giác sản phẩm hoàn thiện, không phải prototype |
| **8. Testing & docs** | Chạy toàn bộ test, sửa lỗi, viết README | Đạt tiêu chí nghiệm thu |

Quy trình mỗi phase: **Think → Build → Test → Fix → Polish**.

---

## 14. Tiêu chí nghiệm thu

- [ ] Website chạy được (`dev` và `build` + `start`)
- [ ] Người chơi bắt đầu được game
- [ ] Nhận được Truth + Dare ngẫu nhiên
- [ ] Truth và Dare đều blur ban đầu
- [ ] Chạm Truth → chỉ Truth hiện
- [ ] Chạm Dare → chỉ Dare hiện
- [ ] Có thể lật cả hai
- [ ] Lá mới tạo bài mới và reset trạng thái lật
- [ ] Không lặp bài gần đây khi pool còn đủ
- [ ] Nội dung lấy từ database/data layer, không hard-code trong UI
- [ ] Không gửi toàn bộ database xuống client
- [ ] Có Loading / Error / Empty state
- [ ] Responsive mobile / tablet / desktop
- [ ] Animation mượt, tôn trọng reduced-motion
- [ ] Chơi được bằng bàn phím
- [ ] Có seed data (≥ 50 Truth, ≥ 50 Dare)
- [ ] Không có lỗi console nghiêm trọng
- [ ] Không có lỗi TypeScript
- [ ] README có: Installation, Environment variables, Database setup, Seed database, Development, Production build

---

## 15. Mở rộng sau MVP

Kiến trúc đã chừa chỗ cho:

| Tính năng | Điểm mở rộng |
|---|---|
| Chọn category / difficulty / ngôn ngữ | API đã nhận filter; chỉ cần thêm UI chọn |
| Tiếng Anh | cột `language` + seed `*.en.ts` + i18n chuỗi UI |
| Tên người chơi, lượt, điểm, hẹn giờ | thêm field vào `GameState` + action reducer |
| Lịch sử lá bài, yêu thích, chia sẻ | dùng `history`, thêm bảng `favorites` |
| Chế độ Couples / Party / Adult | preset filter category + cổng xác nhận tuổi cho `18+` |
| Custom / user-created cards | thêm cột `created_by`, `status` (pending/approved) |
| Auth, Admin dashboard | Supabase Auth + trang admin quản lý `cards` |
| Multiplayer | phòng chơi + realtime (Supabase Realtime) |
| PWA | manifest + service worker (cache shell, không cache API random) |
| Analytics | sự kiện draw/reveal, không lưu dữ liệu cá nhân |

---

## 16. Rủi ro & quyết định đã chốt

| Vấn đề | Quyết định |
|---|---|
| Nội dung lá hiện tại xem được qua DevTools | Chấp nhận cho MVP; phương án reveal-on-demand ghi ở §6 |
| `order by random()` chậm khi dữ liệu lớn | Đủ cho MVP; nâng cấp lên `random_key` khi > ~50k bản ghi |
| Không có DB khi dev | `CARD_SOURCE=memory` |
| Pool nhỏ hơn history | Server trả `recycled`, client xóa history loại đó |
| Mobile bị thanh địa chỉ che | Dùng `dvh`, kiểm tra trên máy thật |
| Nội dung không phù hợp | Rà soát seed thủ công; 18+/wild để trống trong MVP |
