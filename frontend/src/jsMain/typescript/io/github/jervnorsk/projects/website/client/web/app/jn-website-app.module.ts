import {NgModule} from '@angular/core';
import {JnWebsiteAppComponent} from "./jn-website-app.component";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnWebsiteAppRoutingModule} from "./jn-website-app-routing.module";
import {JnWebsiteThreeModule} from "../features/webgl/engines/three/jn-website-three.module";
import {BrowserModule} from "@angular/platform-browser";
import {NgxThreeModule} from "ngx-three";
import {JnWebsitePageComponent} from "./pages/jn-website-page.component";

@NgModule({
    declarations: [
        JnWebsiteAppComponent,
        JnWebsitePageComponent
    ],
    imports: [
        // App
        JnWebsiteAppRoutingModule,
        // Feature
        JnWebsiteThreeModule,
        // Foundation
        JnCoreModule,
        // Framework
        BrowserModule,
        NgxThreeModule
    ],
    providers: [],
    bootstrap: [
        JnWebsiteAppComponent
    ]
})
export class JnWebsiteAppModule {
}
