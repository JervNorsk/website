import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {
    JnThScene
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {ThEngineService, ThObject3D} from "ngx-three";
import {VRButton} from "three/examples/jsm/webxr/VRButton";

@Component({
    selector: 'jn-website-th-scene-environment',
    templateUrl: './jn-website-th-scene-environment.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneEnvironment extends JnThScene implements AfterViewInit {

    protected readonly Math = Math;

    constructor(
        private engine: ThEngineService,
        parent: ThObject3D
    ) {
        super(parent);
    }

    ngAfterViewInit() {
        this.initScene();
        this.initXR();
    }

    initScene() {
    }

    initXR() {
        document.body.append(
            VRButton.createButton(this.engine.renderer!)
        )
        this.engine.renderer!.xr.enabled = true;
        // this.engine.renderer!.xr.setReferenceSpaceType('');

        // this.engine.beforeRender$.subscribe(state => {
        //     if(!this.engine.renderer!.xr.isPresenting) {
        //
        //     }
        // });
        this.engine.renderer!.setAnimationLoop(() => {
            this.engine.render()
        })
    }
}
