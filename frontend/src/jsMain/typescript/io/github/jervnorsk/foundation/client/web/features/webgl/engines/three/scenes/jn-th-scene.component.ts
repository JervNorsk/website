import {ThCamera, ThCanvas, ThEngineService, ThObject3D, ThScene} from "ngx-three";
import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {JnThObject} from "../common/jn-th-object.component";
import {Camera, Scene} from "three";

export interface JnThSceneProps {
    engine: ThEngineService,
    scene: Scene,
}

@Component({
    selector: 'jn-th-scene',
    template: '<ng-content />'
})
export class JnThScene extends ThScene implements JnThObject {

    @Output()
    onInit = new EventEmitter<any>();

    @ViewChild(ThScene, {static: true})
    private scene?: ThScene

    @ViewChild(ThCamera, {static: true})
    private camera?: ThCamera

    constructor(
        parent: ThObject3D,
        private engineService?: ThEngineService
    ) {
        super(parent);
    }

    override ngOnInit() {
        super.ngOnInit();

        if (this.scene) {
            this.scene.objRef = this.objRef;
        }

        this.thOnInitDOM();
        this.thOnInitScene(this.objRef!);

        if (this.parent && this.parent instanceof ThCanvas) {
            this.parent.contentScene = this;

            if (!this.camera) {
                let camera = this.objRef!.children.find(it => it instanceof Camera) as Camera;

                if (camera) {
                    this.camera = new ThCamera(this as ThObject3D);
                    this.camera!.objRef = camera;
                }
            }

            this.parent.contentCamera = this.camera;
        }
    }

    ngAfterViewInit() {
        // this.thOnInitScene(this.objRef!);
    }

    thOnInitDOM() {
    }

    thOnInitScene(scene: Scene) {
        this.onInit.emit({
            engine: this.engineService,
            scene: scene,
        });
    }
}
