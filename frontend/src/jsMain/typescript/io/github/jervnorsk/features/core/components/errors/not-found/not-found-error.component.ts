import {Component} from '@angular/core';
import {ErrorComponent} from "../error.component";

@Component({
    templateUrl: "../error.component.html",
    styleUrls: ['../error.component.sass', './not-found-error.component.sass']
})
export class NotFoundErrorComponent extends ErrorComponent {
    override title = "< not found />"
    override subtitle = "Missing something?"
}
