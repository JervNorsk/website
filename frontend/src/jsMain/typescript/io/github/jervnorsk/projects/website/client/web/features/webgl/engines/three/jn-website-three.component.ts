import {Component, Input} from '@angular/core';

@Component({
    selector: 'jn-website-th',
    templateUrl: './jn-website-three.component.html',
})
export class JnWebsiteThreeComponent {

    @Input()
    withContent: boolean = false;
}
