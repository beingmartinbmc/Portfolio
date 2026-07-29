import { HttpInterceptorFn } from '@angular/common/http';

import { API_CONFIG } from './api-config';

// Substituted at build time by `ng build --define` (see the build:prod script), which
// sources it from a CI secret. Declared rather than imported so a build without the
// flag still compiles — `typeof` on an unreplaced identifier yields 'undefined' instead
// of throwing, which is what `ng serve` and `ng test` rely on.
declare const AI_GATEWAY_API_KEY: string;

const injectedKey = typeof AI_GATEWAY_API_KEY === 'string' ? AI_GATEWAY_API_KEY : '';

/**
 * Attaches the gateway API key to gateway-bound requests.
 *
 * The gateway answers 401 to unauthenticated /api/** calls. The key identifies this app
 * for per-caller rate limiting and revocation; it is inlined into a public bundle, so it
 * is an identifier rather than a secret.
 *
 * Scoped to the gateway origin so the key is never attached to third-party hosts. When
 * no key was injected the request goes out unchanged, leaving an honest 401 rather than
 * a header reading "undefined".
 */
export function createGatewayAuthInterceptor(apiKey: string): HttpInterceptorFn {
  return (req, next) => {
    if (!apiKey || !req.url.startsWith(API_CONFIG.BASE_URL)) {
      return next(req);
    }
    return next(req.clone({ setHeaders: { 'X-API-Key': apiKey } }));
  };
}

export const gatewayAuthInterceptor = createGatewayAuthInterceptor(injectedKey);
