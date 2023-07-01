import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs";

@Component({
    selector: '[jn-arcade-app]',
    templateUrl: './jn-arcade-app.component.html',
    styleUrls: ['./jn-arcade-app.component.sass']
})
export class JnArcadeApp implements OnInit {

    @Input()
    debug: boolean = false

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(take(1)).subscribe(it => {
            this.debug = it["debug"] === 'true'
        });
    }
}
