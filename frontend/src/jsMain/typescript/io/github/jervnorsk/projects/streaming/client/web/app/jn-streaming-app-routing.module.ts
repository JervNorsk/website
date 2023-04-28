import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnStreamingSceneIntroOnStartComponent} from "../scenes/intro/jn-streaming-scene-intro-on-start.component";
import {
    JnNotFoundErrorComponent
} from "../../../../../foundation/client/web/features/core/errors/not-found/jn-not-found-error.component";
import {JnStreamingSceneIntroOnEndComponent} from "../scenes/intro/jn-streaming-scene-intro-on-end.component";

const routes: Routes = [
    {
        path: 'scenes/intro/on-start',
        pathMatch: "full",
        component: JnStreamingSceneIntroOnStartComponent
    },
    {
        path: 'scenes/intro/on-end',
        pathMatch: "full",
        component: JnStreamingSceneIntroOnEndComponent
    },
    {
        path: '**',
        pathMatch: "full",
        component: JnNotFoundErrorComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnStreamingAppRoutingModule {
}
