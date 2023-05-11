import {ThCamera, ThCanvas, ThScene} from "ngx-three";
import {AfterViewInit, Component, ComponentRef, ContentChild, ViewChild} from "@angular/core";
import {JnThObject} from "../common/jn-th-object.component";

@Component({
    template: ''
})
export abstract class JnThScene extends ThScene implements JnThObject {

    @ViewChild(ThScene, {static: true})
    protected scene?: ThScene

    @ViewChild(ThCamera, {static: true})
    protected camera?: ThCamera

    override ngOnInit() {
        super.ngOnInit();

        if(this.scene) {
            this.scene.objRef = this.objRef;
        }

        this.fixCanvasInit();

        this.thOnInitDOM();
    }

    ngAfterViewInit() {
        this.thOnInitScene();
    }

    thOnInitDOM() {}

    abstract thOnInitScene(): void;

    private fixCanvasInit() {
        let canvas = this.parent as unknown as ThCanvas;

        canvas.contentScene = this;
        canvas.contentCamera = this.camera
    }
}
