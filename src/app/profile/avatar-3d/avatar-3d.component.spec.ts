import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Avatar3dComponent } from './avatar-3d.component';
import { AchievementsService } from '../../services/achievements.service';
import { AudioService } from '../../services/audio.service';
import { environment } from '../../../environments/environment';
import { TTS_API_URL } from '../../config/api-config';

describe('Avatar3dComponent', () => {
  let component: Avatar3dComponent;
  let fixture: ComponentFixture<Avatar3dComponent>;
  let httpMock: HttpTestingController;
  let achievements: jasmine.SpyObj<AchievementsService>;
  let audio: jasmine.SpyObj<AudioService>;

  beforeEach(async () => {
    achievements = jasmine.createSpyObj('AchievementsService', ['trackAiQuestion']);
    audio = jasmine.createSpyObj('AudioService', ['play']);

    // Headless Chrome may expose software WebGL on Linux but not macOS. Keep
    // component tests deterministic and exercise the unavailable-WebGL path.
    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [Avatar3dComponent, HttpClientTestingModule],
      providers: [
        { provide: AchievementsService, useValue: achievements },
        { provide: AudioService, useValue: audio },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Avatar3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('degrades gracefully when WebGL is unavailable', () => {
    expect(component.webglAvailable).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('cleans up timers/listeners on destroy even if the 3D scene never booted', () => {
    const removeSpy = spyOn(window, 'removeEventListener').and.callThrough();
    expect(() => component.ngOnDestroy()).not.toThrow();
    expect(removeSpy).toHaveBeenCalledWith('resize', jasmine.any(Function));
  });

  describe('chat panel', () => {
    beforeEach(() => { component.ttsEnabled = false; });

    it('toggleChat opens the panel and seeds a welcome message', fakeAsync(() => {
      expect(component.isChatOpen).toBeFalse();
      component.toggleChat();
      tick(100);
      expect(component.isChatOpen).toBeTrue();
      expect(component.messages.length).toBe(1);
      expect(component.messages[0]!.isUser).toBeFalse();
    }));

    it('toggleChat focuses the input when refs are present', fakeAsync(() => {
      component.toggleChat();
      // Render the panel so the real @ViewChild refs resolve, then spy on the
      // actual input the deferred focus call will target.
      fixture.detectChanges();
      const focusSpy = spyOn(component.messageInput.nativeElement, 'focus');
      tick(100);
      expect(focusSpy).toHaveBeenCalled();
    }));

    it('toggleChat twice closes the panel without re-adding the welcome', fakeAsync(() => {
      component.toggleChat();
      tick(100);
      component.toggleChat();
      tick(100);
      expect(component.isChatOpen).toBeFalse();
      expect(component.messages.length).toBe(1);
    }));

    it('escape key closes an open chat', fakeAsync(() => {
      component.isChatOpen = true;
      component.onDocumentKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
      tick();
      expect(component.isChatOpen).toBeFalse();
    }));

    it('escape key does nothing when chat is closed', () => {
      component.isChatOpen = false;
      component.onDocumentKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(component.isChatOpen).toBeFalse();
    });
  });

  describe('sendMessage', () => {
    it('ignores empty input', fakeAsync(() => {
      component.userInput = '   ';
      component.sendMessage();
      tick();
      httpMock.expectNone(environment.aiApiUrl);
    }));

    it('posts to the AI API, renders the reply and fires a TTS request', fakeAsync(() => {
      component.ttsEnabled = true;
      component.userInput = 'Tell me about your work';
      component.sendMessage();

      expect(achievements.trackAiQuestion).toHaveBeenCalled();
      expect(audio.play).toHaveBeenCalledWith('jump');
      expect(component.isTyping).toBeTrue();

      const aiReq = httpMock.expectOne(environment.aiApiUrl);
      aiReq.flush({ choices: [{ message: { content: 'I build distributed systems.' } }] });
      tick();

      expect(component.messages.some(m => m.text === 'I build distributed systems.')).toBeTrue();
      expect(component.isTyping).toBeFalse();

      // TTS fired because ttsEnabled is true
      const ttsReq = httpMock.expectOne(TTS_API_URL);
      ttsReq.flush(new Blob(['audio'], { type: 'audio/mpeg' }));
      tick(200);
    }));

    it('does not fire TTS when disabled', fakeAsync(() => {
      component.ttsEnabled = false;
      component.userInput = 'Hi';
      component.sendMessage();

      const aiReq = httpMock.expectOne(environment.aiApiUrl);
      aiReq.flush({ choices: [{ message: { content: 'Hello there' } }] });
      tick(200);

      httpMock.expectNone(TTS_API_URL);
      expect(component.messages.some(m => m.text === 'Hello there')).toBeTrue();
    }));

    it('falls back to a default reply when the response has no text', fakeAsync(() => {
      component.ttsEnabled = false;
      component.userInput = 'Hi';
      component.sendMessage();
      const aiReq = httpMock.expectOne(environment.aiApiUrl);
      aiReq.flush({ choices: [] });
      tick(200);
      expect(component.messages.some(m => m.text.includes("couldn't process"))).toBeTrue();
    }));

    it('shows an error bubble when the API fails', fakeAsync(() => {
      component.ttsEnabled = false;
      component.userInput = 'Hi';
      component.sendMessage();
      const aiReq = httpMock.expectOne(environment.aiApiUrl);
      aiReq.flush('boom', { status: 500, statusText: 'Server Error' });
      tick(200);
      expect(component.messages.some(m => m.text.includes('temporarily unavailable'))).toBeTrue();
      expect(component.isTyping).toBeFalse();
    }));

    it('debounces rapid successive requests', fakeAsync(() => {
      component.ttsEnabled = false;
      component.userInput = 'first';
      component.sendMessage();
      const first = httpMock.expectOne(environment.aiApiUrl);
      first.flush({ choices: [{ message: { content: 'one' } }] });
      tick(200);

      // Immediately send again — should be blocked by the 1s debounce window.
      component.userInput = 'second';
      component.sendMessage();
      tick();
      httpMock.expectNone(environment.aiApiUrl);
    }));
  });

  describe('text-to-speech', () => {
    it('toggleTTS opts in, then stops speech when disabling', () => {
      const stopSpy = spyOn(component, 'stopSpeech').and.callThrough();
      expect(component.ttsEnabled).toBeFalse();
      component.toggleTTS();
      expect(component.ttsEnabled).toBeTrue();
      expect(stopSpy).not.toHaveBeenCalled();
      component.toggleTTS();
      expect(component.ttsEnabled).toBeFalse();
      expect(stopSpy).toHaveBeenCalled();
    });

    it('stopSpeech tears down any active audio', () => {
      const fakeAudio = jasmine.createSpyObj('HTMLAudioElement', ['pause']);
      fakeAudio.currentTime = 5;
      fakeAudio.src = 'blob:fake';
      (component as any).currentAudio = fakeAudio;
      spyOn(URL, 'revokeObjectURL');
      component.isSpeaking = true;
      component.stopSpeech();
      expect(fakeAudio.pause).toHaveBeenCalled();
      expect(component.isSpeaking).toBeFalse();
    });

    it('speakText ignores blank text', () => {
      const stopSpy = spyOn(component, 'stopSpeech');
      (component as any).speakText('   ');
      expect(stopSpy).not.toHaveBeenCalled();
    });

    it('speakText uses cached audio without hitting the TTS API', () => {
      const blob = new Blob(['cached'], { type: 'audio/mpeg' });
      (component as any).ttsCache.set('hello world', blob);
      const playSpy = spyOn<any>(component, 'playAudioBlob');
      (component as any).speakText('hello world');
      expect(playSpy).toHaveBeenCalledWith(blob);
      httpMock.expectNone(TTS_API_URL);
    });

    it('speakTextRegular caches and plays the TTS response', fakeAsync(() => {
      const playSpy = spyOn<any>(component, 'playAudioBlob');
      component.isSpeaking = true;
      (component as any).speakTextRegular('clean text', 'orig', false);
      const req = httpMock.expectOne(TTS_API_URL);
      const blob = new Blob(['audio'], { type: 'audio/mpeg' });
      req.flush(blob);
      tick();
      expect(playSpy).toHaveBeenCalled();
      expect((component as any).ttsCache.has('clean text')).toBeTrue();
    }));

    it('speakTextRegular handles a TTS network error gracefully', fakeAsync(() => {
      component.isSpeaking = true;
      (component as any).speakTextRegular('clean', 'orig', true);
      const req = httpMock.expectOne(TTS_API_URL);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown' });
      tick();
      expect(component.isTyping).toBeFalse();
    }));
  });

  describe('3D model animation hooks', () => {
    it('prepare/finalize are safe no-ops when no model is loaded', () => {
      expect(() => component.prepare3DModelForSpeech()).not.toThrow();
      expect(() => component.finalize3DModelAnimation()).not.toThrow();
    });

    it('isReallyTyping / isReallySpeaking reflect internal flags', () => {
      component.isTyping = true;
      component.isSpeaking = true;
      expect(component.isReallyTyping).toBeTrue();
      expect(component.isReallySpeaking).toBeTrue();
    });

    it('prepare3DModelForSpeech animates a present model', () => {
      (component as any).model = { position: { y: 1 } };
      component.isSpeaking = true;
      expect(() => component.prepare3DModelForSpeech()).not.toThrow();
      component.isSpeaking = false;
      expect(() => component.finalize3DModelAnimation()).not.toThrow();
    });
  });
});
