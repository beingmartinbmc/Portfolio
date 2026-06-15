import {
  API_CONFIG,
  AI_API_URL,
  TTS_API_URL,
  STREAMING_VOICE_API_URL,
  createOpenAiProxyRequest,
  getAiResponseText,
} from './api-config';

describe('api-config', () => {
  describe('getUrl / exported URLs', () => {
    it('joins the base URL with an endpoint', () => {
      expect(API_CONFIG.getUrl('/api/v1/test')).toBe(`${API_CONFIG.BASE_URL}/api/v1/test`);
    });

    it('exposes fully-qualified URLs derived from the config', () => {
      expect(AI_API_URL).toBe(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.AI_GENERIC));
      expect(TTS_API_URL).toBe(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TEXT_TO_SPEECH));
      expect(STREAMING_VOICE_API_URL).toBe(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.STREAMING_VOICE));
    });

    it('uses an https base URL (no plaintext transport)', () => {
      expect(API_CONFIG.BASE_URL.startsWith('https://')).toBeTrue();
    });
  });

  describe('createOpenAiProxyRequest', () => {
    const messages = [
      { role: 'system' as const, content: 'you are nova' },
      { role: 'user' as const, content: 'hi' },
    ];

    it('wraps messages with the default model and token budget', () => {
      const req = createOpenAiProxyRequest(messages);
      expect(req.model).toBe('gpt-5-nano');
      expect(req.maxTokens).toBe(1000);
      expect(req.messages).toBe(messages);
    });

    it('honours a custom maxTokens value', () => {
      expect(createOpenAiProxyRequest(messages, 256).maxTokens).toBe(256);
    });

    it('supports an empty conversation', () => {
      expect(createOpenAiProxyRequest([]).messages).toEqual([]);
    });
  });

  describe('getAiResponseText', () => {
    it('reads the OpenAI-style choices path first', () => {
      const res = { data: { choices: [{ message: { content: '  hello  ' } }] } };
      expect(getAiResponseText(res)).toBe('hello');
    });

    it('falls back through the supported shapes in priority order', () => {
      expect(getAiResponseText({ choices: [{ message: { content: 'top-level choice' } }] })).toBe('top-level choice');
      expect(getAiResponseText({ data: { response: 'data.response' } })).toBe('data.response');
      expect(getAiResponseText({ data: { answer: 'data.answer' } })).toBe('data.answer');
      expect(getAiResponseText({ message: 'bare message' })).toBe('bare message');
      expect(getAiResponseText({ content: 'bare content' })).toBe('bare content');
    });

    it('prefers the deeper choices path over a bare content field', () => {
      const res = {
        data: { choices: [{ message: { content: 'preferred' } }] },
        content: 'ignored',
      };
      expect(getAiResponseText(res)).toBe('preferred');
    });

    it('skips empty/whitespace candidates and returns the first usable one', () => {
      const res = { data: { response: '   ' }, message: 'usable' };
      expect(getAiResponseText(res)).toBe('usable');
    });

    it('returns null when nothing usable is present', () => {
      expect(getAiResponseText({})).toBeNull();
      expect(getAiResponseText(null)).toBeNull();
      expect(getAiResponseText(undefined)).toBeNull();
      expect(getAiResponseText({ data: { choices: [] } })).toBeNull();
      expect(getAiResponseText({ message: 123 })).toBeNull();
    });
  });
});
