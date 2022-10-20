import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app/app.component';
import { appRouting } from './app/app.routing';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  console.log('test');
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(RouterModule.forRoot(appRouting)),
  ],
}).catch(console.error);
