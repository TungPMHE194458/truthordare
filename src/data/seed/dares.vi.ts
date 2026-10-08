import type { Category, Difficulty } from "@/types/game";

/**
 * Vietnamese Dare seed. IDs are derived from position (dare_001, ...),
 * so only append new entries — never reorder or delete.
 */
export const daresVi: ReadonlyArray<readonly [Category, Difficulty, string]> = [
  // fun
  ["fun", "medium", "Hát một bài hát bằng giọng opera trong 30 giây."],
  ["fun", "easy", "Nhảy theo một bài hát tưởng tượng trong 20 giây."],
  ["fun", "easy", "Nói chuyện bằng giọng robot cho đến lượt tiếp theo của bạn."],
  ["fun", "easy", "Kể một câu chuyện cười. Nếu không ai cười, kể thêm một câu nữa."],
  ["fun", "easy", "Bắt chước một con vật do người bên trái chọn trong 15 giây."],
  ["fun", "medium", "Đọc bảng chữ cái ngược từ Z về A thật nhanh."],
  ["fun", "easy", "Nói câu \"Nồi đồng nấu ốc, nồi đất nấu ếch\" 3 lần liên tiếp thật nhanh mà không vấp."],
  ["fun", "medium", "Diễn tả một bộ phim nổi tiếng chỉ bằng hành động để cả nhóm đoán."],
  ["fun", "easy", "Đứng yên như tượng trong 30 giây. Ai làm bạn cười thì bạn thua."],
  ["fun", "easy", "Nói \"chuẩn không cần chỉnh\" sau mỗi câu cho đến hết 2 lượt chơi."],
  ["fun", "easy", "Vẽ chân dung người đối diện trong 30 giây bằng tay không thuận."],
  ["fun", "medium", "Làm một đoạn quảng cáo 20 giây cho món đồ bất kỳ ở gần bạn."],
  ["fun", "medium", "Làm phát thanh viên thời sự trong 1 phút, đưa tin về những gì đang diễn ra trong phòng."],
  ["fun", "medium", "Đi catwalk từ đầu phòng đến cuối phòng như người mẫu chuyên nghiệp."],
  ["fun", "medium", "Hát điệp khúc một bài thiếu nhi bằng giọng rock."],
  // friends
  ["friends", "easy", "Gọi người bên trái bằng một biệt danh ngẫu nhiên trong 3 lượt tới."],
  ["friends", "easy", "Khen mỗi người trong nhóm một câu thật lòng."],
  ["friends", "medium", "Để người bên phải chọn hình nền điện thoại cho bạn và giữ nguyên trong 1 giờ."],
  ["friends", "medium", "Bắt chước điệu bộ đặc trưng của một người trong nhóm để mọi người đoán là ai."],
  ["friends", "medium", "Để cả nhóm chọn một emoji, bạn phải gắn nó vào cuối mọi tin nhắn trong hôm nay."],
  ["friends", "easy", "Kể một kỷ niệm vui với người đối diện mà có thể họ đã quên."],
  ["friends", "hard", "Cho cả nhóm xem bức ảnh gần nhất trong thư viện ảnh của bạn (được bỏ qua ảnh riêng tư)."],
  ["friends", "hard", "Nhắn \"Lâu rồi không gặp, nhớ cậu ghê!\" cho một người bạn cũ đã lâu không liên lạc."],
  ["friends", "easy", "Đổi chỗ ngồi với một người do nhóm chọn và giữ nguyên đến hết ván."],
  ["friends", "medium", "Hát tặng nhóm một đoạn bài hát mà bạn nghĩ là \"nhạc phim\" của nhóm này."],
  // party
  ["party", "medium", "Nhảy một điệu nhảy đang thịnh hành trên mạng xã hội."],
  ["party", "medium", "Làm DJ trong 30 giây: tạo nhạc chỉ bằng miệng và tay."],
  ["party", "easy", "Hô một khẩu hiệu cổ vũ thật to cho cả nhóm."],
  ["party", "medium", "Mở bài hát bạn nghe gần nhất và nhảy theo trong 15 giây."],
  ["party", "medium", "Làm MC, giới thiệu từng người trong nhóm như ngôi sao sắp bước lên sân khấu."],
  ["party", "hard", "Hát không nhạc một đoạn bài hát do cả nhóm chọn."],
  ["party", "easy", "Biểu diễn một màn ảo thuật (thật hay giả đều được) trong 30 giây."],
  ["party", "easy", "Nhìn thẳng vào người đối diện 30 giây mà không được cười. Ai cười trước phải làm thêm một thử thách."],
  // embarrassing
  ["embarrassing", "hard", "Nói một câu tỏ tình cực kỳ nghiêm túc với người đối diện."],
  ["embarrassing", "hard", "Đọc to tin nhắn gần nhất bạn đã gửi (được bỏ qua nếu là chuyện riêng tư)."],
  ["embarrassing", "medium", "Kể lại khoảnh khắc xấu hổ nhất tuần này bằng giọng kể chuyện cổ tích."],
  ["embarrassing", "medium", "Làm mặt xấu nhất có thể để cả nhóm chụp một tấm (chỉ lưu trong nhóm)."],
  ["embarrassing", "easy", "Nói bằng một giọng vùng miền khác giọng của bạn cho đến lượt tiếp theo."],
  ["embarrassing", "hard", "Hát một đoạn tình ca trong lúc nhìn thẳng vào mắt người bên phải."],
  ["embarrassing", "easy", "Để cả nhóm nghĩ ra một tư thế và giữ nguyên tư thế đó trong 20 giây."],
  ["embarrassing", "medium", "Ứng khẩu một bài thơ 4 câu về người bên trái."],
  // deep
  ["deep", "medium", "Cảm ơn một người trong nhóm về một điều cụ thể họ từng làm cho bạn."],
  ["deep", "medium", "Chia sẻ một mục tiêu bạn muốn đạt được trong năm nay. Cả nhóm sẽ là \"nhân chứng\"."],
  ["deep", "easy", "Nhắn tin hỏi thăm bố, mẹ hoặc một người thân ngay bây giờ."],
  ["deep", "medium", "Nói ba điều bạn thích ở bản thân mà không được cười."],
  ["deep", "hard", "Kể về một lần bạn đã sai và điều bạn học được từ đó."],
  ["deep", "medium", "Viết một lời nhắn ngắn gửi chính bạn của 1 năm sau và đọc to lên."],
  ["deep", "hard", "Nhìn vào mắt một người trong nhóm 20 giây rồi nói một điều tích cực về họ."],
  // couples
  ["couples", "medium", "Diễn lại một cảnh tỏ tình kinh điển trong bộ phim bạn thích."],
  ["couples", "medium", "Nói một câu thả thính với người bên trái."],
  ["couples", "easy", "Kể buổi hẹn hò tệ nhất (thật hoặc tưởng tượng) theo phong cách phim kinh dị."],
  ["couples", "hard", "Gửi một emoji trái tim cho người bạn nhắn tin gần nhất."],
  ["couples", "medium", "Sáng tác một bài thơ 4 câu về tình yêu và đọc bằng giọng truyền cảm nhất."],
  ["couples", "easy", "Mô tả người yêu lý tưởng của bạn chỉ bằng 3 từ."],
  ["couples", "easy", "Hát một đoạn bài hát tình yêu với vẻ mặt nghiêm túc nhất có thể."],
];
