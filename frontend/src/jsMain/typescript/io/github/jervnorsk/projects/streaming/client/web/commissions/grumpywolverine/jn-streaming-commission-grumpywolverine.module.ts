import {NgModule} from '@angular/core';
import {JnStreamingCommissionGrumpyWolverineRoutingModule} from "./jn-streaming-commission-grumpywolverine-routing.module";
import {JnStreamingThModule} from "../../features/webgl/engines/three/jn-streaming-th.module";
import {JnCoreModule} from "../../../../../../foundation/client/web/features/core/jn-core.module";
import {JnStreamingCommissionGrumpyWolverineSceneMain} from "./main/jn-streaming-scene-main.component";


@NgModule({
    declarations: [
        JnStreamingCommissionGrumpyWolverineSceneMain
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnStreamingCommissionGrumpyWolverineRoutingModule,

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
export class JnStreamingCommissionGrumpyWolverineModule {
}
