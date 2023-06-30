import {Component, Directive, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as BABYLON from 'babylonjs';

@Component({
    selector: '[jn-arcade-app]',
    templateUrl: './jn-arcade-app.component.html',
    styleUrls: ['./jn-arcade-app.component.sass']
})
export class JnArcadeApp implements OnInit {


    @ViewChild('renderCanvas', { static: true })
    private renderCanvas!: ElementRef<HTMLCanvasElement>;

    ngOnInit() {
        // Create the Babylon.js engine
        const engine = new BABYLON.Engine(this.renderCanvas.nativeElement, true);

        // Create a scene
        const scene = new BABYLON.Scene(engine);

        // ... your Babylon.js code here ...

        // Run the engine render loop
        // engine.runRenderLoop(() => {
        //     scene.render();
        // });

        // Handle window resizing
        // window.addEventListener('resize', () => {
        //     engine.resize();
        // });
    }


}
