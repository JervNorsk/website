import {NgModule} from '@angular/core';
import {JnAiHaraldApp} from "./jn-ai-harald-app.component";
import {JnAiHaraldAppRoutingModule} from "./jn-ai-harald-app-routing.module";
import {JnAiHaraldThModule} from "../features/webgl/engines/three/jn-ai-harald-th.module";
import {JnCoreModule} from "../../../../../../foundation/client/web/features/core/jn-core.module";

@NgModule({
    declarations: [
        JnAiHaraldApp,
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnAiHaraldAppRoutingModule,

        // Feature
        // -------------------------------------------------------------------------------------------------------------
        JnAiHaraldThModule,

        // Foundation
        // -------------------------------------------------------------------------------------------------------------
        JnCoreModule,

        // Lib
        // -------------------------------------------------------------------------------------------------------------

        // Framework
        // -------------------------------------------------------------------------------------------------------------
    ],
    providers: [],
})
export class JnAiHaraldAppModule {
}
