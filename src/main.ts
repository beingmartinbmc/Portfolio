import {enableProdMode, provideZoneChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import {AppComponent} from './app/app.component';
import {gatewayAuthInterceptor} from './app/config/gateway-auth.interceptor';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([gatewayAuthInterceptor])),
  ],
})
  .catch(err => console.error(err));
