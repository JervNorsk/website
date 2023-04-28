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
        path: 'projects/streaming',
        loadChildren: () => import("../../../../streaming/client/web/app/jn-streaming-app.module").then(it => it.JnStreamingAppModule)
    },
    {
        path: '',
        pathMatch: "full",
        component: JnNotImplementedErrorComponent
    },
    {
        path: '**',
        pathMatch: "full",
        component: JnNotFoundErrorComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: false})],
    exports: [RouterModule]
})
export class JnWebsiteAppRoutingModule {
}
