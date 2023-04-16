import {NgModule} from "@angular/core";
import {ErrorComponent} from "./errors/error.component";
import {NotFoundErrorComponent} from "./errors/not-found/not-found-error.component";
import {NotImplementedErrorComponent} from "./errors/not-implemented/not-implemented-error.component";
import {BrowserModule} from "@angular/platform-browser";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxThreeGeneratedModule, NgxThreeModule} from "ngx-three";
import {ThreeModule} from "./engines/three/three.module";

@NgModule({
    declarations: [
        ErrorComponent,
        NotFoundErrorComponent,
        NotImplementedErrorComponent,
    ],
    imports: [
        BrowserModule,
        NgbModule,
        ThreeModule
    ],
    exports: [
        BrowserModule,
        NgbModule,
        ThreeModule
    ],
    providers: []
})
export class CoreModule {

}
