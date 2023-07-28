import {NgModule} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {JnWebsiteIntegrationPcgSe} from "./jn-website-integration-pcg-se.component";
import {JnWebsiteIntegrationPcgSeRoutingModule} from "./jn-website-integration-pcg-se-routing.module";

@NgModule({
  declarations: [
    JnWebsiteIntegrationPcgSe
  ],
  imports: [
    // Module
    // ----------------------------------------------------
    JnWebsiteIntegrationPcgSeRoutingModule,

    // Framework
    // ----------------------------------------------------
    BrowserModule,
  ],
  providers: [],
  bootstrap: [
    // Module
    // ----------------------------------------------------
    JnWebsiteIntegrationPcgSe
  ]
})
export class JnWebsiteIntegrationPcgSeModule {
}
