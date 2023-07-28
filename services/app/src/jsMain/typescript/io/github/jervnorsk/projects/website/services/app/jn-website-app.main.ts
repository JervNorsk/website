import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {JnWebsiteAppModule} from './jn-website-app.module';

platformBrowserDynamic()
    .bootstrapModule(JnWebsiteAppModule)
    .catch(err => console.error(err));
