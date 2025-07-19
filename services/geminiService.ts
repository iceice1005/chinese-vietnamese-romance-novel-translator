
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// This `process.env.API_KEY` is a string that Vite replaces at build time.
// It will be the actual key, or the literal string "undefined" if not set during build.
const apiKeyFromVite: string = process.env.API_KEY;

// Check if the key is the string "undefined" (meaning it wasn't set at build time),
// or if it's actually undefined/null/empty (which could happen if Vite's define had an issue,
// or if the key was an empty string).
if (
  apiKeyFromVite === "undefined" || // Literal string "undefined"
  apiKeyFromVite === undefined ||    // Actual undefined (shouldn't happen with JSON.stringify but belt-and-suspenders)
  apiKeyFromVite === null ||         // Actual null (同样,不应该发生)
  typeof apiKeyFromVite !== 'string' || // Not a string (very unlikely after Vite)
  apiKeyFromVite.trim() === ""       // Empty or whitespace-only string
) {
  let problemDetail = "";
  if (apiKeyFromVite === "undefined") {
    problemDetail = "The API key was the literal string 'undefined'. This typically means the API_KEY environment variable was not set or was empty in the build environment (e.g., Vercel).";
  } else if (apiKeyFromVite === undefined || apiKeyFromVite === null) {
    problemDetail = "The API key was 'undefined' or 'null' in the bundled code. This is unexpected if Vite's 'define' feature is working correctly.";
  } else if (typeof apiKeyFromVite !== 'string') {
    problemDetail = "The API key was not a string type after Vite's processing, which is highly unexpected.";
  } else if (apiKeyFromVite.trim() === "") {
    problemDetail = "The API key was an empty or whitespace-only string in the build environment.";
  } else {
    problemDetail = "An unexpected issue occurred with the API key."
  }

  const errorMessage = "Gemini API Key (process.env.API_KEY) is not configured or is invalid. " +
    "This application relies on the API_KEY being set as an environment variable during the build process (e.g., in Vercel settings). " +
    "Vite (the build tool) then embeds this key into the application. " +
    `DETAILS: ${problemDetail} ` +
    `The value received by the application for process.env.API_KEY was: '${String(apiKeyFromVite)}' (type: ${typeof apiKeyFromVite}). ` +
    "Please verify the API_KEY in your build environment settings and ensure it's not empty.";
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// If we reach here, apiKeyFromVite is a non-empty string and not the literal "undefined".
const ai = new GoogleGenAI({ apiKey: apiKeyFromVite });

export const transformTextViaGemini = async (
  modelName: string,
  systemInstruction: string,
  inputText: string,
  temperature: number,
  topP: number,
  topK: number,
  seed: number,
  translationContext?: string
): Promise<string> => {

  const modelConfig: Record<string, any> = {
    temperature: temperature,
    topP: topP,
    topK: topK,
    seed: seed
  };
  
  let contextInstruction = '';
  if (translationContext && translationContext.trim() !== '') {
    contextInstruction = `Dưới đây là một số hướng dẫn về ngữ cảnh và thuật ngữ từ các chương trước. Hãy tuân thủ chặt chẽ các hướng dẫn này để đảm bảo tính nhất quán:\n<context>\n${translationContext}\n</context>\n\n`;
  }

  const fullPrompt = `${contextInstruction}${systemInstruction}

---
**Văn bản gốc (tiếng Trung):**
${inputText}
---
**Bản dịch (tiếng Việt):**
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      config: modelConfig
    });
    
    const text = response.text;
    if (text === null || text === undefined || text.trim() === "") {
      throw new Error("Received an empty or invalid response from the AI. This could be due to: \n1. Overly restrictive or conflicting 'System Instruction'. \n2. Overly restrictive model parameters (e.g., Temperature near 0 with very low Top-K). \n3. The input text itself being problematic for the current configuration. \n4. Content being blocked by safety filters without a specific finishReason. \nPlease check these settings or try resetting to defaults.");
    }
    return text.trim();

  } catch (error) {
    console.error("Error calling Gemini API for text transformation:", error);
    let errorMessage = "An unknown error occurred while communicating with the Gemini API for text transformation.";
    if (error instanceof Error) {
        errorMessage = error.message; 
        const anyError = error as any;
        if (anyError.message && anyError.message.includes("candidate.finishReason")) {
             errorMessage = `Gemini API Error: Transformation stopped unexpectedly. This could be due to safety settings or reaching the maximum output tokens. Details: ${anyError.message}`;
        } else if (anyError.message && anyError.message.toLowerCase().includes("prompt_blocked")) {
          errorMessage = "Gemini API Error: The prompt was blocked, likely due to safety settings. Please revise your input or system instruction.";
        } else if (anyError.message && anyError.message.includes("API_KEY_INVALID") ) {
             errorMessage = "Gemini API Error: The API key is invalid or not authorized. Please check your API key configuration. This might also indicate the key was not correctly passed from the build environment.";
        } else if (anyError.message && (anyError.message.includes("400") || anyError.message.includes("INVALID_ARGUMENT"))) {
            errorMessage = `Gemini API Error: Invalid argument. This usually means the request was malformed or a parameter was incorrect. Original error: ${anyError.message}`;
        }
        if (!errorMessage.startsWith("Received an empty or invalid response from the AI")) {
             errorMessage = `Gemini API Error (Transformation): ${errorMessage}. Check console for more details.`;
        }
    }
    throw new Error(errorMessage);
  }
};

export const translateTitleViaGemini = async (
  modelName: string,
  chineseTitle: string,
): Promise<string> => {

  const titlePrompt = `Hãy dịch tiêu đề sách sau từ tiếng Trung sang tiếng Việt một cách tự nhiên và hấp dẫn. Chỉ trả về duy nhất chuỗi tiêu đề đã được dịch, không có bất kỳ văn bản nào khác.

Tiêu đề gốc (tiếng Trung): "${chineseTitle}"

Tiêu đề dịch (tiếng Việt):`;

  const modelConfig: Record<string, any> = {
    temperature: 0.4, // Slightly creative for a good title, but not too random
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: titlePrompt,
      config: modelConfig,
    });

    const text = response.text;
    if (text === null || text === undefined || text.trim() === "") {
      throw new Error("Received an empty response from the AI for title translation.");
    }
    // Remove potential quotes around the title, as models sometimes add them
    return text.trim().replace(/^["']|["']$/g, ''); 
  } catch (error) {
    console.error("Error calling Gemini API for title translation:", error);
    let errorMessage = "An unknown error occurred while communicating with the Gemini API for title translation.";
    if (error instanceof Error) {
        errorMessage = error.message;
        const anyError = error as any;
        if (anyError.message && anyError.message.toLowerCase().includes("prompt_blocked")) {
          errorMessage = "Gemini API Error: The title translation prompt was blocked.";
        } else {
            errorMessage = `Gemini API Error (Title Translation): ${errorMessage}.`;
        }
    }
    throw new Error(errorMessage);
  }
};

export const suggestChapterTitleViaGemini = async (
  modelName: string,
  promptTemplate: string,
  narrativeText: string,
  originalTitle?: string
): Promise<string> => {
  // Truncate narrative text to avoid overly large prompts for title generation
  const truncatedNarrative = narrativeText.length > 2000 ? narrativeText.substring(0, 2000) + "..." : narrativeText;

  const filledPrompt = promptTemplate
    .replace('{{narrativeText}}', truncatedNarrative)
    .replace('{{originalTitle}}', originalTitle || '(Không có)');

  const modelConfig = {
    temperature: 0.65, // Moderately creative for a good title
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: filledPrompt,
      config: modelConfig,
    });

    const text = response.text;
    if (!text || text.trim() === "") {
      throw new Error("Received an empty response from the AI for chapter title suggestion.");
    }
    // Remove potential quotes and markdown from the title
    return text.trim().replace(/^["'*# ]+|["'*# ]+$/g, '');
  } catch (error) {
    console.error("Error calling Gemini API for chapter title suggestion:", error);
    let errorMessage = "An unknown error occurred while communicating with the Gemini API for chapter title suggestion.";
    if (error instanceof Error) {
        errorMessage = error.message;
        const anyError = error as any;
        if (anyError.message && anyError.message.toLowerCase().includes("prompt_blocked")) {
          errorMessage = "Gemini API Error: The chapter title suggestion prompt was blocked.";
        } else {
            errorMessage = `Gemini API Error (Chapter Title Suggestion): ${errorMessage}.`;
        }
    }
    throw new Error(errorMessage);
  }
};


export const updateContextViaGemini = async (
  modelName: string,
  existingContext: string,
  chineseText: string,
  vietnameseTranslation: string
): Promise<string> => {
  const prompt = `Bạn là một trợ lý phân tích, có nhiệm vụ duy trì một danh sách thuật ngữ nhất quán cho dịch giả.
Dựa trên "Bối cảnh hiện tại", "Văn bản gốc mới" và "Bản dịch mới", hãy tạo ra một "Bối cảnh cập nhật".

QUY TẮC:
1. "Bối cảnh cập nhật" phải là một danh sách các thuật ngữ quan trọng (tên riêng, địa danh, xưng hô, cụm từ đặc biệt) và cách dịch nhất quán của chúng.
2. Kết hợp thông tin từ bối cảnh cũ và bổ sung các thuật ngữ mới từ văn bản mới. Nếu có mâu thuẫn, ưu tiên cách dịch trong "Bản dịch mới".
3. Giữ cho bối cảnh ngắn gọn, ở dạng "Thuật ngữ gốc -> Bản dịch".
4. Nếu "Bối cảnh hiện tại" trống, hãy tạo một bối cảnh mới từ đầu.
5. CHỈ trả về nội dung của "Bối cảnh cập nhật", không có bất kỳ lời giải thích hay tiêu đề nào.

---
**Bối cảnh hiện tại:**
${existingContext || '(trống)'}

---
**Văn bản gốc mới (tiếng Trung):**
${chineseText}

---
**Bản dịch mới (tiếng Việt):**
${vietnameseTranslation}

---
**Bối cảnh cập nhật:**
`;
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { temperature: 0.1 } // Low temp for factual, consistent output
    });
    const text = response.text;
     if (text === null || text === undefined) {
      throw new Error("Received a null or undefined response from the AI for context update.");
    }
    return text.trim();
  } catch(error) {
     console.error("Error calling Gemini API for context update:", error);
     let errorMessage = "An unknown error occurred while updating context.";
      if (error instanceof Error) {
        errorMessage = `Gemini API Error (Context Update): ${error.message}.`;
      }
      // Don't throw, just return existing context to not break the flow
      console.error(errorMessage);
      return existingContext; // Return old context on failure
  }
};
