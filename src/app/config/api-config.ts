export const API_CONFIG = {
  // Base URL for all APIs
  BASE_URL: 'https://epic-backend-82b9dbzwq-beingmartinbmcs-projects.vercel.app',
  
  // API Endpoints
  ENDPOINTS: {
    // AI Chat API - used in environment files
    AI_GENERIC: '/api/generic',
    
    // Text-to-Speech API
    TEXT_TO_SPEECH: '/api/text-to-speech',
    
    // Streaming Voice API
    STREAMING_VOICE: '/api/stream-voice',
    
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