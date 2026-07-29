import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

import { API_CONFIG, AI_API_URL } from './api-config';
import { createGatewayAuthInterceptor } from './gateway-auth.interceptor';

describe('gatewayAuthInterceptor', () => {
  const key = 'agw_test_key';

  // Runs the interceptor and hands back whatever request reached the next handler.
  function intercept(url: string, apiKey = key): HttpRequest<unknown> {
    let seen!: HttpRequest<unknown>;
    createGatewayAuthInterceptor(apiKey)(new HttpRequest('GET', url), req => {
      seen = req;
      return of();
    }).subscribe();
    return seen;
  }

  it('attaches the key to gateway requests', () => {
    expect(intercept(AI_API_URL).headers.get('X-API-Key')).toBe(key);
  });

  it('leaves third-party requests untouched so the key never leaks off-origin', () => {
    expect(intercept('https://example.com/api/v1/chat').headers.has('X-API-Key')).toBe(false);
  });

  it('sends no header when no key was injected, leaving an honest 401', () => {
    expect(intercept(AI_API_URL, '').headers.has('X-API-Key')).toBe(false);
  });

  it('covers every gateway endpoint the app calls', () => {
    for (const endpoint of Object.values(API_CONFIG.ENDPOINTS)) {
      expect(intercept(API_CONFIG.getUrl(endpoint)).headers.get('X-API-Key')).toBe(key);
    }
  });
});
