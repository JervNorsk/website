import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotImplementedErrorComponent} from "../core/components/errors/not-implemented/not-implemented-error.component";
import {NotFoundErrorComponent} from "../core/components/errors/not-found/not-found-error.component";

const routes: Routes = [
    {path: '', component: NotImplementedErrorComponent},
    {path: '**', pathMatch: 'full', component: NotFoundErrorComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
