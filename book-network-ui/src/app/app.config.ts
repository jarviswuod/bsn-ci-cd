import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApiConfiguration } from './services/api-configuration';

import { httpTokenInterceptor } from './services/interceptor/http-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([httpTokenInterceptor])),
    provideApiConfiguration('http://192.168.0.227:8090/api/v1'),
  ],
};
