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
  ): Promise<void> {
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

    try {
      // Single POST request that returns SSE stream
      const response = await fetch(STREAMING_VOICE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ 
          prompt, 
          context, 
          voiceSettings 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read the SSE stream from the response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      // Process SSE events
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('✅ Stream completed');
              callbacks.onComplete?.({ message: 'Stream completed successfully' });
              break;
            }

            // Decode the chunk and add to buffer
            const decodedChunk = decoder.decode(value, { stream: true });
            buffer += decodedChunk;
            
            // Debug: Log raw data to understand what we're receiving
            console.debug('Received SSE chunk:', decodedChunk.substring(0, 100));
            
            // Process complete SSE events in buffer
            const events = buffer.split('\n\n');
            buffer = events.pop() || ''; // Keep incomplete event in buffer

            for (const eventText of events) {
              if (eventText && typeof eventText === 'string' && eventText.trim()) {
                console.debug('Processing event:', eventText.substring(0, 50));
                try {
                  this.processSSEEvent(eventText.trim(), callbacks);
                } catch (error) {
                  console.error('Error processing SSE event:', error, { eventText: eventText.substring(0, 100) });
                }
              }
            }
          }
        } catch (error) {
          console.error('Error reading stream:', error);
          callbacks.onError?.(error);
        }
      };

      // Start processing the stream
      processStream();

    } catch (error) {
      console.error('Failed to start voice stream:', error);
      callbacks.onError?.(error);
      throw error;
    }
  }

  private processSSEEvent(eventText: string, callbacks: VoiceStreamCallbacks): void {
    // Ensure eventText is a valid string
    if (!eventText || typeof eventText !== 'string') {
      console.warn('Invalid eventText received:', eventText);
      return;
    }

    try {
      const lines = eventText.split('\n');
      let eventType = '';
      let eventData = '';

      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventType = line.substring(6).trim();
        } else if (line.startsWith('data:')) {
          eventData = line.substring(5).trim();
        }
      }

      if (!eventType || !eventData) {
        console.warn('Missing eventType or eventData:', { eventType, eventData });
        return;
      }

      const data = JSON.parse(eventData);

      switch (eventType) {
        case 'start':
          console.log('🎤 Voice streaming started:', data);
          callbacks.onStart?.(data);
          break;

        case 'text':
          callbacks.onText?.(data.content);
          break;

        case 'audio':
          // Validate required audio chunk properties
          if (!data.chunkIndex && data.chunkIndex !== 0) {
            console.warn('Audio chunk missing chunkIndex:', data);
            return;
          }
          if (!data.audio) {
            console.warn('Audio chunk missing audio data:', data);
            return;
          }
          
          const audioChunk: AudioChunk = {
            chunkIndex: data.chunkIndex,
            audioData: data.audio,
            mimeType: data.mimeType || 'audio/mp3',
            estimatedDuration: data.estimatedDuration || 0,
            text: data.text || '', // Ensure we have a string, default to empty
            timing: data.timing
          };
          
          this.queueAudioChunk(audioChunk);
          callbacks.onAudio?.(audioChunk);
          break;

        case 'done':
          console.log('✅ Voice streaming completed:', data);
          callbacks.onComplete?.(data);
          break;

        case 'error':
          console.error('❌ Voice streaming error:', data);
          callbacks.onError?.(data);
          break;

        case 'fallback':
          console.log('🔄 Falling back to text-only mode:', data);
          callbacks.onFallback?.(data);
          break;

        default:
          console.log('Unknown event type:', eventType, data);
      }
    } catch (error) {
      console.error('Error parsing SSE event data:', error, { 
        eventText: typeof eventText === 'string' ? eventText.substring(0, 100) : eventText 
      });
      // Don't call the error callback for parsing errors to avoid infinite loops
    }
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
    // No need to close EventSource since we're using fetch with reader
    console.log('🛑 Stopping voice stream');
    
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
    // Since we're using fetch with reader, we can track if we're actively processing
    return this.isPlaying || this.audioQueue.length > 0;
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

  private cleanTextForSpeech(text: string): string {
    // Handle null, undefined, or non-string inputs
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    try {
      // Remove markdown formatting and special characters
      return text
        .replace(/\*\*\*(.*?)\*\*\*/g, '$1') // Remove bold italic ***text***
        .replace(/\*\*(.*?)\*\*/g, '$1')     // Remove bold **text**
        .replace(/\*(.*?)\*/g, '$1')         // Remove italic *text*
        .replace(/__(.*?)__/g, '$1')         // Remove bold __text__
        .replace(/_(.*?)_/g, '$1')           // Remove italic _text_
        .replace(/`(.*?)`/g, '$1')           // Remove inline code `text`
        .replace(/```[\s\S]*?```/g, '')      // Remove code blocks
        .replace(/#{1,6}\s*/g, '')           // Remove headers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images, keep alt text
        .replace(/[#*`_~\[\]()]/g, '')       // Remove remaining markdown chars
        .replace(/[👋😅🤖💡🔊🔇⏹️⏳]/g, '') // Remove emojis
        .replace(/\s+/g, ' ')                // Normalize whitespace
        .trim();
    } catch (error) {
      console.error('Error cleaning text for speech:', error);
      return String(text); // Fallback to string conversion
    }
  }
}