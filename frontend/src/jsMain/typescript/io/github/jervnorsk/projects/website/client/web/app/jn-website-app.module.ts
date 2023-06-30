import {NgModule} from '@angular/core';
import {JnWebsiteApp} from "./jn-website-app.component";
import {JnWebsiteAppRoutingModule} from "./jn-website-app-routing.module";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {BrowserModule} from "@angular/platform-browser";
import {JnWebsitePage} from "../pages/jn-website-page.component";
import {JnWebsiteThModule} from "../features/webgl/engines/three/jn-website-th.module";

@NgModule({
    declarations: [
        JnWebsiteApp
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnWebsiteAppRoutingModule,

        // Feature
        // -------------------------------------------------------------------------------------------------------------

        // Foundation
        // -------------------------------------------------------------------------------------------------------------
        JnCoreModule,

        // Lib
        // -------------------------------------------------------------------------------------------------------------

        // Framework
        // -------------------------------------------------------------------------------------------------------------
        BrowserModule,
    ],
    providers: [],
    bootstrap: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnWebsiteApp
    ]
})
export class JnWebsiteAppModule {
}
