import {NgModule} from '@angular/core';
import {JnStreamingApp} from "./jn-streaming-app.component";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnStreamingAppRoutingModule} from "./jn-streaming-app-routing.module";
import {JnStreamingSceneMain} from "./scenes/main/jn-streaming-scene-main.component";
import {JnStreamingThModule} from "../features/webgl/engines/three/jn-streaming-th.module";
import {JnStreamingSceneGameLozTok} from "./scenes/games/loz/tok/jn-streaming-scene-game-loz-tok.component";

@NgModule({
    declarations: [
        JnStreamingApp,
        JnStreamingSceneMain,
        JnStreamingSceneGameLozTok
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
