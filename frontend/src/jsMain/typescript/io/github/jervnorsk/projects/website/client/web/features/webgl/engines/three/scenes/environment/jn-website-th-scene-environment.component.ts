import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {
    JnThScene
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {ThEngineService, ThObject3D} from "ngx-three";
import {ActivatedRoute} from "@angular/router";
import {
    JnThGridProps
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/utils/grid/jn-th-grid.component";
import {JnWebsiteThPrefabWavePointProps} from "../../prefabs/wave/jn-website-th-prefab-wave-point.component";

@Component({
    selector: 'jn-website-th-scene-environment',
    templateUrl: './jn-website-th-scene-environment.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneEnvironment extends JnThScene implements AfterViewInit {

    @Input()
    debug: boolean = false

    @Input()
    vr: boolean = false

    protected readonly Math = Math;

    wavePoint: JnWebsiteThPrefabWavePointProps = {
        grid:  {
            size: {
                x: 100,
                y: 100
            }
        },
        animation: {}
    }

    constructor(
        private route: ActivatedRoute,
        private engine: ThEngineService,
        parent: ThObject3D
    ) {
        super(parent);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.route.queryParams.subscribe(it => {
            this.debug = it["debug"] === 'true';
            this.vr = it["vr"] === 'true';
        });
    }

    ngAfterViewInit() {
        this.initScene();
    }

    initScene() {
    }
}
