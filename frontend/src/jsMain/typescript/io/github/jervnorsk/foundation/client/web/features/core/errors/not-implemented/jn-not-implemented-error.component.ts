import {Component} from '@angular/core';
import {JnErrorComponent} from "../jn-error.component";

@Component({
    templateUrl: '../jn-error.component.html',
    styleUrls: ['../jn-error.component.sass', './jn-not-implemented-error.component.sass']
})
export class JnNotImplementedErrorComponent extends JnErrorComponent {
    override title = "< building />"
    override subtitle = "Content under development."
}
