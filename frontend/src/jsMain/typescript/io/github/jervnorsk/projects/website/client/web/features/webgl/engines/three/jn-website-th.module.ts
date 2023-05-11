import {NgModule} from "@angular/core";
import {JnThModule} from "../../../../../../../../foundation/client/web/features/webgl/engines/three/jn-th.module";
import {JnWebsiteThSceneEnvironment} from "./scenes/environment/jn-website-th-scene-environment.component";
import {JnWebsiteTh} from "./jn-website-th.component";
import {JnWebsiteThRoutingModule} from "./jn-website-th-routing.module";
import {JnWebsiteThSceneVR} from "./scenes/vr/jn-website-th-scene-vr.component";
import {JnCoreModule} from "../../../../../../../../foundation/client/web/features/core/jn-core.module";
import {JnWebsiteThSceneVRSamples} from "./scenes/vr/samples/jn-website-th-scene-vr-samples.component";

@NgModule({
    declarations: [
        JnWebsiteTh,
        JnWebsiteThSceneEnvironment,
        JnWebsiteThSceneVR,
        JnWebsiteThSceneVRSamples
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnWebsiteThRoutingModule,

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
        JnWebsiteTh,
        JnWebsiteThSceneEnvironment,

        // Foundation
        // -------------------------------------------------------------------------------------------------------------
        JnThModule

    ],
    providers: []
})
export class JnWebsiteThModule {
}
