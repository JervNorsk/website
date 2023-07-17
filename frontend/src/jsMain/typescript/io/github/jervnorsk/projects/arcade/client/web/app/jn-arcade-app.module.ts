import {NgModule} from '@angular/core';
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnArcadeApp} from "./jn-arcade-app.component";
import {JnArcadeAppRoutingModule} from "./jn-arcade-app-routing.module";
import {JnArcadeRoom} from "../components/room/jn-arcade-room.component";
import {JnArcadeGamePong} from "../games/pong/jn-arcade-game-pong.component";
import {JnThModule} from "../../../../../foundation/client/web/features/webgl/engines/three/jn-th.module";

@NgModule({
    declarations: [
        JnArcadeApp,
        JnArcadeRoom,
        JnArcadeGamePong
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnArcadeAppRoutingModule,

        // Feature
        // -------------------------------------------------------------------------------------------------------------

        // Foundation
        // -------------------------------------------------------------------------------------------------------------
        JnCoreModule,
        JnThModule

        // Lib
        // -------------------------------------------------------------------------------------------------------------

        // Framework
        // -------------------------------------------------------------------------------------------------------------
    ],
    providers: [],
})
export class JnArcadeAppModule {
}
