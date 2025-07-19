
export interface TransformationEntry {
  id: string;
  originalText: string;
  transformedText: string;
  timestamp: Date;
  durationMs?: number; 
  modelId?: string; 
  modelName?: string; 
  temperature?: number;
  topP?: number;
  topK?: number;
  seed?: number; 
  primaryTitle?: string; // Renamed from customTitlePrefix, for the first fetched title (Name)
  secondaryTitle?: string; // Added for the second fetched title (Chapter)
  translationContext?: string; // The context used for this transformation
}

export interface NovelChapter {
  title: string;
  url: string;
}
