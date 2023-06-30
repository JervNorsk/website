import {NgModule} from '@angular/core';
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnWebsitePage} from "../pages/jn-website-page.component";
import {JnWebsiteThModule} from "../features/webgl/engines/three/jn-website-th.module";

@NgModule({
    declarations: [
        JnWebsitePage
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        // JnWebsiteAppRoutingModule,

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
    ],
    providers: []
})
export class JnWebsitePageModule {
}
