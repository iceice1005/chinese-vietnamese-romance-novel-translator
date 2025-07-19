
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { OutputArea } from './components/OutputArea';
import { HistoryList } from './components/HistoryList';
import { ModelConfigurator } from './components/ModelConfigurator';
import { PromptEditor } from './components/PromptEditor';
import { FetchNovelTocFeature } from './components/FetchNovelTocFeature';
import { NovelTocModal } from './components/NovelTocModal';
import { transformTextViaGemini, translateTitleViaGemini } from './services/geminiService';
import { extractTruyenWikiDichNetBookIndexUrl } from './services/urlExtractorService'; // New import
import { TransformationEntry, NovelChapter } from './types';
import { IndeterminateProgressBar } from './components/IndeterminateProgressBar';
import { Modal } from './components/Modal';
import { 
  DEFAULT_SYSTEM_INSTRUCTION, 
  DEFAULT_MODEL_ID, 
  AVAILABLE_TEXT_MODELS,
} from './constants';

import TemperatureInfo from './components/info/TemperatureInfo';
import TopPInfo from './components/info/TopPInfo';
import TopKInfo from './components/info/TopKInfo';
import SeedInfo from './components/info/SeedInfo';
import ModelSelectionInfo from './components/info/ModelSelectionInfo';


export type InfoComponentKey = 'temperature' | 'topP' | 'topK' | 'seed' | 'modelSelection';

const infoComponentMap: Record<InfoComponentKey, React.FC> = {
  temperature: TemperatureInfo,
  topP: TopPInfo,
  topK: TopKInfo,
  seed: SeedInfo,
  modelSelection: ModelSelectionInfo,
};

const App: React.FC = () => {
  const [systemInstruction, setSystemInstruction] = useState<string>(DEFAULT_SYSTEM_INSTRUCTION);
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [history, setHistory] = useState<TransformationEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Main app loading (Gemini transformation)
  const [error, setError] = useState<string | null>(null);
  const [lastTransformationDuration, setLastTransformationDuration] = useState<number | null>(null);

  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [temperature, setTemperature] = useState<number>(0.5);
  const [topP, setTopP] = useState<number>(0.9);
  const [topK, setTopK] = useState<number>(40);
  const [seed, setSeed] = useState<string>(''); 

  const [isOptionalSettingsOpen, setIsOptionalSettingsOpen] = useState<boolean>(false);
  const [isTocFeatureOpen, setIsTocFeatureOpen] = useState<boolean>(false); 

  // Modal State for Info
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [infoModalTitle, setInfoModalTitle] = useState<string>('');
  const [infoModalContent, setInfoModalContent] = useState<React.ReactNode | null>(null);
  const [isInfoModalLoading, setIsInfoModalLoading] = useState<boolean>(false);
  const [infoModalError, setInfoModalError] = useState<string | null>(null);

  // States for Fetch Novel TOC Feature
  const [novelTocUrlInput, setNovelTocUrlInput] = useState<string>('');
  const [isExtractingLink, setIsExtractingLink] = useState<boolean>(false); // New state for URL extraction phase
  const [isFetchingNovelToc, setIsFetchingNovelToc] = useState<boolean>(false); // For ToC fetching phase
  const [fetchNovelTocError, setFetchNovelTocError] = useState<string | null>(null);
  const [novelChapters, setNovelChapters] = useState<NovelChapter[] | null>(null);
  const [isNovelTocModalOpen, setIsNovelTocModalOpen] = useState<boolean>(false);

  // State for InputArea's URL (lifted) and auto-fetch trigger
  const [inputAreaUrl, setInputAreaUrl] = useState<string>('');
  const [autoFetchUrlSignal, setAutoFetchUrlSignal] = useState<number>(0);
  // States for titles fetched by InputArea, to be passed to onTransform
  const [fetchedPrimaryTitleForTransform, setFetchedPrimaryTitleForTransform] = useState<string | null>(null);


  const handleOpenInfoModal = useCallback(async (title: string, componentKey: InfoComponentKey) => {
    setInfoModalTitle(title);
    setIsInfoModalOpen(true);
    setIsInfoModalLoading(true); 
    setInfoModalContent(null);
    setInfoModalError(null);

    try {
      const InfoComponent = infoComponentMap[componentKey];
      if (InfoComponent) {
        setInfoModalContent(<InfoComponent />);
      } else {
        throw new Error(`Info component for key "${componentKey}" not found.`);
      }
    } catch (err) {
      console.error('Failed to load modal component:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading content.';
      setInfoModalError(errorMessage);
    } finally {
      setIsInfoModalLoading(false);
    }
  }, []);

  const handleCloseInfoModal = useCallback(() => {
    setIsInfoModalOpen(false);
    setInfoModalTitle('');
    setInfoModalContent(null);
    setIsInfoModalLoading(false);
    setInfoModalError(null);
  }, []);

  const handleTransform = useCallback(async (primaryTitle?: string) => {
    if (!inputText.trim()) {
      setError('Input text cannot be empty.');
      return;
    }
    if (!systemInstruction.trim()) {
      setError('System instruction cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutputText('');
    setTranslatedTitle(null);
    setLastTransformationDuration(null);
    const startTime = performance.now();

    let actualSeedUsed: number;
    const seedInput = seed.trim();

    if (seedInput === '') {
      actualSeedUsed = Math.floor(Math.random() * 2147483647) + 1;
    } else {
      const parsedSeed = parseInt(seedInput, 10);
      if (isNaN(parsedSeed) || !Number.isInteger(parsedSeed)) {
        setError('Seed must be a valid integer or empty.');
        setIsLoading(false);
        return;
      }
      actualSeedUsed = parsedSeed;
    }

    let transformedTextResult: string = '';
    let finalTranslatedTitle: string | undefined = undefined;

    try {
      // Step 1: Translate the main narrative text
      transformedTextResult = await transformTextViaGemini(
        selectedModel,
        systemInstruction,
        inputText,
        temperature,
        topP,
        topK,
        actualSeedUsed
      );
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      setLastTransformationDuration(durationMs);
      setOutputText(transformedTextResult);

      // Step 2: Translate the fetched title if it exists
      if (primaryTitle && primaryTitle.trim() !== '') {
        try {
          finalTranslatedTitle = await translateTitleViaGemini(selectedModel, primaryTitle);
          setTranslatedTitle(finalTranslatedTitle);
        } catch (titleError) {
           console.error('Title translation error:', titleError);
           // Non-fatal error for the user, we can proceed without the translated title.
           setError('Could not translate the chapter title, but the main text was transformed.');
           finalTranslatedTitle = undefined;
        }
      }
      
      // Step 3: Create history entry
      const currentModelDetails = AVAILABLE_TEXT_MODELS.find(m => m.id === selectedModel);
      const newEntry: TransformationEntry = {
        id: Date.now().toString(),
        originalText: inputText,
        transformedText: transformedTextResult,
        timestamp: new Date(),
        durationMs: durationMs,
        modelId: selectedModel,
        modelName: currentModelDetails ? currentModelDetails.name : selectedModel,
        temperature: temperature,
        topP: topP,
        topK: topK,
        seed: actualSeedUsed,
        primaryTitle: primaryTitle?.trim() ? primaryTitle.trim() : undefined,
        secondaryTitle: finalTranslatedTitle, // Store the translated title here
      };
      setHistory(prevHistory => [newEntry, ...prevHistory].slice(0, 10));

    } catch (err) {
      console.error('Transformation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during transformation.';
      setError(`Failed to transform text: ${errorMessage}`);
      setOutputText(''); 
      setTranslatedTitle(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, systemInstruction, inputText, temperature, topP, topK, seed]);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(entry => entry.id !== id));
  }, []);

  const handleClearAllHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleResetSystemInstruction = useCallback(() => {
    setSystemInstruction(DEFAULT_SYSTEM_INSTRUCTION);
  }, []);

  const toggleOptionalSettings = () => {
    setIsOptionalSettingsOpen(prev => !prev);
  };

  const toggleTocFeature = () => {
    setIsTocFeatureOpen(prev => !prev);
  };

  const handleFetchNovelToc = useCallback(async () => {
    if (!novelTocUrlInput.trim()) {
      setFetchNovelTocError('Table of Contents URL cannot be empty.');
      return;
    }

    setFetchNovelTocError(null);
    setNovelChapters(null);
    
    let urlToFetch = novelTocUrlInput;

    // Check if URL needs extraction
    try {
        const parsedUrl = new URL(novelTocUrlInput);
        if (parsedUrl.hostname === 'truyenwikidich.net' && parsedUrl.pathname.startsWith('/truyen/')) {
            setIsExtractingLink(true);
            try {
                urlToFetch = await extractTruyenWikiDichNetBookIndexUrl(novelTocUrlInput);
            } catch (extractionError) {
                console.error('Failed to extract direct link from truyenwikidich.net:', extractionError);
                const errorMsg = extractionError instanceof Error ? extractionError.message : 'Unknown error during URL extraction.';
                setFetchNovelTocError(`Failed to prepare link for truyenwikidich.net: ${errorMsg}`);
                setIsExtractingLink(false);
                return;
            }
            setIsExtractingLink(false);
        }
    } catch (urlParseError) {
        // Not a valid URL, or not a truyenwikidich URL that needs special handling.
        // Proceed with original URL, error will be caught by fetch if invalid.
        console.warn('URL parsing for extraction check failed or not applicable:', urlParseError);
    }
    
    setIsFetchingNovelToc(true);

    try {
      // Use a CORS proxy to fetch the content from the client-side
      const proxiedUrlToFetch = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlToFetch)}`;
      const response = await fetch(proxiedUrlToFetch); // Use potentially extracted and proxied URL
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. The fetch was proxied to avoid CORS issues, but the request still failed. The target site might be down or blocking the proxy.`);
      }
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      const chapterListElement = doc.getElementById('chapterList');
      if (!chapterListElement || chapterListElement.tagName !== 'UL') {
          throw new Error(`Could not find the chapter list element: a <ul> with id="chapterList". Please ensure the URL is correct and the page has this specific structure.`);
      }
      
      const chapterAnchors = chapterListElement.querySelectorAll('li a[href]');
      const chapters: NovelChapter[] = [];

      if (chapterAnchors.length === 0) {
          throw new Error(`Found the <ul id="chapterList">, but no chapter links (e.g., <li><a href="...">...</a></li>) were found inside it. The list might be empty or structured differently.`);
      }

      for (let i = 0; i < chapterAnchors.length; i++) {
        const anchor = chapterAnchors[i] as HTMLAnchorElement;
        
        if (anchor && anchor.hasAttribute('href')) {
          const title = anchor.textContent?.trim() || `Chapter ${i + 1}`;
          let href = anchor.getAttribute('href')!;
          
          try {
            const absoluteUrl = new URL(href, urlToFetch).toString(); // Base absolute URL on the fetched URL (the original one, not proxied)
            chapters.push({ title, url: absoluteUrl });
          } catch (urlError) {
            console.warn(`Skipping invalid URL '${href}' for chapter '${title}':`, urlError);
          }
        }
      }

      if (chapters.length === 0) { 
          throw new Error(`Found the <ul id="chapterList"> element, but no valid <a> tags with 'href' attributes could be extracted from its list items. Please check if these elements correctly contain clickable chapter links.`);
      }

      setNovelChapters(chapters);
      setIsNovelTocModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch novel ToC:', err);
      let errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      
      if (err instanceof Error) {
        if (err.message.includes("Could not find the chapter list element") || 
            err.message.includes("Found the <ul id=\"chapterList\">") ||
            err.message.includes("HTTP error!")) {
          // Use the specific error message as is
        } else if (err.message.toLowerCase().includes('failed to fetch')) { 
          errorMessage = `Network error: ${err.message}. This can happen if the proxy service (allorigins.win) is down or your internet connection is unstable.`;
        } else {
          errorMessage = `Failed to fetch or parse chapters. Original error: ${err.message}`;
        }
      }
      setFetchNovelTocError(errorMessage);
    } finally {
      setIsFetchingNovelToc(false);
      setIsExtractingLink(false); // Ensure this is always reset
    }
  }, [novelTocUrlInput]);

  const handleChapterSelectFromToc = useCallback((chapterUrl: string) => {
    setIsNovelTocModalOpen(false);
    setInputAreaUrl(chapterUrl); 
    setAutoFetchUrlSignal(prev => prev + 1);
    setFetchedPrimaryTitleForTransform(null);
  }, []);

  const handleInputAreaTitlesFetched = useCallback((primary: string | null) => {
    setFetchedPrimaryTitleForTransform(primary);
  }, []);


  return (
    <>
      <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-[#fffaf0] text-gray-700">
        <Header />
        <main className="w-full max-w-4xl space-y-8">
          
          <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-gray-300">
            <button
              onClick={toggleOptionalSettings}
              className="w-full flex justify-between items-center text-left focus:outline-none py-2"
              aria-expanded={isOptionalSettingsOpen}
              aria-controls="optional-settings-content"
            >
              <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                Optional Settings
              </h2>
              <span 
                className="text-2xl text-gray-600 transition-transform duration-300 ease-in-out"
                style={{ transform: isOptionalSettingsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </button>
            {isOptionalSettingsOpen && (
              <div id="optional-settings-content" className="mt-6 space-y-6 border-t border-gray-200 pt-6 animate-fadeIn">
                <PromptEditor
                  systemInstruction={systemInstruction}
                  setSystemInstruction={setSystemInstruction}
                  onResetSystemInstruction={handleResetSystemInstruction}
                  isLoading={isLoading}
                />
                <ModelConfigurator
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  availableModels={AVAILABLE_TEXT_MODELS}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  topP={topP}
                  setTopP={setTopP}
                  topK={topK}
                  setTopK={setTopK}
                  seed={seed}
                  setSeed={setSeed}
                  isLoading={isLoading}
                  onOpenInfoModal={handleOpenInfoModal}
                />
              </div>
            )}
          </section>

          <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-cyan-300">
            <button
              onClick={toggleTocFeature}
              className="w-full flex justify-between items-center text-left focus:outline-none py-2"
              aria-expanded={isTocFeatureOpen}
              aria-controls="toc-feature-content"
            >
              <h2 className="text-xl font-semibold text-cyan-700" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                Table of Contents
              </h2>
              <span 
                className="text-2xl text-gray-600 transition-transform duration-300 ease-in-out"
                style={{ transform: isTocFeatureOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </button>
            {isTocFeatureOpen && (
              <div id="toc-feature-content" className="mt-6 space-y-6 border-t border-cyan-200 pt-6 animate-fadeIn">
                <FetchNovelTocFeature
                  novelTocUrl={novelTocUrlInput}
                  setNovelTocUrl={setNovelTocUrlInput}
                  onFetchToc={handleFetchNovelToc}
                  isLoadingApp={isLoading}
                  isExtractingLink={isExtractingLink}
                  isFetchingToc={isFetchingNovelToc}
                  fetchError={fetchNovelTocError}
                />
              </div>
            )}
          </section>

          <InputArea
            inputText={inputText}
            setInputText={setInputText}
            onTransform={() => handleTransform(fetchedPrimaryTitleForTransform ?? undefined)}
            isLoading={isLoading || isFetchingNovelToc || isExtractingLink}
            urlInputValue={inputAreaUrl}
            onUrlInputChange={setInputAreaUrl}
            autoFetchSignal={autoFetchUrlSignal}
            onTitlesFetched={handleInputAreaTitlesFetched}
          />

          {isLoading && (
            <div className="w-full my-6 flex flex-col items-center" aria-live="polite">
              <p className="text-pink-600 mb-2 text-lg" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                Transforming your narrative...
              </p>
              <IndeterminateProgressBar />
            </div>
          )}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
          </div>}
          
          {(outputText || translatedTitle) && !isLoading && (
            <OutputArea 
              transformedText={outputText} 
              durationMs={lastTransformationDuration}
              translatedTitle={translatedTitle}
            />
          )}
          
          <HistoryList
            history={history}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearAllHistory={handleClearAllHistory}
          />
        </main>
        <footer className="w-full max-w-4xl text-center py-8 mt-auto text-sm text-gray-500" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <p>Powered by Gemini API</p>
        </footer>
      </div>
      <Modal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        title={infoModalTitle}
        content={infoModalContent}
        isLoading={isInfoModalLoading}
        error={infoModalError}
      />
      <NovelTocModal
        isOpen={isNovelTocModalOpen}
        onClose={() => setIsNovelTocModalOpen(false)}
        chapters={novelChapters}
        onChapterSelect={handleChapterSelectFromToc}
        isLoading={isFetchingNovelToc || isExtractingLink} 
        error={fetchNovelTocError} 
        currentTocUrl={novelTocUrlInput}
      />
    </>
  );
};

export default App;
