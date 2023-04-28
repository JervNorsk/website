import {NgModule} from '@angular/core';
import {JnStreamingAppComponent} from "./jn-streaming-app.component";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";
import {JnStreamingAppRoutingModule} from "./jn-streaming-app-routing.module";
import {JnStreamingSceneIntroOnStartComponent} from "../scenes/intro/jn-streaming-scene-intro-on-start.component";

@NgModule({
    declarations: [
        JnStreamingAppComponent,
        JnStreamingSceneIntroOnStartComponent
    ],
    imports: [
        JnStreamingAppRoutingModule,
        JnCoreModule
    ],
    providers: [],
})
export class JnStreamingAppModule {
}
