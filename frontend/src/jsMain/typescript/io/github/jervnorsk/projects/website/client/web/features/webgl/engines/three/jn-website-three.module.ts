import {NgModule} from "@angular/core";
import {
    JnThreeModule
} from "../../../../../../../../foundation/client/web/features/webgl/engines/three/jn-three.module";
import {JnWebsiteThSceneEnvironment} from "./scenes/environment/jn-website-th-scene-environment.component";

@NgModule({
    declarations: [
        JnWebsiteThSceneEnvironment
    ],
    imports: [
        JnThreeModule
    ],
    exports: [
        JnWebsiteThSceneEnvironment
    ],
    providers: []
})
export class JnWebsiteThreeModule {
}
