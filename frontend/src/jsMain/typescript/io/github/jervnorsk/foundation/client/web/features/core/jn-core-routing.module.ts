import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnErrorNotImplemented} from "./components/errors/jn-error-not-implemented.component";
import {JnErrorNotFound} from "./components/errors/jn-error-not-found.component";

const routes: Routes = [
    {
        path: 'errors',
        children: [
            {
                path: 'not-found',
                component: JnErrorNotFound
            },
            {
                path: 'not-implemented',
                component: JnErrorNotImplemented
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnCoreRoutingModule {
}
