import {NgModule} from '@angular/core';
import {JnStreamingApp} from "./jn-streaming-app.component";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnStreamingAppRoutingModule} from "./jn-streaming-app-routing.module";
import {JnStreamingSceneMain} from "./scenes/main/jn-streaming-scene-main.component";
import {JnStreamingThModule} from "../features/webgl/engines/three/jn-streaming-th.module";

@NgModule({
    declarations: [
        JnStreamingApp,
        JnStreamingSceneMain
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnStreamingAppRoutingModule,

        // Feature
        // -------------------------------------------------------------------------------------------------------------
        JnStreamingThModule,

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
export class JnStreamingAppModule {
}
