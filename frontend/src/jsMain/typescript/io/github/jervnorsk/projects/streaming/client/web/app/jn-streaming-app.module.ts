import {NgModule} from '@angular/core';
import {JnStreamingAppComponent} from "./jn-streaming-app.component";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnStreamingAppRoutingModule} from "./jn-streaming-app-routing.module";
import {JnStreamingSceneIntroOnStartComponent} from "../scenes/intro/jn-streaming-scene-intro-on-start.component";
import {JnStreamingSceneIntroOnEndComponent} from "../scenes/intro/jn-streaming-scene-intro-on-end.component";
import {JnStreamingSceneIntroComponent} from "../scenes/intro/jn-streaming-scene-intro.component";

@NgModule({
    declarations: [
        JnStreamingAppComponent,
        JnStreamingSceneIntroComponent,
        JnStreamingSceneIntroOnStartComponent,
        JnStreamingSceneIntroOnEndComponent
    ],
    imports: [
        JnStreamingAppRoutingModule,
        JnCoreModule
    ],
    providers: [],
})
export class JnStreamingAppModule {
}
