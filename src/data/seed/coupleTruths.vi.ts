import type { Level } from "@/types/game";

/**
 * Couple Mode Truth seed, grouped by level (1 = Warm-up … 4 = Chemistry).
 * IDs are derived from position, so only append — never reorder or delete.
 */
export const coupleTruthsVi: ReadonlyArray<readonly [Level, string]> = [
  // 1 — Warm-up
  [1, "Điều đầu tiên bạn chú ý ở đối phương khi mới gặp là gì?"],
  [1, "Một sở thích mà bạn nghĩ chẳng ai đoán được là gì?"],
  [1, "Bạn thích được yêu thương theo cách nào: lời nói, hành động, hay sự quan tâm nhỏ?"],
  [1, "Nếu được rủ đi chơi ngay bây giờ, bạn muốn đi đâu?"],
  [1, "Món ăn nào bạn luôn muốn giới thiệu cho người mình thích?"],
  [1, "Bạn là người chủ động hay thích chờ đợi trong một mối quan hệ?"],
  // 2 — Getting Closer
  [2, "Điều gì khiến bạn thấy một người thật sự thú vị?"],
  [2, "Bạn thường làm gì khi thấy nhớ ai đó?"],
  [2, "Kiểu hẹn hò lý tưởng của bạn trông như thế nào?"],
  [2, "Bạn có dễ rung động không? Lần gần nhất là khi nào?"],
  [2, "Điều gì ở đối phương khiến bạn muốn tìm hiểu nhiều hơn?"],
  [2, "Bạn thích được khen về điều gì nhất?"],
  // 3 — Deep Talk
  [3, "Bạn định nghĩa một mối quan hệ lành mạnh là như thế nào?"],
  [3, "Điều gì khiến bạn cảm thấy an toàn khi ở bên ai đó?"],
  [3, "Bạn từng bị tổn thương thế nào trong một mối quan hệ trước đây?"],
  [3, "Điều gì bạn sợ nhất khi bắt đầu thích một người?"],
  [3, "Bạn cần gì để thật sự tin tưởng ai đó?"],
  [3, "Nếu phải mô tả cách bạn yêu một người bằng ba từ, đó là gì?"],
  // 4 — Chemistry
  [4, "Khoảnh khắc nào khiến bạn thấy đối phương hấp dẫn nhất?"],
  [4, "Bạn có đang cảm thấy điều gì đặc biệt ngay lúc này không?"],
  [4, "Nếu được làm một điều táo bạo ngay bây giờ, bạn sẽ làm gì?"],
  [4, "Bạn nghĩ hai mình hợp nhau ở điểm nào nhất?"],
  [4, "Điều gì ở đối phương khiến tim bạn đập nhanh hơn?"],
  [4, "Nếu đêm nay chỉ có hai người, bạn muốn làm gì cùng nhau?"],
  // --- Thêm (giữ nguyên thứ tự — chỉ thêm vào cuối, không chèn vào giữa) ---
  // 1 — Warm-up
  [1, "Bạn thích bắt đầu một ngày mới như thế nào?"],
  [1, "Điều gì khiến bạn cảm thấy thoải mái khi ở bên một người mới quen?"],
  [1, "Bạn thích nhận quà bất ngờ hay được báo trước?"],
  [1, "Sở thích nào của bạn ít người biết đến?"],
  [1, "Bạn nghĩ mình hợp với kiểu hẹn hò nào: năng động hay nhẹ nhàng?"],
  [1, "Điều nhỏ nhặt nào khiến bạn vui cả ngày?"],
  [1, "Bạn thích trò chuyện qua tin nhắn hay gặp trực tiếp hơn?"],
  [1, "Món đồ nào bạn luôn mang theo bên mình?"],
  [1, "Bạn ấn tượng với điều gì ở một người ngay lần đầu gặp?"],
  // 2 — Getting Closer
  [2, "Bạn nghĩ điều gì làm nên một cuộc trò chuyện thú vị?"],
  [2, "Bạn thích được an ủi theo cách nào khi buồn?"],
  [2, "Điều gì khiến bạn tin tưởng một người nhanh hơn?"],
  [2, "Bạn có hay chủ động nhắn tin trước không?"],
  [2, "Người bạn từng rung động gần đây nhất có điểm gì đặc biệt?"],
  [2, "Bạn thích một mối quan hệ phát triển nhanh hay chậm rãi?"],
  [2, "Điều gì khiến bạn cảm thấy được lắng nghe thật sự?"],
  [2, "Bạn có dễ ghen không?"],
  [2, "Bạn nghĩ sự hài hước quan trọng thế nào trong một mối quan hệ?"],
  // 3 — Deep Talk
  [3, "Điều gì khiến bạn cảm thấy được trân trọng trong một mối quan hệ?"],
  [3, "Bạn học được gì từ mối quan hệ trước đây?"],
  [3, "Điều gì khiến bạn ngần ngại mở lòng với người khác?"],
  [3, "Bạn nghĩ thế nào về việc chia sẻ quá khứ với người mới?"],
  [3, "Điều gì bạn mong muốn nhất ở một người đồng hành?"],
  [3, "Bạn xử lý thế nào khi có bất đồng trong một mối quan hệ?"],
  [3, "Điều gì khiến bạn cảm thấy cô đơn ngay cả khi có người bên cạnh?"],
  [3, "Bạn nghĩ lòng tin có thể xây dựng lại sau khi bị phá vỡ không?"],
  [3, "Điều gì khiến bạn cảm thấy mình đang yêu đúng cách?"],
  // 4 — Chemistry
  [4, "Điều gì khiến bạn cảm thấy kết nối sâu sắc với một người?"],
  [4, "Bạn có tin vào \"tiếng sét ái tình\" không?"],
  [4, "Khoảnh khắc nào khiến bạn nhận ra mình bắt đầu thích một người?"],
  [4, "Bạn nghĩ hai người có chemistry thể hiện qua điều gì?"],
  [4, "Điều gì khiến bạn muốn tiến xa hơn trong một mối quan hệ?"],
  [4, "Bạn cảm thấy thế nào ngay lúc này, ở đây, với đối phương?"],
  [4, "Nếu phải chọn một bài hát đại diện cho khoảnh khắc này, đó là gì?"],
  [4, "Điều gì khiến bạn tin hai người sẽ hợp nhau lâu dài?"],
  [4, "Bạn nghĩ điều gì sẽ khiến mối quan hệ này trở nên đặc biệt?"],
];
