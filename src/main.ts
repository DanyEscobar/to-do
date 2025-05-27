import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideRemoteConfig } from '@angular/fire/remote-config';
import { environment } from 'firebase-config';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig } from 'firebase/remote-config';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => {
      const remoteConfig = getRemoteConfig();
      remoteConfig.settings = {
        minimumFetchIntervalMillis: 0,
        fetchTimeoutMillis: 10000
      };
      return remoteConfig;
    })
  ],
});
