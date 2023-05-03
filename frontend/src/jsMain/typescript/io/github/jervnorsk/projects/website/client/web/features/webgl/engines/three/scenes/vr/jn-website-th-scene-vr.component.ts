import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {
    JnThScene
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {VRButton} from "three/examples/jsm/webxr/VRButton";
import {ActivatedRoute} from "@angular/router";
import {RenderState, ThEngineService, ThObject3D} from "ngx-three";
import {Euler, Group, Mesh, Vector3} from "three";

@Component({
    selector: 'jn-website-th-scene-vr',
    templateUrl: './jn-website-th-scene-vr.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneVR extends JnThScene implements AfterViewInit {

    testCase: any = [
        {
            root: {
                objRef: new Group(),
                position: new Vector3(0, 0, -2)
            },
            cube: {
                objRef: new Mesh(),
                position: new Vector3(0, 0.5, 0),
                material: {
                    color: "#22AAAA"
                }
            },
            light: {
                objRef: new Group(),
                point: {
                    position: new Vector3(1, 2, 0),
                    radius: 0.1
                }
            },
            onRender: (renderState: RenderState, self: any) => {
                let rotation = self.light.objRef.rotation

                let speed = renderState.delta * 1

                // rotation.x += speed;
                rotation.y += speed;
                // rotation.z += speed;
            }
        }
    ]

    override ngOnInit() {
        super.ngOnInit();
        this.route.data.subscribe(it => {
            if (this.testCase[it["testCase"]]) {
                this.testCase[it["testCase"]].enabled = true;
            }
        });
        this.route.queryParams.subscribe(it => {
            if (this.testCase[it["testCase"]]) {
                this.testCase[it["testCase"]].enabled = true;
            }
        });
    }

    ngAfterViewInit() {
        this.initScene();
        this.initXR();
    }

    constructor(
        private route: ActivatedRoute,
        private engine: ThEngineService,
        parent: ThObject3D
    ) {
        super(parent);
    }

    initScene() {
    }

    initXR() {
        document.body.append(
            VRButton.createButton(this.engine.renderer!)
        )
        this.engine.renderer!.xr.enabled = true;
        // this.engine.renderer!.xr.setReferenceSpaceType('');

        this.engine.beforeRender$.subscribe(renderState => {
            this.testCase.forEach((it: any) => {
                if (it.enabled) {
                    it.onRender(renderState, it);
                }
            })

            if (!this.engine.renderer!.xr.isPresenting) {
            }
        });
        this.engine.renderer!.setAnimationLoop(() => {
            this.engine.render()
        })
    }
}
