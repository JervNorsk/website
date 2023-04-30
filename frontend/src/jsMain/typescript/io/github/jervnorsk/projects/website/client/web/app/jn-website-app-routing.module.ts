import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    JnNotFoundErrorComponent
} from "../../../../../foundation/client/web/features/core/errors/not-found/jn-not-found-error.component";
import {
    JnNotImplementedErrorComponent
} from "../../../../../foundation/client/web/features/core/errors/not-implemented/jn-not-implemented-error.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: "full",
        component: JnNotImplementedErrorComponent
    },
    {
        path: '',
        children: [
            {
                path: 'webgl/three',
                loadChildren: () => import("../features/webgl/engines/three/jn-website-three.module").then(it => it.JnWebsiteThreeModule)
            },
            {
                path: 'projects',
                children: [
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
        component: JnNotFoundErrorComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: false})],
    exports: [RouterModule]
})
export class JnWebsiteAppRoutingModule {
}
