export const API_CONFIG = {
  // Base URL for all APIs
  BASE_URL: 'https://ai-gateway-production-0388.up.railway.app',

  // API Endpoints
  ENDPOINTS: {
    // AI Chat API - used in environment files
    AI_GENERIC: '/api/v1/openai-proxy',

    // Text-to-Speech API
    TEXT_TO_SPEECH: '/api/v1/tts',

    // Combined chat + synthesized speech stream API
    STREAMING_VOICE: '/api/v1/voice/stream',

    // Add other endpoints here as needed
    // MUSIC: '/api/music',
    // PROFILE: '/api/profile',
  },

  // Helper method to get full URL
  getUrl(endpoint: string): string {
    return `${this.BASE_URL}${endpoint}`;
  }
};

// Export specific URLs for convenience
export const AI_API_URL = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.AI_GENERIC);
export const TTS_API_URL = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TEXT_TO_SPEECH);
export const STREAMING_VOICE_API_URL = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.STREAMING_VOICE);

type OpenAiProxyRole = 'system' | 'user' | 'assistant';

export interface OpenAiProxyMessage {
  role: OpenAiProxyRole;
  content: string;
}

export function createOpenAiProxyRequest(messages: OpenAiProxyMessage[], maxTokens = 1000) {
  return {
    model: 'gpt-5-nano',
    maxTokens,
    messages,
  };
}

export function getAiResponseText(response: any): string | null {
  const candidates = [
    response?.data?.choices?.[0]?.message?.content,
    response?.choices?.[0]?.message?.content,
    response?.data?.response,
    response?.data?.message,
    response?.data?.answer,
    response?.data?.content,
    response?.response,
    response?.message,
    response?.answer,
    response?.content,
  ];

  return candidates.find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0)?.trim() ?? null;
}
