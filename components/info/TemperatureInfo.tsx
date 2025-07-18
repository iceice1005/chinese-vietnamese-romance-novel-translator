
import React from 'react';

const TemperatureInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#d32f2f' }}>Tìm hiểu về Nhiệt Độ (Temperature)</h1>
      <p>Tham số <strong>Nhiệt độ</strong> kiểm soát mức độ ngẫu nhiên và sáng tạo trong đầu ra của mô hình. Nó ảnh hưởng đến việc văn phong lãng mạn được dịch ra sẽ "tưởng tượng" hay "gây bất ngờ" đến mức nào.</p>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Cách hoạt động</h2>
      <p>Khi tạo văn bản, mô hình sẽ gán xác suất cho các từ có thể xuất hiện tiếp theo. Nhiệt độ sẽ điều chỉnh các xác suất này:</p>
      <ul>
        <li><strong>Nhiệt độ thấp (ví dụ: 0.1 - 0.5):</strong> Làm cho đầu ra dễ đoán và tập trung hơn. Mô hình có nhiều khả năng chọn những từ có xác suất cao nhất, dẫn đến bản dịch thường nhất quán, bám sát văn bản gốc và tuân thủ các phong cách lãng mạn truyền thống.</li>
        <li><strong>Nhiệt độ cao (ví dụ: 0.7 - 1.0):</strong> Làm cho đầu ra ngẫu nhiên và sáng tạo hơn. Mô hình được khuyến khích xem xét các từ ít có khả năng hơn, dẫn đến bản dịch đa dạng, đáng ngạc nhiên và có khả năng nghe mới lạ hơn. Tuy nhiên, nếu quá cao, nó cũng có thể dẫn đến kết quả kém mạch lạc hoặc quá hoa mỹ.</li>
      </ul>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Ảnh hưởng đến việc dịch văn phong lãng mạn</h2>
      <p>Trong bối cảnh dịch văn bản tiếng Trung thành một câu chuyện lãng mạn tiếng Việt:</p>
      <ul>
        <li><strong>Nhiệt độ thấp (ví dụ: <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.3</code>):</strong>
          <p>Bản dịch có khả năng sẽ đi theo những lối mòn quen thuộc, tạo ra văn xuôi cổ điển nhưng có lẽ dễ đoán. Ví dụ, đầu vào tiếng Trung "他看着她" có thể trở thành "Anh ta nhìn cô ấy." – một bản dịch chính xác về mặt ngữ nghĩa, nhưng thiếu chất thơ.</p>
        </li>
        <li><strong>Nhiệt độ trung bình (ví dụ: <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.6</code> - <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.75</code>):</strong>
          <p>Mức này thường tạo ra sự cân bằng lý tưởng, cho phép sự tô điểm duyên dáng và ngôn từ gợi cảm. Cũng với "他看着她", nó có thể được thăng hoa thành "Ánh mắt anh dừng lại trên gương mặt cô, sâu thẳm và chứa chan những điều khó nói, tựa như mặt hồ thu tĩnh lặng."</p>
        </li>
        <li><strong>Nhiệt độ cao (ví dụ: <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.9</code>):</strong>
          <p>Bản dịch có thể bay bổng vào các lĩnh vực đậm chất thơ hoặc ẩn dụ. "他看着她" có thể trở thành "Anh nhìn cô, và trong một khoảnh khắc, cả thế giới dường như ngừng lại, chỉ còn lại ánh mắt của họ quấn quýt lấy nhau tựa dây tơ hồng định mệnh, khắc sâu vào tận cùng linh hồn." – có thể rất độc đáo, nhưng có nguy cơ trở nên quá hoa mỹ hoặc xa rời ý nghĩa gốc nếu chỉ dẫn hệ thống không đủ mạnh mẽ.</p>
        </li>
      </ul>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Khuyến nghị cho ứng dụng này</h2>
      <p>Để tạo ra những bản dịch lãng mạn tao nhã, hãy bắt đầu với Nhiệt độ khoảng từ <strong><code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.6</code> đến <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.75</code></strong>. Phạm vi này thường thúc đẩy sự sáng tạo và từ vựng phong phú phù hợp với thể loại lãng mạn. Nếu bản dịch có vẻ quá thông thường, hãy nhẹ nhàng tăng nhiệt độ. Nếu nó trở nên quá trừu tượng hoặc mất mạch lạc, nên giảm nhẹ. Mục tiêu là tìm ra sự cân bằng tạo ra văn xuôi vừa mê hoặc vừa rõ ràng, nắm bắt được tinh hoa của một cuốn tiểu thuyết lãng mạn cổ điển.</p>
    </div>
  );
};

export default TemperatureInfo;