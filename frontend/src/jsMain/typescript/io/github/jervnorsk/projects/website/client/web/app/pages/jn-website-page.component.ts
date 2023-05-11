import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'jn-website-page-building',
    templateUrl: './jn-website-page.component.html',
})
export class JnWebsitePageComponent {

    constructor(
        private router : Router
    ) {}

    isNotFound() {
        return this.router.routerState.snapshot.url !== '/';
    }
}
