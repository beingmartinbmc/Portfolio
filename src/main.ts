import {provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import {AppComponent} from './app/app.component';
import {gatewayAuthInterceptor} from './app/config/gateway-auth.interceptor';

// Zoneless: every component is OnPush and marks itself for check after async work.
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([gatewayAuthInterceptor])),
  ],
})
  .catch(err => console.error(err));
