import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input, OnInit,
    SimpleChanges
} from '@angular/core';
import {
    JnThScene
} from "../../../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {ActivatedRoute} from "@angular/router";
import {RenderState, ThEngineService, ThGroup, ThObject3D} from "ngx-three";
import {
    BoxGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PointLight,
    SphereGeometry,
    Vector3
} from "three";
import {BehaviorSubject, Observable, Subject} from "rxjs";


export abstract class JnWebsiteThSceneVRSampleCase extends Group{

    beforeRender$ = new Subject<RenderState>();

    constructor() {
        super();
        this.onInit();
    }

    abstract onInit(): void;
}

@Component({
    selector: 'jn-website-th-scene-vr-samples',
    templateUrl: './jn-website-th-scene-vr-samples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneVRSamples extends JnThScene implements AfterViewInit {

    @Input()
    sampleCaseIndex!: Observable<number>;
    sampleCaseArray: JnWebsiteThSceneVRSampleCase[] = [
        new class extends JnWebsiteThSceneVRSampleCase {
            override onInit() {
                let cube = new Mesh(
                    new BoxGeometry(),
                    new MeshPhongMaterial()
                );
                cube.material.color.setHex(0x22aaaa);
                cube.position.set(0,0.5,0);
                this.add(cube);

                let lightA = new PointLight();
                let lightAMesh = new Mesh(
                    new SphereGeometry(0.1),
                    new MeshBasicMaterial()
                );
                lightA.position.set(1,2,0);
                lightA.add(lightAMesh);

                let lightGroup = new Group();
                lightGroup.add(lightA);
                this.add(lightGroup);

                this.position.set(0, 0, -2);

                this.beforeRender$.subscribe(renderState => {
                    let speed = renderState.delta * 1;

                    // lightGroup.rotation.x += speed;
                    lightGroup.rotation.y += speed;
                    // lightGroup.rotation.z += speed;
                });
            }
        }
    ]
    sampleCase = new BehaviorSubject<JnWebsiteThSceneVRSampleCase | null>(null)

    constructor(
        private changesDetector: ChangeDetectorRef,
        private route: ActivatedRoute,
        private engine: ThEngineService,
        parent: ThObject3D
    ) {
        super(parent);
    }

    override thOnInitDOM() {
        this.sampleCaseIndex?.subscribe(it => {
            this.sampleCase.next(this.sampleCaseArray[it]);
        });
    }

    override thOnInitScene() {
        this.engine.beforeRender$.subscribe(it => {
           this.sampleCase.value?.beforeRender$.next(it);
        });
    }
}
