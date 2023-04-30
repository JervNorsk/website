import {NgModule} from '@angular/core';
import {JnWebsiteAppComponent} from "./jn-website-app.component";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnWebsiteAppRoutingModule} from "./jn-website-app-routing.module";
import {JnWebsiteThreeModule} from "../features/webgl/engines/three/jn-website-three.module";
import {BrowserModule} from "@angular/platform-browser";
import {JnThreeModule} from "../../../../../foundation/client/web/features/webgl/engines/three/jn-three.module";

@NgModule({
    declarations: [
        JnWebsiteAppComponent
    ],
    imports: [
        // App
        JnWebsiteAppRoutingModule,
        // Feature
        JnWebsiteThreeModule,
        // Foundation
        JnCoreModule,
        // Framework
        BrowserModule
    ],
    providers: [],
    bootstrap: [
        JnWebsiteAppComponent
    ]
})
export class JnWebsiteAppModule {
}
