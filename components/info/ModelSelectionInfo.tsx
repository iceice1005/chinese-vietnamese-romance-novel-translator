
import React from 'react';

const ModelSelectionInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#4a148c' }}>Tìm hiểu về Lựa Chọn Mô Hình</h1>
      <p>Cài đặt này cho phép bạn chọn mô hình Google Gemini nào được sử dụng để chuyển đổi văn phong lãng mạn. Các mô hình khác nhau có những điểm mạnh riêng biệt trong việc tạo văn bản sáng tạo, ảnh hưởng đến phong cách, sắc thái và chất lượng của văn xuôi lãng mạn kết quả.</p>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Mô hình được sử dụng trong ứng dụng này</h2>
      <p>Ứng dụng này sử dụng một mô hình tạo văn bản được tuyển chọn, tối ưu hóa cho việc chuyển đổi văn bản thô thành những câu chuyện lãng mạn tao nhã:</p>
      <ul>
        <li>
          <strong><code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-flash</code> (Gemini 2.5 Flash):</strong>
          Đây là mô hình được khuyến nghị và sử dụng cho Công cụ Chuyển đổi Văn phong Lãng mạn. Nó cung cấp một sự cân bằng tuyệt vời giữa tốc độ, chi phí và khả năng tạo văn bản sáng tạo xuất sắc. Nó lý tưởng cho việc chuyển đổi văn bản thành các câu chuyện lãng mạn, đặc biệt nếu bạn đang xử lý một lượng lớn văn bản hoặc tìm kiếm sự cân bằng giữa hiệu quả và chất lượng văn xuôi lãng mạn.
        </li>
      </ul>
      
      <div style={{ backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50', padding: '1rem', marginTop: '1rem', color: '#1b5e20' }}>
        <p><strong>Khuyến nghị cho ứng dụng này:</strong> Để tạo ra những câu chuyện lãng mạn hấp dẫn với công cụ này, <strong><code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-flash</code></strong> là lựa chọn tối ưu. Nó được tối ưu hóa cho loại hình chuyển đổi sáng tạo và phong cách mà ứng dụng này hướng tới, cân bằng giữa việc tạo ra ngôn ngữ tinh tế và hiệu quả để sản xuất văn xuôi lãng mạn chất lượng cao.</p>
      </div>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Lưu ý về bậc miễn phí</h2>
      <p>Mô hình được sử dụng trong ứng dụng này được chọn lựa có tính đến việc sử dụng bậc miễn phí, dựa trên các nguyên tắc hiện tại của Google Generative AI. <code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-flash</code> thường có sẵn trong bậc miễn phí, tuân theo giới hạn sử dụng của Google.</p>
      <p>Điều quan trọng cần lưu ý:</p>
      <ul>
        <li><strong>Giới hạn sử dụng:</strong> Bậc miễn phí thường đi kèm với giới hạn về số lượng yêu cầu bạn có thể thực hiện mỗi phút hoặc mỗi ngày. Nếu bạn vượt quá các giới hạn này, bạn có thể gặp lỗi.</li>
        <li><strong>Tính sẵn có của mô hình:</strong> Tên mô hình, tính sẵn có và việc chúng được bao gồm trong bậc miễn phí có thể thay đổi theo thời gian khi Google cập nhật các dịch vụ của mình.</li>
      </ul>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Các mô hình Gemini khác (Thông tin chung)</h2>
      <p>Họ Gemini bao gồm một loạt các mô hình đa dạng. Mặc dù không phải tất cả đều có thể chọn trong ứng dụng này để duy trì sự tập trung, đây là các ví dụ về các mô hình khác trong hệ sinh thái Gemini rộng lớn hơn:</p>
      <ul>
        <li><code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-pro</code>: Được tối ưu hóa để tăng cường khả năng tư duy và suy luận, có khả năng xử lý các tác vụ phức tạp hơn.</li>
        <li>Tạo hình ảnh (ví dụ: <code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>imagen-3.0-generate-002</code>)</li>
        <li>Xử lý và tạo âm thanh và video.</li>
      </ul>
      <div style={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3', padding: '1rem', marginTop: '1rem', color: '#1e3a8a' }}>
        <p><strong>Lưu ý:</strong> Ứng dụng "Công cụ Chuyển đổi Văn phong Lãng mạn" này được thiết kế đặc biệt cho việc <strong>chuyển đổi văn bản sang văn bản</strong>. Do đó, các mô hình cho các phương thức khác không áp dụng hoặc không thể chọn trong chức năng hiện tại của công cụ này.</p>
      </div>
      
      <p>Luôn tham khảo tài liệu chính thức của Google Cloud để có thông tin cập nhật nhất về các mô hình Gemini, khả năng, giá cả và chi tiết về bậc miễn phí của chúng.</p>
    </div>
  );
};

export default ModelSelectionInfo;
