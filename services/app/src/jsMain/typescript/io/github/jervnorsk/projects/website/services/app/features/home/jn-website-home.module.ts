import {NgModule} from '@angular/core';
import {JnWebsiteHomeRoutingModule} from "./jn-website-home-routing.module";
import {JnWebsiteHome} from "./jn-website-home.component";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    JnWebsiteHome
  ],
  imports: [
    // Module
    // ----------------------------------------------------
    JnWebsiteHomeRoutingModule,

    // Framework
    // ----------------------------------------------------
    CommonModule,
  ],
})
export class JnWebsiteHomeModule {
}
