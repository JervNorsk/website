import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {JnWebsiteAppModule} from './jn-website-app.module';
import {JnWebsiteIntegrationPcgSeModule} from "./integrations/pcg/streaming/jn-website-integration-pcg-se.module";

const platform = platformBrowserDynamic();


if (window.location.pathname.startsWith("/integrations/pcg/streaming")) {
  console.debug("[Loading]", "https://github.com/JervNorsk/pcg-streaming-extension (integration)");
  platform
      .bootstrapModule(JnWebsiteIntegrationPcgSeModule)
      .catch(err => console.error(err));
} else {
  console.debug("[Loading]", "https://github.com/JervNorsk/website");
  platform
      .bootstrapModule(JnWebsiteAppModule)
      .catch(err => console.error(err));
}
