import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnWebsitePage} from "../pages/jn-website-page.component";
import {JnCoreModule} from "../../../../../foundation/client/web/features/core/jn-core.module";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import("../pages/jn-website-page.module").then(it => it.JnWebsitePageModule)
    },
    {
        path: '',
        children: [
            {
                path: 'components',
                loadChildren: () => JnCoreModule,
            },
            {
                path: 'webgl/three',
                loadChildren: () => import("../features/webgl/engines/three/jn-website-th.module").then(it => it.JnWebsiteThModule)
            },
            {
                path: 'projects',
                children: [
                    {
                        path: 'ai',
                        children: [
                            {
                                path: 'harald',
                                loadChildren: () => import("../../../../ai/harald/client/web/app/jn-ai-harald-app.module").then(it => it.JnAiHaraldAppModule)
                            }
                        ]
                    },
                    {
                        path: 'arcade',
                        loadChildren: () => import("../../../../arcade/client/web/app/jn-arcade-app.module").then(it => it.JnArcadeAppModule)
                    },
                    {
                        path: 'streaming',
                        loadChildren: () => import("../../../../streaming/client/web/app/jn-streaming-app.module").then(it => it.JnStreamingAppModule)
                    },
                ]
            },
        ]
    },
    {
        path: '**',
        component: JnWebsitePage
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: false})],
    exports: [RouterModule]
})
export class JnWebsiteAppRoutingModule {
}
