import type { Level } from "@/types/game";

/**
 * Dark Mode (18+) Dare seed, grouped by level (1 = Tease … 4 = Wild).
 * Content stays suggestive, not explicit — this is a mainstream web app.
 * Several cards lean on the players to set their own pace; that's intentional.
 * IDs are derived from position, so only append — never reorder or delete.
 */
export const darkDaresVi: ReadonlyArray<readonly [Level, string]> = [
  // 1 — Tease
  [1, "Nhìn thẳng vào mắt đối phương và mỉm cười đầy ẩn ý trong 10 giây."],
  [1, "Thì thầm một lời khen táo bạo vào tai đối phương."],
  [1, "Chạm nhẹ vào cổ tay đối phương và giữ trong 10 giây."],
  [1, "Cắn nhẹ môi và nhìn đối phương không nói gì trong 5 giây."],
  [1, "Vuốt nhẹ một lọn tóc của đối phương."],
  [1, "Nói một câu tán tỉnh thật chậm rãi, nhìn thẳng vào mắt đối phương."],
  // 2 — Flirty
  [2, "Hôn nhẹ lên cổ tay hoặc bàn tay đối phương."],
  [2, "Thì thầm vào tai đối phương điều bạn thích nhất ở họ."],
  [2, "Chạm nhẹ vào tai hoặc cổ đối phương trong vài giây."],
  [2, "Ngồi sát lại gần và để đối phương cảm nhận hơi thở của bạn."],
  [2, "Hôn nhẹ lên má, thật chậm."],
  [2, "Kéo nhẹ đối phương lại gần và nhìn sâu vào mắt nhau trong 10 giây."],
  // 3 — Intimate
  [3, "Hôn đối phương ở nơi bạn nghĩ sẽ khiến họ bất ngờ."],
  [3, "Đặt tay lên hông đối phương và kéo nhẹ lại gần."],
  [3, "Hôn dọc theo cổ đối phương, thật chậm."],
  [3, "Thì thầm một điều táo bạo bạn muốn làm tiếp theo."],
  [3, "Để đối phương tháo một món phụ kiện của bạn (đồng hồ, khăn...) thật chậm."],
  [3, "Ôm sát và hôn sâu trong vài giây, không vội vàng."],
  // 4 — Wild
  [4, "Để đối phương dẫn dắt 30 giây tiếp theo, theo cách cả hai đã thống nhất."],
  [4, "Thì thầm điều bạn muốn làm ngay bây giờ, rồi để cả hai cùng quyết định."],
  [4, "Hôn đối phương theo cách táo bạo nhất bạn dám thử."],
  [4, "Chạm và hôn chậm rãi lên vùng cổ hoặc vai đối phương."],
  [4, "Để đối phương chọn tháo một món phụ kiện trên người bạn, thật chậm rãi."],
  [4, "Cùng nhau quyết định điều muốn làm tiếp theo trong không gian riêng tư của hai người — luôn ưu tiên sự thoải mái của cả hai."],
];
