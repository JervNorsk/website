import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {
    JnThSceneComponent
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {ThObject3D} from "ngx-three";
import {ActivatedRoute} from "@angular/router";
import {
    JnThPrefabWavePointProps
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/prefabs/wave/jn-th-prefab-wave-point.component";

@Component({
    selector: 'jn-website-th-scene-environment',
    templateUrl: './jn-website-th-scene-environment.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneEnvironment extends JnThSceneComponent {

    @Input()
    debug: boolean = false

    @Input()
    vr: boolean = false

    protected readonly Math = Math;

    wavePoint: JnThPrefabWavePointProps = {
        grid: {
            size: {
                x: 100,
                y: 100
            }
        },
        point: {
            geometry: {
                radius: 0.08
            }
        },
        animation: {
            point: {
                inflate: 0.05
            }
        }
    }

    constructor(
        private route: ActivatedRoute,
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
}
