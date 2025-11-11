import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { STREAMING_VOICE_API_URL } from '../config/api-config';

export interface VoiceStreamOptions {
  audioFormat?: 'mp3' | 'wav';
  voiceModel?: string;
  sampleRate?: number;
  naturalBreaks?: boolean;
  chunkSize?: number;
}

export interface AudioChunk {
  chunkIndex: number;
  audioData: string; // base64 encoded
  mimeType: string;
  estimatedDuration: number;
  text: string;
  timing: any;
}

export interface VoiceStreamCallbacks {
  onStart?: (data: any) => void;
  onText?: (content: string) => void;
  onAudio?: (chunk: AudioChunk) => void;
  onComplete?: (data: any) => void;
  onError?: (error: any) => void;
  onFallback?: (data: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class VoiceStreamingService {
  private eventSource?: EventSource;
  private audioQueue: AudioChunk[] = [];
  private isPlaying = false;
  private currentAudio?: HTMLAudioElement;
  private audioContext?: AudioContext;

  constructor(private http: HttpClient) {}

  async startVoiceStream(
    prompt: string, 
    context: string = "You are a helpful 3D model assistant.",
    options: VoiceStreamOptions = {},
    callbacks: VoiceStreamCallbacks = {}
  ): Promise<EventSource> {
    // Close any existing stream
    this.stopStream();

    const voiceSettings = {
      audioFormat: 'mp3',
      voiceModel: 'aura-2-draco-en',
      sampleRate: 24000,
      naturalBreaks: true,
      chunkSize: 30,
      ...options
    };

    // Initialize audio context if not exists
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // First, send the POST request to initiate streaming
    try {
      await this.http.post(STREAMING_VOICE_API_URL, {
        prompt,
        context,
        voiceSettings
      }).toPromise();
    } catch (error) {
      console.error('Failed to initiate voice stream:', error);
      callbacks.onError?.(error);
      throw error;
    }

    // Then, establish SSE connection
    this.eventSource = new EventSource(STREAMING_VOICE_API_URL);

    // Set up event listeners
    this.eventSource.addEventListener('start', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log('🎤 Voice streaming started:', data);
      callbacks.onStart?.(data);
    });

    this.eventSource.addEventListener('text', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      callbacks.onText?.(data.content);
    });

    this.eventSource.addEventListener('audio', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const audioChunk: AudioChunk = {
        chunkIndex: data.chunkIndex,
        audioData: data.audio,
        mimeType: data.mimeType,
        estimatedDuration: data.estimatedDuration,
        text: data.text,
        timing: data.timing
      };
      
      this.queueAudioChunk(audioChunk);
      callbacks.onAudio?.(audioChunk);
    });

    this.eventSource.addEventListener('done', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log('✅ Voice streaming completed:', data);
      callbacks.onComplete?.(data);
      this.stopStream();
    });

    this.eventSource.addEventListener('error', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.error('❌ Voice streaming error:', data);
      callbacks.onError?.(data);
    });

    this.eventSource.addEventListener('fallback', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log('🔄 Falling back to text-only mode:', data);
      callbacks.onFallback?.(data);
    });

    this.eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      callbacks.onError?.(error);
    };

    return this.eventSource;
  }

  private queueAudioChunk(chunk: AudioChunk): void {
    this.audioQueue.push(chunk);
    this.audioQueue.sort((a, b) => a.chunkIndex - b.chunkIndex);
    
    if (!this.isPlaying) {
      this.playNextChunk();
    }
  }

  private async playNextChunk(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const chunk = this.audioQueue.shift()!;

    try {
      // Decode base64 audio
      const audioData = atob(chunk.audioData);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      // Create audio URL and play
      const blob = new Blob([arrayBuffer], { type: chunk.mimeType });
      const audioUrl = URL.createObjectURL(blob);
      
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.preload = 'auto';
      this.currentAudio.volume = 1.0;

      this.currentAudio.onended = () => {
        this.cleanupCurrentAudio();
        this.playNextChunk(); // Play next chunk
      };

      this.currentAudio.onerror = (error) => {
        console.error('Audio playback error:', error);
        this.cleanupCurrentAudio();
        this.playNextChunk(); // Skip and continue
      };

      await this.currentAudio.play();
      
    } catch (error) {
      console.error('Error processing audio chunk:', error);
      this.playNextChunk(); // Skip this chunk and continue
    }
  }

  private cleanupCurrentAudio(): void {
    if (this.currentAudio) {
      if (this.currentAudio.src) {
        URL.revokeObjectURL(this.currentAudio.src);
      }
      this.currentAudio = undefined;
    }
  }

  public stopStream(): void {
    // Close EventSource
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }

    // Stop current audio
    this.stopAudio();

    // Clear audio queue
    this.audioQueue = [];
  }

  public stopAudio(): void {
    this.isPlaying = false;
    
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.cleanupCurrentAudio();
    }
  }

  public isStreamActive(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying || (this.currentAudio && !this.currentAudio.paused);
  }

  public getAudioQueueLength(): number {
    return this.audioQueue.length;
  }

  public getStreamingStatus(): { 
    isActive: boolean; 
    isPlaying: boolean; 
    queueLength: number; 
    hasErrors: boolean;
  } {
    return {
      isActive: this.isStreamActive(),
      isPlaying: this.isAudioPlaying(),
      queueLength: this.getAudioQueueLength(),
      hasErrors: false // You can track errors here
    };
  }

  public async retryLastStream(): Promise<void> {
    // Implement retry logic if needed
    console.log('🔄 Retry functionality - to be implemented based on stored request');
  }

  public clearAudioCache(): void {
    // Clear any cached audio data to free memory
    this.audioQueue = [];
    this.stopAudio();
  }
}