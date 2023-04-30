import {NgModule} from "@angular/core";
import {
    JnThreeModule
} from "../../../../../../../../foundation/client/web/features/webgl/engines/three/jn-three.module";
import {JnWebsiteThSceneEnvironment} from "./scenes/environment/jn-website-th-scene-environment.component";
import {RouterModule, RouterOutlet} from "@angular/router";
import {JnWebsiteThreeComponent} from "./jn-website-three.component";
import {JnCoreModule} from "../../../../../../../../foundation/client/web/features/core/jn-core.module";
import {JnWebsiteThreeRoutingModule} from "./jn-website-three-routing.module";

@NgModule({
    declarations: [
        JnWebsiteThreeComponent,
        JnWebsiteThSceneEnvironment
    ],
    imports: [
        // App
        JnWebsiteThreeRoutingModule,
        // Feature
        // Foundation
        JnThreeModule
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
