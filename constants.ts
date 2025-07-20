
export const DEFAULT_MODEL_ID = 'gemini-2.5-flash-lite-preview-06-17';

export const AVAILABLE_TEXT_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-flash-lite-preview-06-17', name: 'Gemini 2.5 Flash Lite (Preview - Recommended)'},
];

export const DEFAULT_SYSTEM_INSTRUCTION = `Bạn là một dịch giả chuyên nghiệp, chuyên sâu về dịch thuật tiểu thuyết ngôn tình Trung Quốc.
Nhiệm vụ của bạn là dịch văn bản thô tiếng Trung được cung cấp thành một câu chuyện tự sự lãng mạn, trôi chảy bằng tiếng Việt, với phong cách thanh lịch của một cuốn tiểu thuyết ngôn tình kinh điển.
Duy trì ý nghĩa cốt lõi và các sự kiện của văn bản gốc, nhưng nâng cao ngôn ngữ, hình ảnh và chiều sâu cảm xúc để gợi lên một không khí lãng mạn mạnh mẽ.
Sử dụng từ vựng tiếng Việt phong phú, các phép ẩn dụ và so sánh đặc trưng của thể loại ngôn tình.
Đảm bảo đầu ra là tiếng Việt tự nhiên, không phải là một bản dịch máy cứng nhắc.
Đầu ra CHỈ nên là câu chuyện tiếng Việt đã được dịch, không có bất kỳ cụm từ giới thiệu hay kết luận nào từ bạn.`;

export const DEFAULT_CHAPTER_TITLE_PROMPT_TEMPLATE = `Nhiệm vụ của bạn là dịch "Tiêu đề gốc" sang tiếng Việt một cách sát nghĩa với văn phong ngôn tình lãng mạn mượt mà. Hãy sử dụng "Nội dung chương" đã được dịch như một ngữ cảnh tham khảo cho ý nghĩa câu từ, đối tượng xuất hiện trong "Tiêu đề gốc" từ đó chuyển thành những từ tương ứng trong tiếng việt.
KHÔNG được thay thế hoàn toàn nội dung của "Tiêu đề gốc".
CHỈ trả về duy nhất chuỗi tiêu đề đã được tạo, bao gồm số chương và nội dung, không có bất kỳ văn bản nào khác.
KHÔNG được tự ý loại bỏ tên riêng của người hoặc địa danh có trong "Tiêu đề gốc".
CHỈ in hoa chữ cái đầu tiên của tiêu đề.
---
**Tiêu đề gốc (tiếng Trung):**
{{originalTitle}}

---
**Nội dung chương (tiếng Việt):**
{{narrativeText}}
---

**Tiêu đề chương dịch lại:**
`;
