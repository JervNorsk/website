import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnWebsiteThreeComponent} from "./jn-website-three.component";
import {JnWebsiteThSceneEnvironment} from "./scenes/environment/jn-website-th-scene-environment.component";

const routes: Routes = [
    {
        path: "",
        component: JnWebsiteThreeComponent,
        children: [
            {
                path: 'scenes',
                children: [
                    {
                        path: 'environment',
                        component: JnWebsiteThSceneEnvironment
                    }
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnWebsiteThreeRoutingModule {
}
