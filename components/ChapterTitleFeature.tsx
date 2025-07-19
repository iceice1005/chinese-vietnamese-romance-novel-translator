
import React from 'react';
import { DEFAULT_CHAPTER_TITLE_PROMPT_TEMPLATE } from '../constants';

interface ChapterTitleFeatureProps {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  chapterTitlePrompt: string;
  setChapterTitlePrompt: (value: string) => void;
  isLoading: boolean;
}

export const ChapterTitleFeature: React.FC<ChapterTitleFeatureProps> = ({
  isEnabled,
  setIsEnabled,
  chapterTitlePrompt,
  setChapterTitlePrompt,
  isLoading,
}) => {
  const handleResetPrompt = () => {
    setChapterTitlePrompt(DEFAULT_CHAPTER_TITLE_PROMPT_TEMPLATE);
  };

  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-blue-300" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-700">
          Gợi Ý Tiêu Đề Chương (AI)
        </h3>
        <label htmlFor="chapter-title-toggle" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="chapter-title-toggle"
            className="sr-only peer"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            disabled={isLoading}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">{isEnabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Sử dụng AI để dịch lại tiêu đề gốc một cách sáng tạo, dựa trên ngữ cảnh của toàn bộ nội dung chương. Nếu được bật, nó sẽ được ưu tiên hơn việc dịch tiêu đề đơn giản.
      </p>

      {isEnabled && (
        <div className="animate-fadeIn mt-4 pt-4 border-t border-blue-200 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="chapter-title-prompt" className="block text-sm font-medium text-gray-700">
                Mẫu Prompt cho Tiêu Đề Chương:
              </label>
              <button
                onClick={handleResetPrompt}
                disabled={isLoading}
                className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-50 text-xs whitespace-nowrap"
                aria-label="Khôi phục mẫu prompt tiêu đề chương về mặc định"
              >
                Khôi Phục Mặc Định
              </button>
            </div>
            <textarea
              id="chapter-title-prompt"
              value={chapterTitlePrompt}
              onChange={(e) => setChapterTitlePrompt(e.target.value)}
              disabled={isLoading}
              rows={8}
              className="w-full p-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-700 bg-blue-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm resize-y"
              aria-describedby="chapter-title-prompt-description"
              placeholder="Nhập prompt tùy chỉnh của bạn để tạo tiêu đề chương..."
            />
            <p id="chapter-title-prompt-description" className="text-xs text-gray-500 mt-1">
              Tùy chỉnh prompt cho AI. Phải bao gồm <code className="bg-blue-100 text-blue-700 p-0.5 rounded">{'{{originalTitle}}'}</code> và <code className="bg-blue-100 text-blue-700 p-0.5 rounded">{'{{narrativeText}}'}</code> placeholders.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
