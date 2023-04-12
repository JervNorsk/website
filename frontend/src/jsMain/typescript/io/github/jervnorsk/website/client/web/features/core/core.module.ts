import {NgModule} from '@angular/core';

import {ErrorComponent} from "./components/errors/error.component";
import {NotFoundErrorComponent} from "./components/errors/not-found/not-found-error.component";
import {NotImplementedErrorComponent} from "./components/errors/not-implemented/not-implemented-error.component";

@NgModule({
    declarations: [
        ErrorComponent,
        NotFoundErrorComponent,
        NotImplementedErrorComponent
    ],
    imports: [],
    providers: [],
})
export class CoreModule {
}
