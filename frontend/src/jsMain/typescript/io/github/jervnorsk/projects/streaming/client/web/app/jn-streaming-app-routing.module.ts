import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnStreamingSceneMain} from "./scenes/main/jn-streaming-scene-main.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'scenes',
                children: [
                    {
                        path: 'main',
                        component: JnStreamingSceneMain
                    }
                ]
            },

        ]
    },
    // {
    //     path: '**',
    //     pathMatch: "full",
    //     component: JnNotFoundErrorComponent
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnStreamingAppRoutingModule {
}
