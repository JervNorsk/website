import {NgModule} from '@angular/core';
import {JnStreamingAppComponent} from "./jn-streaming-app.component";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnStreamingAppRoutingModule} from "./jn-streaming-app-routing.module";
import {JnStreamingSceneIntroComponent} from "../scenes/intro/jn-streaming-scene-intro.component";
import {JnThreeModule} from "../../../../../foundation/client/web/features/webgl/engines/three/jn-three.module";

@NgModule({
    declarations: [
        JnStreamingAppComponent,
        JnStreamingSceneIntroComponent
    ],
    imports: [
        JnStreamingAppRoutingModule,
        JnCoreModule,
        JnThreeModule
    ],
    providers: [],
})
export class JnStreamingAppModule {
}
