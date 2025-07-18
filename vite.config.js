
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Directly access process.env.API_KEY. Vercel should make this available
  // to the build script's environment.
  const apiKeyFromBuildEnv = process.env.API_KEY;

  // Crucial logging: Check your Vercel build logs for these messages.
  console.log(`[VITE_CONFIG_DEBUG] Running in mode: ${mode}`);
  console.log('[VITE_CONFIG_DEBUG] Attempting to read API_KEY directly from process.env in vite.config.js.');
  
  if (apiKeyFromBuildEnv) {
    console.log('[VITE_CONFIG_DEBUG] API_KEY found in build environment. Length:', apiKeyFromBuildEnv.length); // Log length to ensure it's not an empty string
    // Avoid logging the key itself for security, but confirm its presence.
    console.log('[VITE_CONFIG_DEBUG] API_KEY will be injected into the application bundle.');
  } else {
    console.error('[VITE_CONFIG_DEBUG] CRITICAL: API_KEY is UNDEFINED or EMPTY in the Vercel build environment!');
    console.error('[VITE_CONFIG_DEBUG] This means process.env.API_KEY was not set or not accessible during the build.');
    console.error('[VITE_CONFIG_DEBUG] The application will NOT be able to initialize the Gemini API client.');
  }

  return {
    plugins: [react()],
    define: {
      // This will replace 'process.env.API_KEY' in your client-side code
      // with the actual value of apiKeyFromBuildEnv.
      // If apiKeyFromBuildEnv is undefined, it will be replaced with 'undefined'.
      'process.env.API_KEY': JSON.stringify(apiKeyFromBuildEnv)
    }
  };
});
