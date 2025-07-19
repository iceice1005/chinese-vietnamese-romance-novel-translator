
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { getCharacterCount, getWordCount } from '../utils/textUtils';

interface InputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  onTransform: () => void; // Titles are now handled via onTitlesFetched + App state
  isLoading: boolean; // This will be the combined loading state from App.tsx
  urlInputValue: string; // Controlled URL from App.tsx
  onUrlInputChange: (value: string) => void; // To update URL in App.tsx
  autoFetchSignal: number; // Incremented by App.tsx to trigger fetch
  onTitlesFetched: (primary: string | null) => void; // Callback for fetched titles
}

const DEFAULT_CONTENT_CONTAINER_ID = 'mlfy_main_text'; // Updated default to 'mlfy_main_text'

export const InputArea: React.FC<InputAreaProps> = ({ 
  inputText, 
  setInputText, 
  onTransform, 
  isLoading, // Receives combined loading state from App
  urlInputValue,
  onUrlInputChange,
  autoFetchSignal,
  onTitlesFetched
}) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [internalUrlInput, setInternalUrlInput] = useState<string>(urlInputValue);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false); // Local state for URL fetching initiated by this component
  const [fetchUrlError, setFetchUrlError] = useState<string | null>(null);
  
  const [contentContainerId, setContentContainerId] = useState<string>(DEFAULT_CONTENT_CONTAINER_ID);
  
  // State for the primary title (either fetched or manually entered), reported up via onTitlesFetched
  const [primaryTitle, setPrimaryTitle] = useState<string | null>(null);
  const [titleFetchStatusMessage, setTitleFetchStatusMessage] = useState<string | null>(null);

  const [isFetchUrlAdvancedOptionsOpen, setIsFetchUrlAdvancedOptionsOpen] = useState<boolean>(false);

  // Sync prop urlInputValue to internalUrlInput
  useEffect(() => {
    setInternalUrlInput(urlInputValue);
  }, [urlInputValue]);

  const handleUrlFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setInternalUrlInput(newUrl);
    onUrlInputChange(newUrl); // Update App.tsx state
  };

  const handlePrimaryTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setPrimaryTitle(newTitle);
    onTitlesFetched(newTitle); // Update parent immediately
  };

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

  const executeFetchFromUrl = useCallback(async (urlToFetch: string) => {
    if (!urlToFetch.trim()) {
      setFetchUrlError('Please enter a valid URL.');
      return;
    }
    const contentIdToUse = contentContainerId.trim() || DEFAULT_CONTENT_CONTAINER_ID;

    if (!contentIdToUse) {
        setFetchUrlError('Content Container ID cannot be empty. Reset to default or provide a valid ID.');
        return;
    }

    setIsFetchingUrl(true);
    setFetchUrlError(null);
    setInputText(''); 
    setPrimaryTitle(null); 
    onTitlesFetched(null); // Clear titles in App.tsx
    setTitleFetchStatusMessage(null);

    try {
      // Use a CORS proxy to fetch the content from the client-side
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlToFetch)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. The fetch was proxied to avoid CORS issues, but the request still failed. The target site might be down, the URL incorrect, or the proxy service blocked.`);
      }
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      const mainTextContainer = doc.getElementById(contentIdToUse);
      if (!mainTextContainer) {
          throw new Error(`Could not find the content container with ID '${contentIdToUse}' on the page.`);
      }

      // New title fetching logic: first h1 inside the container
      const titleElement = mainTextContainer.querySelector('h1');
      const primaryTitleText = titleElement?.textContent?.trim() || null;

      if (primaryTitleText) {
          setPrimaryTitle(primaryTitleText);
          setTitleFetchStatusMessage(`Fetched title: "${primaryTitleText}".`);
      } else {
          setTitleFetchStatusMessage(`No <h1> title found inside element with ID '${contentIdToUse}'.`);
      }
      onTitlesFetched(primaryTitleText); // Report title to App

      const paragraphs = mainTextContainer.getElementsByTagName('p');
      if (paragraphs.length === 0) {
         setFetchUrlError(`No paragraph text found within the element with ID '${contentIdToUse}'. The input area remains empty.`);
      } else {
        const extractedTexts = Array.from(paragraphs).map(p => p.textContent?.trim() || '');
        const combinedText = extractedTexts.filter(text => text.length > 0).join('\n\n');
        setInputText(combinedText);
      }

    } catch (err) {
      console.error('Failed to fetch from URL:', err);
      let errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      
      if (errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = `Network error: ${errorMessage}. This could be due to your internet connection, or the CORS proxy service (allorigins.win) might be temporarily unavailable.`;
      }
      setFetchUrlError(errorMessage);
    } finally {
      setIsFetchingUrl(false);
    }
  }, [setInputText, contentContainerId, onTitlesFetched]);

  // Effect to trigger fetch when autoFetchSignal changes
  useEffect(() => {
    if (autoFetchSignal > 0 && urlInputValue && urlInputValue.trim() !== '') {
      // Ensure internalUrlInput is synced before fetching, though urlInputValue is the source of truth here.
      if (internalUrlInput !== urlInputValue) {
        setInternalUrlInput(urlInputValue);
      }
      executeFetchFromUrl(urlInputValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchSignal]); // We only want this to run when signal changes, urlInputValue is used directly.
                         // executeFetchFromUrl is memoized so it's a stable dep.

  const charCount = useMemo(() => getCharacterCount(inputText, true), [inputText]);
  const charCountNoSpaces = useMemo(() => getCharacterCount(inputText, false), [inputText]);
  const wordCount = useMemo(() => getWordCount(inputText), [inputText]);

  const toggleFetchUrlAdvancedOptions = () => {
    setIsFetchUrlAdvancedOptionsOpen(prev => !prev);
  };
  
  const combinedIsLoading = isLoading || isFetchingUrl; //isLoading from prop, isFetchingUrl is local for URL fetch button


  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-pink-200">
      <h2 className="text-2xl font-semibold mb-4 text-pink-600" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Nhập văn bản gốc tiếng Trung</h2>
      
      <div className="mb-6 p-4 border border-pink-100 rounded-md bg-pink-50/50 space-y-4">
        <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            Fetch content from a URL:
            </label>
            <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
             Extracts text from &lt;p&gt; tags and the first &lt;h1&gt; title from a specified container. Customize selectors in "Advanced Options".
            </p>
            <div className="flex items-center space-x-2">
            <input
                type="url"
                id="url-input"
                value={internalUrlInput} // Use internal state for display and direct editing
                onChange={handleUrlFieldChange} // Updates internal and App state
                placeholder="https://example.com/your-story-page"
                className="flex-grow p-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 text-gray-700 bg-white disabled:bg-gray-100"
                disabled={combinedIsLoading} // Use combined loading state
                aria-label="URL to fetch content from"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
            />
            <button
                onClick={() => executeFetchFromUrl(internalUrlInput)}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                disabled={combinedIsLoading || !internalUrlInput.trim()} // Use combined loading state
                aria-label="Fetch text from URL"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
                {isFetchingUrl ? 'Fetching...' : 'Fetch Text'}
            </button>
            </div>
        </div>

        <button
          type="button"
          onClick={toggleFetchUrlAdvancedOptions}
          className="mt-1 text-sm text-pink-500 hover:text-pink-700 focus:outline-none flex items-center"
          aria-expanded={isFetchUrlAdvancedOptionsOpen}
          aria-controls="fetch-advanced-options-content"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
          disabled={combinedIsLoading} // Disable when any loading is active
        >
          {isFetchUrlAdvancedOptionsOpen ? 'Hide Advanced Options' : 'Show Advanced Options'}
          <svg 
            className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isFetchUrlAdvancedOptionsOpen ? 'rotate-180' : 'rotate-0'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {isFetchUrlAdvancedOptionsOpen && (
          <div id="fetch-advanced-options-content" className="mt-4 space-y-4 border-t border-pink-200 pt-4 animate-fadeIn">
            <div className="pt-2">
                <label htmlFor="content-id-input" className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                    Content Container ID (defaults to '{DEFAULT_CONTENT_CONTAINER_ID}'):
                </label>
                 <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                 ID of the HTML element containing both the title (in an &lt;h1&gt;) and the main paragraph text.
                </p>
                <div className="flex items-center space-x-2">
                <input
                    type="text"
                    id="content-id-input"
                    value={contentContainerId}
                    onChange={(e) => setContentContainerId(e.target.value)}
                    placeholder={`e.g., ${DEFAULT_CONTENT_CONTAINER_ID} or main-content`}
                    className="flex-grow p-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-gray-400 text-gray-700 bg-white disabled:bg-gray-100"
                    disabled={combinedIsLoading} // Use combined loading state
                    aria-label="Content container ID"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                />
                <button
                    onClick={() => setContentContainerId(DEFAULT_CONTENT_CONTAINER_ID)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 text-xs whitespace-nowrap"
                    disabled={combinedIsLoading || contentContainerId === DEFAULT_CONTENT_CONTAINER_ID} // Use combined loading state
                    aria-label="Reset content container ID to default"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                    Reset ID
                </button>
                </div>
            </div>
          </div>
        )}

        {isFetchingUrl && (
          <p className="text-sm text-pink-500 mt-2" aria-live="polite">Attempting to load content from URL...</p>
        )}
        {titleFetchStatusMessage && !isFetchingUrl && (
          <p className={`text-sm mt-2 ${primaryTitle ? 'text-green-600' : 'text-orange-500'}`} aria-live="polite" role="status">
            {titleFetchStatusMessage}
          </p>
        )}
        {fetchUrlError && (
          <p className="text-sm text-red-600 mt-2" role="alert" aria-live="assertive">{fetchUrlError}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="primary-title-input" className="block text-sm font-semibold text-purple-700 mb-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          Tiêu đề (tùy chọn):
        </label>
        <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          Nhập hoặc dán tiêu đề gốc (tiếng Trung) vào đây để được dịch. Sẽ tự động được điền khi bạn lấy nội dung từ URL.
        </p>
        <input
            type="text"
            id="primary-title-input"
            value={primaryTitle || ''}
            onChange={handlePrimaryTitleChange}
            placeholder="Ví dụ: 第一章：初遇"
            className="w-full p-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder-gray-400 text-gray-700 bg-purple-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={combinedIsLoading}
            lang="zh"
            aria-label="Original Chinese title input (optional)"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
        />
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Dán văn bản thô tiếng Trung của bạn vào đây, hoặc lấy từ URL ở trên..."
        className="w-full h-48 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none placeholder-gray-400 text-gray-700 bg-pink-50"
        disabled={combinedIsLoading} // Use combined loading state
        lang="zh"
        aria-label="Raw Chinese text input"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      />
      <div className="mt-1 text-xs text-gray-500" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        Chars: {charCount} (no spaces: {charCountNoSpaces}) | Words: {wordCount}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div> 
          {/* Placeholder for potential future elements on the left */}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleCopy(inputText, setCopyButtonText, 'Copy')}
            className="px-6 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            disabled={combinedIsLoading || !inputText} // Use combined loading state
            aria-label="Copy input text to clipboard"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {copyButtonText}
          </button>
          <button
            onClick={() => {
                setInputText('');
                setPrimaryTitle(null); 
                onTitlesFetched(null); // Clear titles in App
                setTitleFetchStatusMessage(null); 
                setFetchUrlError(null); 
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
            disabled={combinedIsLoading || !inputText} // Use combined loading state
            aria-label="Clear input text"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Clear
          </button>
          <button
            onClick={onTransform} // Call onTransform directly, App.tsx handles passing titles
            className="px-8 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={combinedIsLoading || !inputText.trim()} // Use combined loading state
            aria-label="Translate text"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {isLoading ? 'Translating...' : 'Translate'} 
          </button>
        </div>
      </div>
    </section>
  );
};
