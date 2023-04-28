import {NgModule} from "@angular/core";
import {JnErrorComponent} from "./errors/jn-error.component";
import {JnNotFoundErrorComponent} from "./errors/not-found/jn-not-found-error.component";
import {JnNotImplementedErrorComponent} from "./errors/not-implemented/jn-not-implemented-error.component";
import {BrowserModule} from "@angular/platform-browser";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        JnErrorComponent,
        JnNotFoundErrorComponent,
        JnNotImplementedErrorComponent,
    ],
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [
        CommonModule,
        NgbModule
    ],
    providers: []
})
export class JnCoreModule {
}
