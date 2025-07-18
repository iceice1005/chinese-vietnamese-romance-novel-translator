
import React from 'react';

interface PromptEditorProps {
  systemInstruction: string;
  setSystemInstruction: (prompt: string) => void;
  onResetSystemInstruction: () => void;
  isLoading: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  systemInstruction,
  setSystemInstruction,
  onResetSystemInstruction,
  isLoading,
}) => {
  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-yellow-300">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-yellow-700" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          Định Hình Phong Cách Tác Giả AI
        </h2>
        <button
          onClick={onResetSystemInstruction}
          disabled={isLoading}
          className="px-4 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
          aria-label="Khôi phục chỉ dẫn hệ thống về mặc định"
        >
          Khôi Phục Mặc Định
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        Điều chỉnh chỉ dẫn cho AI. Điều này sẽ định hình cách AI hành xử và phong cách văn chương lãng mạn sẽ được áp dụng.
      </p>
      <textarea
        value={systemInstruction}
        onChange={(e) => setSystemInstruction(e.target.value)}
        placeholder="Nhập chỉ dẫn hệ thống tùy chỉnh của bạn tại đây..."
        className="w-full h-40 p-3 border border-yellow-400 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-y placeholder-gray-400 text-gray-700 bg-yellow-50"
        disabled={isLoading}
        aria-label="Trình chỉnh sửa chỉ dẫn hệ thống"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      />
    </section>
  );
};
