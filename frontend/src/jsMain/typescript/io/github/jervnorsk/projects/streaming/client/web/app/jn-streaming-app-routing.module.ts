import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    JnNotFoundErrorComponent
} from "../../../../../foundation/client/web/features/core/errors/not-found/jn-not-found-error.component";
import {JnStreamingSceneIntroComponent} from "../scenes/intro/jn-streaming-scene-intro.component";
import {JnStreamingAppComponent} from "./jn-streaming-app.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'scenes',
                children: [
                    {
                        path: 'intro',
                        component: JnStreamingSceneIntroComponent
                    }
                ]
            },

        ]
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
