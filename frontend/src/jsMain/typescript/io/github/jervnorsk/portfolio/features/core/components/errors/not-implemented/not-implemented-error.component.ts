import {Component} from '@angular/core';
import {ErrorComponent} from "../error.component";

@Component({
    templateUrl: '../error.component.html',
    styleUrls: ['../error.component.sass', './not-implemented-error.component.sass']
})
export class NotImplementedErrorComponent extends ErrorComponent {
    override title = "< building />"
    override subtitle = "Content under development."
}
