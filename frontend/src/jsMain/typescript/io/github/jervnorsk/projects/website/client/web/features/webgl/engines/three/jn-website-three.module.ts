import {NgModule} from "@angular/core";
import {
    JnThreeModule
} from "../../../../../../../../foundation/client/web/features/webgl/engines/three/jn-three.module";
import {JnWebsiteThSceneEnvironment} from "./scenes/environment/jn-website-th-scene-environment.component";
import {JnWebsiteThreeComponent} from "./jn-website-three.component";
import {JnWebsiteThreeRoutingModule} from "./jn-website-three-routing.module";
import {NgIf} from "@angular/common";
import {JnWebsiteThSceneVR} from "./scenes/vr/jn-website-th-scene-vr.component";
import {JnWebsiteThPrefabWavePoint} from "./prefabs/wave/jn-website-th-prefab-wave-point.component";

@NgModule({
    declarations: [
        JnWebsiteThreeComponent,
        JnWebsiteThSceneEnvironment,
        JnWebsiteThSceneVR,
        JnWebsiteThPrefabWavePoint
    ],
    imports: [
        // App
        JnWebsiteThreeRoutingModule,
        // Feature
        // Foundation
        JnThreeModule,
        NgIf,
        // Framework
    ],
    exports: [
        JnWebsiteThreeComponent,
        JnWebsiteThSceneEnvironment
    ],
    providers: []
})
export class JnWebsiteThreeModule {
}
