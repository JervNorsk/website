import {Component, Input, ViewEncapsulation} from "@angular/core";

@Component({
    selector: 'jn-error',
    templateUrl: './jn-error.component.html',
    styleUrls: ['./jn-error.component.sass']
})
export class JnError {

    @Input()
    title!: string;

    @Input()
    message!: string;
}
