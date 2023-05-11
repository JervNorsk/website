import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'jn-website-th',
    templateUrl: './jn-website-th.component.html',
})
export class JnWebsiteTh implements OnInit {

    @Input()
    withContent: boolean = false;

    @Input()
    debug: boolean = false;

    constructor(
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(it => {
            this.debug = it["debug"] === 'true';
        });
    }
}
