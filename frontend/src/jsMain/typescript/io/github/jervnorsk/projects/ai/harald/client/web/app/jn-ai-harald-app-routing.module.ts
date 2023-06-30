import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnAiHaraldApp} from "./jn-ai-harald-app.component";

const routes: Routes = [
    {
        path: '',
        component: JnAiHaraldApp
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnAiHaraldAppRoutingModule {
}
