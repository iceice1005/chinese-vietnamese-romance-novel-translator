
import React from 'react';

const TopPInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#1565c0' }}>Tìm hiểu về Top-P (Lấy mẫu Hạt nhân)</h1>
      <p><strong>Top-P</strong> (Nucleus Sampling) kiểm soát sự đa dạng của văn phong lãng mạn được tạo ra. Nó lựa chọn từ tập hợp nhỏ nhất các từ có khả năng xuất hiện tiếp theo mà tổng xác suất của chúng vượt quá <code>P</code>, qua đó định hình "bảng màu từ vựng" cho bản dịch lãng mạn.</p>

      <h2 style={{ color: '#6a1b9a', marginTop: '1.5rem' }}>Cách hoạt động</h2>
      <p>Thay vì xem xét tất cả các từ có thể có tiếp theo hoặc một số lượng cố định (như Top-K), Top-P tự động điều chỉnh số lượng từ được xem xét:</p>
      <ul>
        <li>Mô hình sắp xếp các từ có thể xuất hiện tiếp theo theo xác suất.</li>
        <li>Nó tích lũy các xác suất này cho đến khi tổng lớn hơn hoặc bằng <code>P</code>. Tập hợp này tạo thành "hạt nhân".</li>
        <li>Mô hình chỉ lấy mẫu từ tiếp theo từ hạt nhân này, ảnh hưởng đến phạm vi biểu đạt được sử dụng trong văn phong lãng mạn.</li>
      </ul>
      <p>Ví dụ, nếu <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>topP = 0.9</code>, mô hình sẽ xem xét những từ có khả năng cao nhất mà cùng nhau chiếm 90% xác suất cho từ tiếp theo, lọc ra những thuật ngữ rất khó xảy ra hoặc có thể gây khó chịu cho bối cảnh lãng mạn.</p>

      <h2 style={{ color: '#6a1b9a', marginTop: '1.5rem' }}>Ảnh hưởng đến việc dịch văn phong lãng mạn</h2>
      <p>Top-P giúp kiểm soát "sự tập trung" và "tính nhất quán về phong cách" của bản dịch lãng mạn:</p>
      <ul>
        <li><strong>Top-P thấp (ví dụ: <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.8</code>):</strong>
          <p>Mô hình ưu tiên các cấu trúc câu và từ vựng lãng mạn phổ biến hơn. Điều này đảm bảo bản dịch duy trì sự nhất quán về phong cách và tránh những cách diễn đạt bất ngờ, dẫn đến một cảm giác lãng mạn cổ điển, có lẽ 'an toàn' hơn. Ví dụ, mô tả nụ cười của một người có thể luôn sử dụng các thuật ngữ như "dịu dàng" hoặc "tỏa nắng" thay vì những ẩn dụ độc đáo hơn.</p>
        </li>
        <li><strong>Top-P cao (ví dụ: <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.95</code> - <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>1.0</code>):</strong>
          <p>Mô hình khám phá một bảng màu từ vựng rộng hơn, có khả năng dẫn đến những mô tả lãng mạn độc đáo và giàu trí tưởng tượng hơn. Điều này có thể làm cho bản dịch cảm thấy mới mẻ và đặc biệt hơn. Ví dụ, nụ cười có thể được mô tả bằng những hình ảnh ít phổ biến nhưng gợi cảm, như "khóe môi khẽ nhếch lên một đường cong bí ẩn" hoặc "nụ cười tựa nắng mai sau cơn mưa, trong trẻo và ấm áp", thêm chiều sâu cho bức chân dung lãng mạn.</p>
        </li>
      </ul>
      <p>So với Nhiệt độ (thay đổi hình dạng xác suất), Top-P tự động giới hạn *bộ* từ ứng cử viên, đảm bảo chúng vẫn phù hợp với giọng văn lãng mạn.</p>

      <h2 style={{ color: '#6a1b9a', marginTop: '1.5rem' }}>Khuyến nghị cho ứng dụng này</h2>
      <p>Giá trị Top-P trong khoảng từ <strong><code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.9</code> đến <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.95</code></strong> là một điểm khởi đầu tốt cho các bản dịch lãng mạn. Điều này cho phép sự sáng tạo trong biểu đạt trong khi vẫn duy trì sự mạch lạc về chủ đề và sự tao nhã lãng mạn.</p>
      <ul>
        <li>Nếu bạn mong muốn một văn xuôi lãng mạn táo bạo hoặc độc đáo hơn với từ vựng phong phú hơn, hãy xem xét một Top-P cao hơn một chút (ví dụ: <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.98</code>).</li>
        <li>Nếu bản dịch bao gồm các thuật ngữ cảm thấy không phù hợp với một câu chuyện tình lãng mạn hoặc quá chung chung, hãy thử một Top-P thấp hơn một chút (ví dụ: <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.85</code>) để thu hẹp trọng tâm vào các biểu đạt lãng mạn cổ điển hơn.</li>
      </ul>
      <p>Điều chỉnh Top-P kết hợp với Nhiệt độ để tinh chỉnh sự pha trộn giữa sáng tạo và phong cách lãng mạn của bản dịch.</p>
    </div>
  );
};

export default TopPInfo;