import {Component} from '@angular/core';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.sass']
})
export class ErrorComponent {
    title: string = "< error />"
    subtitle: string = ""
}
