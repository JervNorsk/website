import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnWebsitePage} from "./jn-website-page.component";

const routes: Routes = [
    {
        path: '',
        component: JnWebsitePage
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnWebsitePageRoutingModule {
}
