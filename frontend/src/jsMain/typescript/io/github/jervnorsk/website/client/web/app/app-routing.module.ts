import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundErrorComponent} from "../features/core/errors/not-found/not-found-error.component";
import {NotImplementedErrorComponent} from "../features/core/errors/not-implemented/not-implemented-error.component";

const routes: Routes = [
    {
        path: '',
        component: NotImplementedErrorComponent
    },
    {
        path: '**',
        component: NotFoundErrorComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
