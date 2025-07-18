
import React from 'react';

interface FetchNovelTocFeatureProps {
  novelTocUrl: string;
  setNovelTocUrl: (value: string) => void;
  onFetchToc: () => void;
  isLoadingApp: boolean; // Main app loading (e.g., Gemini transform)
  isExtractingLink: boolean; // True when extracting link (e.g., from truyenwikidich)
  isFetchingToc: boolean; // True when fetching ToC content
  fetchError: string | null;
}

export const FetchNovelTocFeature: React.FC<FetchNovelTocFeatureProps> = ({
  novelTocUrl,
  setNovelTocUrl,
  onFetchToc,
  isLoadingApp,
  isExtractingLink,
  isFetchingToc,
  fetchError,
}) => {
  const isOverallLoading = isLoadingApp || isExtractingLink || isFetchingToc;
  let buttonText = 'Fetch Chapters';
  if (isExtractingLink) {
    buttonText = 'Extracting Link...';
  } else if (isFetchingToc) {
    buttonText = 'Fetching Chapters...';
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* The enable checkbox is removed. The feature is considered enabled if this component is rendered. */}
      
      <p className="text-sm text-gray-500">
        Enter the URL of a novel's table of contents page. The app will look for a {'<ul id="chapterList">'} element to extract chapter links. For sites like truyenwikidich.net, it will attempt to find a direct content link first.
      </p>
      <div>
        <label htmlFor="novel-toc-url-input" className="block text-md font-medium text-gray-700 mb-1">
          Table of Contents URL:
        </label>
        <div className="flex items-center space-x-2">
            <input
                type="url"
                id="novel-toc-url-input"
                value={novelTocUrl}
                onChange={(e) => setNovelTocUrl(e.target.value)}
                placeholder="https://example.com/novel/table-of-contents"
                disabled={isOverallLoading}
                className="flex-grow p-2 border border-teal-400 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 text-gray-700 bg-teal-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                aria-label="Novel table of contents URL"
            />
            <button
                onClick={onFetchToc}
                disabled={isOverallLoading || !novelTocUrl.trim()}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
                {buttonText}
            </button>
        </div>
      </div>

      {fetchError && (
        <p className="text-sm text-red-600 mt-2 whitespace-pre-line" role="alert">{fetchError}</p>
      )}
    </div>
  );
};
