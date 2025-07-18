
import React from 'react';

const TopKInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#00695c' }}>Tìm hiểu về Top-K (Lấy mẫu)</h1>
      <p>Lấy mẫu <strong>Top-K</strong> giới hạn các lựa chọn của mô hình cho từ tiếp theo trong <code>K</code> từ có xác suất cao nhất. Điều này ảnh hưởng đến bề rộng của vốn từ vựng được sử dụng trong bản dịch lãng mạn, từ các biểu đạt thông thường đến đa dạng hơn.</p>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Cách hoạt động</h2>
      <p>Tại mỗi bước tạo ra bản dịch lãng mạn:</p>
      <ul>
        <li>Mô hình xác định <code>K</code> từ có xác suất cao nhất.</li>
        <li>Sau đó, nó chỉ lấy mẫu từ tiếp theo từ tập hợp đã giảm này, và tiếp tục bị ảnh hưởng bởi Nhiệt độ.</li>
      </ul>
      <p>Ví dụ:</p>
      <ul>
        <li>Nếu <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>topK = 1</code> (giải mã tham lam): Mô hình luôn chọn từ duy nhất có khả năng nhất, dẫn đến cách diễn đạt lãng mạn có thể đoán trước nhưng có khả năng lặp lại hoặc sáo rỗng.</li>
        <li>Nếu <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>topK = 50</code>: Mô hình xem xét 50 từ có khả năng, cho phép một lựa chọn phong phú hơn để tạo ra bản dịch lãng mạn.</li>
      </ul>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Ảnh hưởng đến việc dịch văn phong lãng mạn</h2>
      <p>Top-K ảnh hưởng đến sự đa dạng ngôn ngữ trong quá trình dịch thuật lãng mạn của bạn:</p>
      <ul>
        <li><strong>Top-K thấp (ví dụ: <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>5</code> - <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>10</code>):</strong>
          <p>Bản dịch kết quả có thể nghiêng nhiều về các mô-típ và từ vựng lãng mạn thông thường, vì mô hình bị giới hạn chỉ trong những từ có khả năng xảy ra ngay lập tức nhất. Điều này có thể dẫn đến cảm giác sáo rỗng nếu sử dụng quá mức, ví dụ: liên tục dịch tình yêu là "tiếng sét ái tình" hoặc trái tim là "rung động" mà không có những lựa chọn mới mẻ hơn.</p>
        </li>
        <li><strong>Top-K trung bình (ví dụ: <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>40</code> - <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>60</code>):</strong>
          <p>Điều này mang lại một sự cân bằng tốt cho văn viết lãng mạn. Mô hình có đủ lựa chọn để tạo ra những mô tả cảm xúc và bối cảnh tinh tế và đa dạng hơn, vượt ra ngoài những cụm từ rõ ràng nhất. Nó có thể tìm ra những cách diễn đạt thơ mộng hơn để bày tỏ tình cảm hoặc miêu tả một cảnh lãng mạn, ví dụ, mô tả một cái nhìn chung là "ánh mắt họ giao nhau, dệt nên một khoảnh khắc tĩnh lặng mà nồng nàn."</p>
        </li>
        <li><strong>Top-K cao (ví dụ: <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>100+</code>):</strong>
          <p>Mặc dù cung cấp lựa chọn rộng nhất, tác động của nó thường được điều tiết bởi Top-P (nếu hoạt động và được đặt ở mức thấp hơn). Nếu Top-P cũng cao, cài đặt này sẽ cho Nhiệt độ nhiều không gian hơn để giới thiệu từ vựng lãng mạn đa dạng, đôi khi bất ngờ. Điều này có thể có lợi cho các phong cách sáng tạo cao nhưng có thể yêu cầu chỉ dẫn hệ thống cẩn thận để đảm bảo sự liên quan và duy trì giọng văn lãng mạn mong muốn.</p>
        </li>
      </ul>
      <p>Top-K có thể bổ sung cho Top-P. Trong khi Top-P tự động chọn nhóm từ dựa trên xác suất tích lũy, Top-K sử dụng một số lượng cố định, cung cấp một cách khác để kiểm soát bề rộng từ vựng.</p>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Khuyến nghị cho ứng dụng này</h2>
      <p>Để dịch văn bản thành những câu chuyện lãng mạn hấp dẫn, bắt đầu với Top-K khoảng <strong><code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>40</code> đến <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>50</code></strong> thường hiệu quả, đặc biệt khi được sử dụng cùng với Top-P. Mục tiêu chính là cho phép ngôn ngữ phong phú, gợi cảm mà tránh lặp lại quá nhiều các cụm từ lãng mạn thông thường.</p>
      <ul>
        <li>Nếu bản dịch lãng mạn có vẻ quá hạn chế hoặc sử dụng vốn từ vựng rất hạn hẹp, bạn có thể thử tăng Top-K.</li>
        <li>Tuy nhiên, nhiều người thấy rằng việc điều chỉnh Nhiệt độ và Top-P có tác động trực tiếp và trực quan hơn đến việc đạt được "cảm giác" và sự sáng tạo lãng mạn mong muốn. Hãy tập trung vào việc điều chỉnh chúng trước.</li>
      </ul>
      <p>Hãy thử nghiệm với Top-K, nhưng nó có thể là một tham số phụ để điều chỉnh sau Nhiệt độ và Top-P để tinh chỉnh phong cách lãng mạn.</p>
    </div>
  );
};

export default TopKInfo;