import {NgModule} from '@angular/core';
import {JnWebsiteApp} from "./jn-website-app.component";
import {JnWebsiteAppRoutingModule} from "./jn-website-app-routing.module";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    JnWebsiteApp
  ],
  imports: [
    // Module
    // ----------------------------------------------------
    JnWebsiteAppRoutingModule,

    // Framework
    // ----------------------------------------------------
    BrowserModule,
  ],
  providers: [],
  bootstrap: [
    // Module
    // ----------------------------------------------------
    JnWebsiteApp
  ]
})
export class JnWebsiteAppModule {
}
