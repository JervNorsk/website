import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { JnArcadeApp } from './jn-arcade-app.component';

const routes: Routes = [
    {
        path: '',
        component: JnArcadeApp
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnArcadeAppRoutingModule {
}
