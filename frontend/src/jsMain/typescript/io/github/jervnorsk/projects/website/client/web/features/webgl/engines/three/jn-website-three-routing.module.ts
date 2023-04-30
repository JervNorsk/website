import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnWebsiteThreeComponent} from "./jn-website-three.component";
import {JnWebsiteThSceneEnvironment} from "./scenes/environment/jn-website-th-scene-environment.component";
import {JnWebsiteThSceneVR} from "./scenes/vr/jn-website-th-scene-vr.component";

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
                    },
                    {
                        path: 'vr',
                        component: JnWebsiteThSceneVR
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
