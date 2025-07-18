
import React from 'react';

const SeedInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#2e7d32' }}>Tìm hiểu về Seed</h1>
      <p>Tham số <strong>Seed</strong> giúp làm cho đầu ra của câu chuyện lãng mạn trở nên dễ đoán hơn. Việc cung cấp một seed cụ thể (một số nguyên), cùng với cùng một văn bản đầu vào và cấu hình mô hình (Nhiệt độ, Top-P, Top-K), cho phép mô hình tái tạo lại cùng một bản chuyển đổi lãng mạn.</p>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Cách hoạt động</h2>
      <p>Các mô hình ngôn ngữ sử dụng các quy trình ngẫu nhiên để tạo văn bản sáng tạo. Seed khởi tạo sự ngẫu nhiên này đến một trạng thái cụ thể.</p>
      <ul>
        <li><strong>Cung cấp một seed số nguyên cụ thể:</strong> Mô hình bắt đầu "quá trình sáng tạo" của mình từ cùng một điểm mỗi lần, dẫn đến văn xuôi lãng mạn nhất quán.</li>
        <li><strong>Để trống Seed:</strong> Ứng dụng này sẽ tạo ra một seed ngẫu nhiên, đảm bảo mỗi lần chuyển đổi mới có thể khám phá một sắc thái phong cách khác nhau. Seed được tạo này sẽ được lưu trong lịch sử để có thể tái tạo sau này.</li>
      </ul>

      <div style={{ backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50', padding: '1rem', marginTop: '1rem', color: '#1b5e20' }}>
        <p><strong>Quan trọng:</strong> Ứng dụng này đảm bảo mỗi lần chuyển đổi đều có một seed số cụ thể được ghi lại trong lịch sử. Nếu bạn để trống trường seed, một seed ngẫu nhiên sẽ được ứng dụng tạo ra. Bạn luôn có thể tìm thấy seed chính xác đã được sử dụng cho bất kỳ câu chuyện lãng mạn nào trong quá khứ trong chi tiết lịch sử của nó, cho phép tái tạo chính xác một phong cách được yêu thích.</p>
      </div>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Tại sao khả năng tái tạo lại hữu ích cho các câu chuyện lãng mạn?</h2>
      <ul>
        <li><strong>Hoàn thiện một phong cách lãng mạn:</strong> Khi tinh chỉnh các chỉ dẫn hệ thống hoặc tham số để đạt được một tông giọng lãng mạn cụ thể (ví dụ: u sầu, nồng nàn, hay mộng mơ), một seed nhất quán giúp cô lập tác động của các thay đổi của bạn.</li>
        <li><strong>Xem lại một kết quả yêu thích:</strong> Nếu một lần chuyển đổi tạo ra một đoạn văn lãng mạn đặc biệt hay, seed đã được ghi lại của nó cho phép bạn tạo lại nó.</li>
        <li><strong>Tinh chỉnh lặp đi lặp lại:</strong> Có được một kết quả lãng mạn tốt, sau đó sử dụng seed của nó trong khi tinh chỉnh nhẹ Nhiệt độ hoặc Top-P để khám phá các biến thể tinh tế của phong cách cốt lõi đó.</li>
        <li><strong>Chia sẻ "Công thức Lãng mạn" của bạn:</strong> Chia sẻ đầu vào, cài đặt và seed để cho phép người khác trải nghiệm cùng một sự chuyển đổi lãng mạn.</li>
      </ul>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Ảnh hưởng đến việc chuyển đổi văn phong lãng mạn</h2>
      <p>Seed giúp bạn kiểm soát và khám phá các phong cách lãng mạn:</p>
      <ul>
        <li><strong>Sử dụng một Seed (thủ công hoặc từ lịch sử):</strong> Nếu một lần chuyển đổi cụ thể mang lại một phong cách lãng mạn đặc biệt đẹp hoặc phù hợp, việc tái sử dụng seed của nó (tìm thấy trong lịch sử) cho phép bạn sao chép lại nét duyên dáng cụ thể đó. Sau đó, bạn có thể áp dụng bản chất lãng mạn "đã khóa" này cho các văn bản đầu vào mới, hoặc thử nghiệm bằng cách thay đổi nhẹ các tham số khác trong khi vẫn giữ lại "dấu vân tay sáng tạo" cốt lõi của seed đó.</li>
        <li><strong>Để trống Seed (Chuyển đổi mới):</strong> Để khám phá phổ các diễn giải lãng mạn cho văn bản đầu vào của bạn, hãy để trống seed. Mỗi lần thử có khả năng sẽ tiết lộ một sắc thái biểu đạt lãng mạn khác nhau – có lẽ một phiên bản u sầu hơn, một phiên bản khác nồng nàn hơn. Seed ngẫu nhiên cụ thể được sử dụng cho mỗi lần khám phá sẽ được lưu trong lịch sử, vì vậy bạn luôn có thể quay lại một phiên bản mà bạn ngưỡng mộ.</li>
      </ul>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Khuyến nghị cho ứng dụng này</h2>
      <ul>
        <li><strong>Để trống để khám phá các phong cách lãng mạn đa dạng:</strong> Nếu bạn đang tìm kiếm nguồn cảm hứng hoặc muốn xem nhiều cách một văn bản thô có thể được thổi hồn lãng mạn, đây là cách nên làm. Seed duy nhất được sử dụng sẽ được ghi lại trong lịch sử để tham khảo sau này.</li>
        <li><strong>Nhập một số cụ thể (hoặc sử dụng một số từ lịch sử) để đạt được sự nhất quán hoặc tinh chỉnh một kết quả lãng mạn cụ thể:</strong> Nếu bạn đã tìm thấy một tông giọng lãng mạn "hoàn hảo", hãy sử dụng seed của nó để đạt được nó một cách nhất quán hoặc để thực hiện các điều chỉnh có mục tiêu cho các cài đặt khác trong khi vẫn giữ được phong cách cốt lõi đó. Ví dụ, nếu seed <code style={{ backgroundColor: '#f1f8e9', color: '#33691e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>123</code> với Nhiệt độ <code style={{ backgroundColor: '#f1f8e9', color: '#33691e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.7</code> đã tạo ra một câu chuyện đẹp, bạn có thể thử seed <code style={{ backgroundColor: '#f1f8e9', color: '#33691e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>123</code> với Nhiệt độ <code style={{ backgroundColor: '#f1f8e9', color: '#33691e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.75</code> để xem một biến thể nhỏ từ cùng một điểm khởi đầu sáng tạo.</li>
      </ul>
      <p><strong>Lưu ý:</strong> Mặc dù rất đáng tin cậy, khả năng tái tạo với một seed có thể có những biến đổi nhỏ qua các bản cập nhật lớn của mô hình. Đối với việc sử dụng thông thường, nó rất tuyệt vời để có được kết quả lãng mạn nhất quán với cùng một phiên bản mô hình.</p>
    </div>
  );
};

export default SeedInfo;
