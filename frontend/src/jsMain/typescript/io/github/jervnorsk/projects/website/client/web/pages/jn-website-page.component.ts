import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'jn-website-page',
    templateUrl: './jn-website-page.component.html',
    styleUrls: ['./jn-website-page.component.sass']
})
export class JnWebsitePage {

    constructor(
        private router : Router
    ) {}

    get isNotFound() {
        return this.router.routerState.snapshot.url !== '/';
    }
}
