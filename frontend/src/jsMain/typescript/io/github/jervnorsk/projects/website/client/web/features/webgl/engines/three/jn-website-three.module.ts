import {NgModule} from "@angular/core";
import {
    JnThreeModule
} from "../../../../../../../../foundation/client/web/features/webgl/engines/three/jn-three.module";
import {JnWebsiteThSceneEnvironment} from "./scenes/environment/jn-website-th-scene-environment.component";
import {RouterModule, RouterOutlet} from "@angular/router";
import {JnWebsiteThreeComponent} from "./jn-website-three.component";
import {JnCoreModule} from "../../../../../../../../foundation/client/web/features/core/jn-core.module";
import {JnWebsiteThreeRoutingModule} from "./jn-website-three-routing.module";
import {NgIf} from "@angular/common";
import {JnWebsiteThSceneVR} from "./scenes/vr/jn-website-th-scene-vr.component";

@NgModule({
    declarations: [
        JnWebsiteThreeComponent,
        JnWebsiteThSceneEnvironment,
        JnWebsiteThSceneVR
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
