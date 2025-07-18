
import React, { useState, useMemo } from 'react';
import { getCharacterCount, getWordCount } from '../utils/textUtils';

interface OutputAreaProps {
  transformedText: string;
  durationMs?: number | null;
  translatedTitle?: string | null;
}

export const OutputArea: React.FC<OutputAreaProps> = ({ transformedText, durationMs, translatedTitle }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Output');
  const [copyTranslatedTitleButtonText, setCopyTranslatedTitleButtonText] = useState('Copy Title');


  if (!transformedText) {
    return null;
  }

  const handleCopy = async (textToCopy: string, setButtonText: React.Dispatch<React.SetStateAction<string>>, originalText: string) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setButtonText('Copied!');
      setTimeout(() => setButtonText(originalText), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setButtonText('Failed!');
      setTimeout(() => setButtonText(originalText), 1500);
    }
  };


  const charCount = useMemo(() => getCharacterCount(transformedText, true), [transformedText]);
  const charCountNoSpaces = useMemo(() => getCharacterCount(transformedText, false), [transformedText]);
  const wordCount = useMemo(() => getWordCount(transformedText), [transformedText]);

  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-purple-200">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl font-semibold text-purple-600" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Romantic Narrative</h2>
        <button
          onClick={() => handleCopy(transformedText, setCopyButtonText, 'Copy Output')}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          aria-label="Copy transformed narrative to clipboard"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {copyButtonText}
        </button>
      </div>
      {durationMs !== null && typeof durationMs === 'number' && (
        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          Transformation completed in {(durationMs / 1000).toFixed(2)} seconds.
        </p>
      )}
      <div className="text-xs text-gray-500 mb-3" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        Chars: {charCount} (no spaces: {charCountNoSpaces}) | Words: {wordCount}
      </div>
      
      {translatedTitle && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
           <div className="flex justify-between items-center mb-1">
             <h3 className="text-md font-semibold text-purple-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                Tiêu đề đã dịch (AI):
             </h3>
             <button
                onClick={() => handleCopy(translatedTitle, setCopyTranslatedTitleButtonText, 'Copy Title')}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-300 text-xs"
                aria-label="Copy translated title to clipboard"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
             >
                {copyTranslatedTitleButtonText}
             </button>
           </div>
          <p className="text-xl text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }} lang="vi">
            {translatedTitle}
          </p>
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none p-3 bg-purple-50 rounded-md max-h-96 overflow-y-auto text-gray-700"
        lang="vi" // Explicitly set language to Vietnamese
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <p className="whitespace-pre-wrap">{transformedText}</p>
      </div>
    </section>
  );
};
