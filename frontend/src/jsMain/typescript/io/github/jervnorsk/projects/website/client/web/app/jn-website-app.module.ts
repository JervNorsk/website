import {NgModule} from '@angular/core';
import {JnWebsiteApp} from "./jn-website-app.component";
import {JnWebsiteAppRoutingModule} from "./jn-website-app-routing.module";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {BrowserModule} from "@angular/platform-browser";
import {JnWebsitePage} from "./pages/jn-website-page.component";
import {NgxThreeModule} from "ngx-three";
import {JnWebsiteThModule} from "../features/webgl/engines/three/jn-website-th.module";

@NgModule({
    declarations: [
        JnWebsiteApp,
        JnWebsitePage
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnWebsiteAppRoutingModule,

        // Feature
        // -------------------------------------------------------------------------------------------------------------
        JnWebsiteThModule,

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
