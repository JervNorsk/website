import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {JnWebsiteAppModule} from './app/jn-website-app.module';
import {provideRouter, Routes, withDebugTracing} from "@angular/router";

const appRoutes: Routes = []

platformBrowserDynamic()
    .bootstrapModule(JnWebsiteAppModule)
    .catch(err => console.error(err));
