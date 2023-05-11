import {ThCamera, ThCanvas, ThScene} from "ngx-three";
import {Component, ComponentRef, ContentChild, ViewChild} from "@angular/core";

@Component({
    template: ''
})
export class JnThScene extends ThScene {

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
    }

    private fixCanvasInit() {
        let canvas = this.parent as unknown as ThCanvas;

        canvas.contentScene = this;
        canvas.contentCamera = this.camera
    }
}
