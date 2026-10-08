import type { Level } from "@/types/game";

/**
 * Couple Mode Dare seed, grouped by level (1 = Warm-up … 4 = Chemistry).
 * IDs are derived from position, so only append — never reorder or delete.
 */
export const coupleDaresVi: ReadonlyArray<readonly [Level, string]> = [
  // 1 — Warm-up
  [1, "Kể một câu chuyện vui về bản thân mà đối phương chưa từng nghe."],
  [1, "Nhìn vào mắt đối phương trong 10 giây mà không cười."],
  [1, "Đặt một câu hỏi bất kỳ và để đối phương trả lời thật lòng."],
  [1, "Khen đối phương một điều bạn thực sự thích ở họ."],
  [1, "Chạm nhẹ tay đối phương trong 5 giây."],
  [1, "Bắt chước biểu cảm của đối phương khi họ vui."],
  // 2 — Getting Closer
  [2, "Nắm tay đối phương và giữ trong suốt lượt chơi tiếp theo."],
  [2, "Thì thầm một điều bạn thích ở đối phương vào tai họ."],
  [2, "Chọn một bài hát thể hiện cảm xúc hiện tại và mở cho đối phương nghe."],
  [2, "Ôm đối phương trong 10 giây."],
  [2, "Viết một lời nhắn ngắn gửi đối phương và đọc to lên."],
  [2, "Để đối phương chọn một cử chỉ âu yếm bạn sẽ làm ngay bây giờ."],
  // 3 — Deep Talk
  [3, "Nhìn vào mắt đối phương và nói một điều bạn trân trọng ở họ."],
  [3, "Kể một điều bạn chưa từng nói với ai, chỉ dành riêng cho đối phương."],
  [3, "Đặt tay lên ngực đối phương và cảm nhận nhịp tim trong 10 giây."],
  [3, "Vuốt nhẹ má đối phương và nói một lời yêu thương."],
  [3, "Để đối phương ôm bạn từ phía sau trong 15 giây."],
  [3, "Hôn nhẹ lên trán hoặc tay đối phương."],
  // 4 — Chemistry
  [4, "Hôn đối phương ở nơi bạn nghĩ họ sẽ thích nhất (má, trán, hoặc môi — tùy hai người)."],
  [4, "Ôm sát đối phương và giữ im lặng trong 20 giây, chỉ cảm nhận nhau."],
  [4, "Thì thầm một điều bạn muốn làm cùng đối phương trong tương lai gần."],
  [4, "Nhảy chậm cùng đối phương theo một bài hát bất kỳ trong 30 giây."],
  [4, "Nhìn thẳng vào mắt đối phương và nói điều khiến tim bạn loạn nhịp."],
  [4, "Để đối phương quyết định khoảnh khắc lãng mạn tiếp theo của hai người."],
  // --- Thêm (giữ nguyên thứ tự — chỉ thêm vào cuối, không chèn vào giữa) ---
  // 1 — Warm-up
  [1, "Gửi một lời chào thật đáng yêu tới đối phương."],
  [1, "Chia sẻ một bài hát bạn đang nghe gần đây cho đối phương."],
  [1, "Kể tên 3 điều bạn thích ở bản thân."],
  [1, "Bắt chước giọng nói của đối phương trong 10 giây."],
  [1, "Mô tả đối phương bằng 3 từ."],
  [1, "Kể một kỷ niệm vui thời đi học."],
  [1, "Đoán xem đối phương thích màu gì, rồi hỏi lại xem đúng không."],
  [1, "Chụp một bức ảnh selfie vui nhộn cùng đối phương (nếu đang ở gần nhau)."],
  [1, "Nói một câu chúc tốt đẹp dành cho đối phương."],
  // 2 — Getting Closer
  [2, "Nhắn cho đối phương một câu khen thật lòng."],
  [2, "Kể một câu chuyện khiến bạn cười nhiều nhất gần đây."],
  [2, "Gọi video hoặc gọi điện cho đối phương trong 30 giây (nếu có thể)."],
  [2, "Chia sẻ một bức ảnh bạn thấy đẹp gần đây."],
  [2, "Hỏi đối phương một câu bạn luôn tò mò nhưng chưa dám hỏi."],
  [2, "Đặt một biệt danh dễ thương cho đối phương."],
  [2, "Kể điều khiến bạn ấn tượng nhất ở đối phương cho đến giờ."],
  [2, "Gửi một emoji thể hiện đúng cảm xúc hiện tại của bạn."],
  [2, "Rủ đối phương lên kế hoạch cho một buổi hẹn hò tiếp theo."],
  // 3 — Deep Talk
  [3, "Chia sẻ một nỗi sợ bạn ít khi nói ra."],
  [3, "Kể một điều bạn ước người khác hiểu về mình hơn."],
  [3, "Nói với đối phương điều bạn đang thật sự cảm nhận lúc này."],
  [3, "Kể một bài học quan trọng bạn rút ra từ một mối quan hệ cũ."],
  [3, "Chia sẻ điều khiến bạn tổn thương nhất mà ít ai biết."],
  [3, "Nói một lời xin lỗi chân thành cho một điều bạn từng làm sai."],
  [3, "Kể điều bạn trân trọng nhất ở gia đình mình."],
  [3, "Chia sẻ một ước mơ bạn chưa từng nói với ai."],
  [3, "Nói với đối phương một điều bạn hy vọng ở tương lai của hai người."],
  // 4 — Chemistry
  [4, "Nắm tay đối phương và nói điều bạn đang nghĩ ngay lúc này."],
  [4, "Nhìn vào mắt đối phương và nói một điều khiến bạn rung động."],
  [4, "Ôm đối phương thật chặt trong 15 giây không nói gì."],
  [4, "Viết một lời nhắn ngọt ngào gửi riêng cho đối phương."],
  [4, "Đề nghị một cái ôm hoặc nắm tay theo cách bạn thấy thoải mái nhất."],
  [4, "Nói với đối phương lý do khiến bạn muốn ở bên họ lâu hơn."],
  [4, "Chạm trán nhẹ vào đối phương và giữ yên trong vài giây."],
  [4, "Thì thầm một lời cảm ơn vì đối phương đã ở đây lúc này."],
  [4, "Hẹn đối phương cho một khoảnh khắc đặc biệt tiếp theo của hai người."],
];
