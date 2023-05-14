import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'grumpywolverine',
        loadChildren: () => import('./grumpywolverine/jn-streaming-commission-grumpywolverine.module').then(it => it.JnStreamingCommissionGrumpyWolverineModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnStreamingCommissionRoutingModule {
}
