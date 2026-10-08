import type { Category, Difficulty } from "@/types/game";

/**
 * Vietnamese Truth seed. IDs are derived from position (truth_001, ...),
 * so only append new entries — never reorder or delete.
 */
export const truthsVi: ReadonlyArray<readonly [Category, Difficulty, string]> = [
  // fun
  ["fun", "easy", "Nếu được đổi cuộc sống với một người trong nhóm trong 1 ngày, bạn chọn ai? Vì sao?"],
  ["fun", "easy", "Món ăn kỳ quặc nhất mà bạn lại rất thích là gì?"],
  ["fun", "easy", "Nếu có siêu năng lực trong 24 giờ, bạn muốn có năng lực gì và sẽ làm gì đầu tiên?"],
  ["fun", "easy", "Bài hát nào bạn hay hát lén khi ở một mình?"],
  ["fun", "medium", "Thói quen kỳ lạ nhất của bạn mà ít ai biết là gì?"],
  ["fun", "easy", "Nếu cuộc đời bạn là một bộ phim, tên phim sẽ là gì?"],
  ["fun", "medium", "Bạn đã từng giả vờ thích một món quà chưa? Đó là món gì?"],
  ["fun", "medium", "Ứng dụng nào trên điện thoại bạn dùng nhiều nhất mà ngại thừa nhận?"],
  ["fun", "easy", "Nếu phải ăn một món duy nhất suốt một tháng, bạn chọn món gì?"],
  ["fun", "medium", "Lần gần nhất bạn khóc vì xem phim là phim gì?"],
  ["fun", "easy", "Hồi nhỏ bạn từng tin vào điều gì rất ngây ngô?"],
  ["fun", "easy", "Nếu được gặp bất kỳ người nổi tiếng nào, bạn chọn ai và sẽ hỏi họ điều gì?"],
  ["fun", "easy", "Biệt danh buồn cười nhất bạn từng bị gọi là gì?"],
  ["fun", "medium", "Bạn đã bao giờ nói chuyện một mình trước gương chưa? Về chuyện gì?"],
  ["fun", "easy", "Món đồ vô dụng nhất bạn từng mua là gì?"],
  // friends
  ["friends", "medium", "Ai trong nhóm là người bạn tin tưởng nhất?"],
  ["friends", "medium", "Ấn tượng đầu tiên của bạn về người ngồi bên phải là gì?"],
  ["friends", "easy", "Bạn nghĩ ai trong nhóm sẽ nổi tiếng nhất trong tương lai?"],
  ["friends", "easy", "Nếu bị kẹt trên đảo hoang, bạn muốn đi cùng ai trong nhóm?"],
  ["friends", "hard", "Bí mật nhỏ nào bạn chưa từng kể với ai trong nhóm?"],
  ["friends", "hard", "Bạn từng ghen tị với ai trong nhóm vì điều gì?"],
  ["friends", "easy", "Theo bạn, ai trong nhóm nấu ăn dở nhất?"],
  ["friends", "easy", "Kỷ niệm đáng nhớ nhất của bạn với nhóm này là gì?"],
  ["friends", "hard", "Bạn đã từng nói xấu ai trong nhóm sau lưng chưa?"],
  ["friends", "easy", "Nếu phải chọn một người trong nhóm làm đồng đội đi thi, bạn chọn ai?"],
  // party
  ["party", "medium", "Buổi đi chơi tệ nhất của bạn diễn ra thế nào?"],
  ["party", "medium", "Bạn từng nói dối điều gì để thoát khỏi một cuộc hẹn?"],
  ["party", "medium", "Bạn đã bao giờ đến một bữa tiệc mà không được mời chưa?"],
  ["party", "easy", "Điệu nhảy \"tủ\" của bạn khi không ai nhìn là gì?"],
  ["party", "easy", "Lần thức khuya nhất của bạn là vì chuyện gì?"],
  ["party", "easy", "Ai trong nhóm là người \"quẩy\" nhiệt nhất ở các buổi tiệc?"],
  ["party", "easy", "Nơi kỳ lạ nhất bạn từng ngủ gật là ở đâu?"],
  ["party", "medium", "Bạn từng giả vờ bận để khỏi trả lời tin nhắn của ai?"],
  // embarrassing
  ["embarrassing", "hard", "Điều xấu hổ nhất bạn từng làm trước mặt người mình thích là gì?"],
  ["embarrassing", "easy", "Lần gần nhất bạn vấp ngã giữa chốn đông người là khi nào?"],
  ["embarrassing", "medium", "Bạn đã bao giờ gửi nhầm tin nhắn cho sai người chưa? Nội dung là gì?"],
  ["embarrassing", "medium", "Bức ảnh hồi nhỏ nào bạn không muốn ai nhìn thấy?"],
  ["embarrassing", "easy", "Bạn từng vẫy tay chào một người hoàn toàn không chào mình chưa?"],
  ["embarrassing", "hard", "Khoảnh khắc \"muốn độn thổ\" nhất của bạn ở trường hoặc công ty là gì?"],
  ["embarrassing", "medium", "Bạn đã bao giờ bị bắt gặp đang hát hoặc nhảy một mình chưa?"],
  ["embarrassing", "medium", "Lời nói dối ngớ ngẩn nhất bạn từng bị phát hiện là gì?"],
  // deep
  ["deep", "hard", "Điều gì khiến bạn sợ nhất trong cuộc sống hiện tại?"],
  ["deep", "medium", "Nếu được nói một điều với chính mình của 5 năm trước, bạn sẽ nói gì?"],
  ["deep", "hard", "Quyết định nào bạn tiếc nhất từ trước đến nay?"],
  ["deep", "medium", "Bạn tự hào nhất về điều gì ở bản thân?"],
  ["deep", "medium", "Lần gần nhất bạn cảm thấy thật sự hạnh phúc là khi nào?"],
  ["deep", "hard", "Ước mơ nào bạn đã từ bỏ nhưng vẫn còn nghĩ tới?"],
  ["deep", "medium", "Ai là người ảnh hưởng đến bạn nhiều nhất?"],
  // couples
  ["couples", "medium", "Kiểu người nào khiến bạn \"đổ\" ngay lập tức?"],
  ["couples", "easy", "Buổi hẹn hò trong mơ của bạn trông như thế nào?"],
  ["couples", "hard", "Bạn đã từng thầm thích ai trong nhóm bạn bè chưa?"],
  ["couples", "medium", "Câu thả thính \"sến\" nhất bạn từng nghe hoặc từng dùng là gì?"],
  ["couples", "hard", "Điều gì ở người yêu cũ (hoặc crush cũ) mà bạn vẫn còn nhớ?"],
  ["couples", "easy", "Bạn thích được bày tỏ tình cảm bằng lời nói hay bằng hành động?"],
  ["couples", "easy", "Lần đầu bạn \"cảm nắng\" ai đó là năm bao nhiêu tuổi?"],
];
