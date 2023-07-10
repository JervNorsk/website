import {Component, Directive, Input, ViewEncapsulation} from '@angular/core';
import {
    JnThPrefabComponent
} from "../../../../../../foundation/client/web/features/webgl/engines/three/prebas/jn-th-prefab.component";
import {ActivatedRoute} from "@angular/router";
import {ThEngineService, ThObject3D} from "ngx-three";

@Component({
    selector: 'jn-arcade-room',
    templateUrl: './jn-arcade-room.component.html',
    styleUrls: ['./jn-arcade-room.component.sass']
})
export class JnArcadeRoom extends JnThPrefabComponent {

    @Input()
    debug: boolean = false

    assets = {
        env: {
           cabin: {
               pong: {
                   url: `${window.location.pathname}/games/pong/assets/env/cabinet/arcade_pong_cabinet.glb`
               }
           }
        }
    }

    constructor(
        private route: ActivatedRoute,
        private engine: ThEngineService,
        parent: ThObject3D
    ) {
        super(parent);
    }

    thOnInitPrefab(): void {
    }
}
