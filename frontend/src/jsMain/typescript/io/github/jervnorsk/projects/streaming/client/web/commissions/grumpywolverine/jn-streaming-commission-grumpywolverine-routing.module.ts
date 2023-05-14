import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnStreamingCommissionGrumpyWolverineSceneMain} from "./main/jn-streaming-scene-main.component";

const routes: Routes = [
    {
        path: 'scenes',
        children: [
            {
                path: 'main',
                component: JnStreamingCommissionGrumpyWolverineSceneMain
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnStreamingCommissionGrumpyWolverineRoutingModule {
}
