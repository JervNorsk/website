import {Component} from '@angular/core';
import {JnErrorComponent} from "../jn-error.component";

@Component({
    selector: "jn-not-implemented-error",
    templateUrl: '../jn-error.component.html',
    styleUrls: ['../jn-error.component.sass', './jn-not-implemented-error.component.sass']
})
export class JnNotImplementedErrorComponent extends JnErrorComponent {
    override title = "< building />"
    override subtitle = "Content under development."
}
