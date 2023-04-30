import {Component} from '@angular/core';
import {JnErrorComponent} from "../jn-error.component";

@Component({
    selector: "jn-not-found-error",
    templateUrl: "../jn-error.component.html",
    styleUrls: ['../jn-error.component.sass', './jn-not-found-error.component.sass']
})
export class JnNotFoundErrorComponent extends JnErrorComponent {
    override title = "< not found />"
    override subtitle = "Missing something?"
}
