import {NgModule} from '@angular/core';
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnStreamingCommissionRoutingModule} from "./jn-streaming-commission-routing.module";
import {JnStreamingThModule} from "../features/webgl/engines/three/jn-streaming-th.module";

@NgModule({
    declarations: [],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnStreamingCommissionRoutingModule,

        // Feature
        // -------------------------------------------------------------------------------------------------------------
        // JnStreamingThModule,

        // Foundation
        // -------------------------------------------------------------------------------------------------------------
        // JnCoreModule,

        // Lib
        // -------------------------------------------------------------------------------------------------------------

        // Framework
        // -------------------------------------------------------------------------------------------------------------
    ],
    providers: [],
})
export class JnStreamingCommissionModule {
}
