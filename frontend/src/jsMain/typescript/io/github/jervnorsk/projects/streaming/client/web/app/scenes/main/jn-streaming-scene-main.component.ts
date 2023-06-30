import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs";

@Component({
    templateUrl: './jn-streaming-scene-main.component.html',
    styleUrls: ['./jn-streaming-scene-main.component.sass']
})
export class JnStreamingSceneMain implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(
            take(1)
        ).subscribe(it => {
            // this.topTitleStackCount = it['topTitleStackCount'] as number
            // console.log(this.topTitleStackCount)
            // console.log(this.topTitleStacks(this.topTitleStackCount as number))
        });
    }

}
