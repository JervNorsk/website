import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {
    JnThScene
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {VRButton} from "three/examples/jsm/webxr/VRButton";
import {ActivatedRoute} from "@angular/router";
import {ThEngineService, ThObject3D} from "ngx-three";
import {BehaviorSubject, Subject} from "rxjs";

@Component({
    selector: 'jn-website-th-scene-vr',
    templateUrl: './jn-website-th-scene-vr.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneVR extends JnThScene {

    sampleCaseIndex = new BehaviorSubject<number>(-1);

    constructor(
        private route: ActivatedRoute,
        private engine: ThEngineService,
        parent: ThObject3D
    ) {
        super(parent);
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit()
        this.thOnInitXR();
    }

    override thOnInitDOM() {
        this.route.data.subscribe(it => {
            if(it["vrSampleCase"]) {
                this.sampleCaseIndex.next(it["vrSampleCase"]);
            }
        });
        this.route.queryParams.subscribe(it => {
            if(it["vrSampleCase"]) {
                this.sampleCaseIndex.next(it["vrSampleCase"]);
            }
        });
    }

    thOnInitXR() {
        document.body.append(
            VRButton.createButton(this.engine.renderer!)
        )
        this.engine.renderer!.xr.enabled = true;
        // this.engine.renderer!.xr.setReferenceSpaceType('');

        this.engine.beforeRender$.subscribe(renderState => {
            if (!this.engine.renderer!.xr.isPresenting) {
            }
        });
        this.engine.renderer!.setAnimationLoop(() => {
            this.engine.render()
        })
    }
}
