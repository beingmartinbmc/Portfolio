export interface VoiceStreamingDebugInfo {
  isStreamActive: boolean;
  isAudioPlaying: boolean;
  audioQueueLength: number;
  currentRetryCount: number;
  maxRetries: number;
  lastError?: any;
  streamingMode: 'voice' | 'text-only' | 'fallback';
  performance: {
    streamStartTime?: number;
    audioStartTime?: number;
    totalMessages: number;
  };
}

export class VoiceStreamingDebugger {
  private debugInfo: VoiceStreamingDebugInfo = {
    isStreamActive: false,
    isAudioPlaying: false,
    audioQueueLength: 0,
    currentRetryCount: 0,
    maxRetries: 3,
    streamingMode: 'voice',
    performance: {
      totalMessages: 0
    }
  };

  updateStatus(updates: Partial<VoiceStreamingDebugInfo>): void {
    this.debugInfo = { ...this.debugInfo, ...updates };
  }

  getDebugInfo(): VoiceStreamingDebugInfo {
    return { ...this.debugInfo };
  }

  log(message: string, data?: any): void {
    if (environment.production) return;
    
    console.log(`[VoiceStreaming Debug] ${message}`, data || '');
    console.table(this.debugInfo);
  }

  reset(): void {
    this.debugInfo = {
      isStreamActive: false,
      isAudioPlaying: false,
      audioQueueLength: 0,
      currentRetryCount: 0,
      maxRetries: 3,
      streamingMode: 'voice',
      performance: {
        totalMessages: 0
      }
    };
  }
}

// Export for use in development
declare global {
  interface Window {
    voiceStreamingDebugger?: VoiceStreamingDebugger;
  }
}

import { environment } from '../../environments/environment';