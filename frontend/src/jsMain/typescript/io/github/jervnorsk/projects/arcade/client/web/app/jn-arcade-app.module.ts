import {NgModule} from '@angular/core';
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnArcadeApp} from "./jn-arcade-app.component";
import {JnArcadeAppRoutingModule} from "./jn-arcade-app-routing.module";
import {JnArcadeRoom} from "../components/room/jn-arcade-room.component";

@NgModule({
    declarations: [
        JnArcadeApp,
        JnArcadeRoom
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

        // Lib
        // -------------------------------------------------------------------------------------------------------------

        // Framework
        // -------------------------------------------------------------------------------------------------------------
    ],
    providers: [],
})
export class JnArcadeAppModule {
}
