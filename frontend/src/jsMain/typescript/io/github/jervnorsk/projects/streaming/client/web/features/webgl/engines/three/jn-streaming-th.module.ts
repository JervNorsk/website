import {NgModule} from "@angular/core";
import {JnThModule} from "../../../../../../../../foundation/client/web/features/webgl/engines/three/jn-th.module";
import {JnCoreModule} from "../../../../../../../../foundation/client/web/features/core/jn-core.module";
import {JnStreamingThPrefabWavePoints} from "./prefab/wave/jn-streaming-th-prefab-wave-point.component";

@NgModule({
    declarations: [
        JnStreamingThPrefabWavePoints,
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------

        // Feature
        // -------------------------------------------------------------------------------------------------------------

        // Foundation
        // -------------------------------------------------------------------------------------------------------------
        JnCoreModule,
        JnThModule,

        // Framework
        // -------------------------------------------------------------------------------------------------------------
    ],
    exports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnStreamingThPrefabWavePoints,

        // Foundation
        // -------------------------------------------------------------------------------------------------------------
        JnThModule
    ],
    providers: []
})
export class JnStreamingThModule {
}
