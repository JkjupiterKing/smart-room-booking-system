// src/app/app.config.ts

import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';  // Import routes correctly
import { provideRouter } from '@angular/router';  // Ensure provideRouter is imported
import { provideAnimations } from '@angular/platform-browser/animations';

// Other imports here

export const appConfig = {
  providers: [
    provideRouter(routes),  // Use the routes imported from app.routes.ts
    provideAnimations(),
    // Other providers here
    provideHttpClient(withFetch())
  ]
};