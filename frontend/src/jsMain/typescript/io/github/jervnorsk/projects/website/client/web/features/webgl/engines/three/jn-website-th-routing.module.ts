import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnWebsiteTh} from "./jn-website-th.component";
import {JnWebsiteThSceneEnvironment} from "./scenes/environment/jn-website-th-scene-environment.component";
import {JnWebsiteThSceneVR} from "./scenes/vr/jn-website-th-scene-vr.component";

const routes: Routes = [
    {
        path: "",
        component: JnWebsiteTh,
        children: [
            {
                path: 'scenes',
                children: [
                    {
                        path: 'environment',
                        component: JnWebsiteThSceneEnvironment,
                        data: {
                            testCase: 0
                        }
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
export class JnWebsiteThRoutingModule {
}
