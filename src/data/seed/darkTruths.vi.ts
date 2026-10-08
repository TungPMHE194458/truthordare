import type { Level } from "@/types/game";

/**
 * Dark Mode (18+) Truth seed, grouped by level (1 = Tease … 4 = Wild).
 * Content stays suggestive, not explicit — this is a mainstream web app.
 * IDs are derived from position, so only append — never reorder or delete.
 */
export const darkTruthsVi: ReadonlyArray<readonly [Level, string]> = [
  // 1 — Tease
  [1, "Điều gì ở một người khiến bạn thấy cuốn hút ngay từ cái nhìn đầu tiên?"],
  [1, "Bạn thích được trêu chọc theo kiểu nào?"],
  [1, "Một bộ trang phục nào khiến bạn tự tin và quyến rũ nhất?"],
  [1, "Bạn có đang nghĩ về một điều gì đó không nên nói ra ngay bây giờ không?"],
  [1, "Điều gì ở đối phương khiến bạn muốn nhìn thêm lần nữa?"],
  [1, "Bạn thích nhận được sự chú ý theo cách tinh tế hay rõ ràng, trực tiếp?"],
  // 2 — Flirty
  [2, "Câu tán tỉnh nào bạn nghĩ sẽ hiệu quả với chính mình?"],
  [2, "Bạn thích bị quyến rũ bằng lời nói hay bằng ánh mắt, cử chỉ?"],
  [2, "Điều gì khiến bạn thấy một mối liên kết có chemistry thật sự?"],
  [2, "Nếu được gửi một tin nhắn táo bạo cho đối phương ngay bây giờ, bạn sẽ viết gì?"],
  [2, "Bạn có điểm nào trên cơ thể mình nhạy cảm với những cái chạm nhẹ không?"],
  [2, "Điều gì khiến bạn cảm thấy tự tin và quyến rũ nhất?"],
  // 3 — Intimate
  [3, "Bạn tưởng tượng một buổi tối riêng tư lý tưởng với đối phương sẽ như thế nào?"],
  [3, "Điều gì khiến bạn cảm thấy được khao khát?"],
  [3, "Bạn thích được chạm vào ở đâu nhất khi ở gần người mình thích?"],
  [3, "Có điều gì bạn muốn thử nhưng chưa từng chia sẻ với ai?"],
  [3, "Ranh giới nào bạn muốn đối phương luôn tôn trọng?"],
  [3, "Điều gì khiến bạn mất kiểm soát một chút khi ở gần người mình thích?"],
  // 4 — Wild
  [4, "Nếu không có giới hạn nào tối nay, bạn muốn điều gì xảy ra giữa hai người?"],
  [4, "Mô tả một khoảnh khắc táo bạo bạn từng tưởng tượng về đối phương."],
  [4, "Điều gì khiến bạn thấy một người thật sự nguy hiểm và cuốn hút?"],
  [4, "Bạn muốn được gọi bằng biệt danh nào trong một khoảnh khắc thân mật?"],
  [4, "Nếu được viết một tin nhắn táo bạo gửi ngay bây giờ cho đối phương, nội dung sẽ là gì?"],
  [4, "Điều gì bạn muốn đối phương làm ngay lúc này, nếu cả hai đều thoải mái?"],
];
