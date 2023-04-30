import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked, AfterViewInit,
    ChangeDetectionStrategy,
    Component, ElementRef,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {ThCamera, ThCanvas, ThEngineService, ThObject3D, ThPerspectiveCamera, ThScene, ThView} from "ngx-three";
import {
    AmbientLight, BoxGeometry, BufferGeometry, Color,
    Material,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PerspectiveCamera, Raycaster, Scene,
    SphereGeometry,
    Vector3
} from "three";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";
import {EOF} from "@angular/compiler";
import {VRButton} from "three/examples/jsm/webxr/VRButton";
import {ThAnimationLoopService} from "ngx-three/lib/renderer/th-animation-loop.service";
import {RaycasterService} from "ngx-three/lib/events/raycaster.service";
import {
    ThPrefabWave
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/prefabs/wave/th-prefab-wave.component";

@Component({
    selector: 'jn-website-th-scene-environment',
    templateUrl: './jn-website-th-scene-environment.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneEnvironment implements AfterViewInit {

    constructor(
        // private engine: ThEngineService,
        // private canvas: ThCanvas,
        // parent: ThObject3D
    ) {
        // super(parent);
    }

    ngAfterViewInit() {
        // console.log(this);
        // console.log(this.engine);

        // this.initScene();
        // this.addToParent()

        // console.log(this.objRef!.children);
    }

    // initScene() {
    //     this.canvas.scene = this;
    //
    //     console.log(this.canvas.camera);
    //     console.log(this.canvas.scene);
    //
    //     let light = new AmbientLight();
    //     this.objRef!.add(light);
    //
    //     let mesh = new Mesh(
    //         new BoxGeometry(1),
    //         new MeshBasicMaterial()
    //     )
    //     this.objRef!.add(mesh);
    //
    //     let wave = new ThPrefabWave();
    //     // wave.points?.addToParent()
    //
    //     this.canvas.camera!.position = [-5, 0, 0];
    //     this.canvas.camera!.lookAt = [0, 0, 0];
    //
    //     this.engine.renderer!.xr.enabled = true;
    //     // this.engine.renderer!.xr.setReferenceSpaceType('');
    //
    //     document.body.append(VRButton.createButton( this.engine.renderer! ))
    //
    //     this.engine.beforeRender$.subscribe(state => {});
    //     this.engine.renderer!.setAnimationLoop(() => {
    //         this.engine.render()
    //     })
    // }

    // @ViewChild("scene", {static: true})
    // scene!: ThScene;
    // sceneChildren: Object3D[] = [];

    // @ViewChild("camera", {static: true})
    // camera?: PerspectiveCamera;
    // cameraPosition: Vector3 = new Vector3(0, 0, 5);

    // ngOnInit() {
        // this.initGrid();
        // this.initLight();

        // console.log(this.scene.children)
        // console.log(this.sceneChildren)
    // }

    // initLight() {
    //     let environmentLight = new AmbientLight();
    //
    //     this.sceneChildren.push(environmentLight);
    // }

    // initGrid() {
    //     // for (let i = 0; i < 23; i++) {
    //     //     for (let j = 0; j < 23; j++) {
    //     //         let geometry = new SphereGeometry(1);
    //     //         let material = new MeshBasicMaterial();
    //     //         let mesh = new Mesh(geometry, material);
    //     //
    //     //         let radius = 0.005;
    //     //         let offset = new Vector3(0.225, -.195, .2);
    //     //         let align = new Vector3(-2.5, 2.15, 0);
    //     //
    //     //         mesh.scale.set(radius, radius, radius);
    //     //         mesh.position.set(align.x + (offset.x * i), align.y + (offset.y * j), offset.z);
    //     //
    //     //         this.sceneChildren.push(mesh);
    //     //     }
    //     // }
    //
    //     let radius = 0.01;
    //     let spaceBetween = 0.1;
    //     let gridSize = 20;
    //
    //     let scale = new Vector3(radius, radius, radius);
    //     let position = new Vector3(0, 0, 0.2);
    //     let offset = new Vector3(spaceBetween, spaceBetween, 0);
    //
    //
    //     let gridQuadrant = {
    //         unit: {
    //             geometry: new SphereGeometry(),
    //             material: new MeshBasicMaterial()
    //         }
    //     }
    //
    //     this.initGridQuadrant({ gridQuuadrant ...
    //         rows: {
    //             count: gridSize,
    //             startFrom: 0
    //         },
    //         columns: {
    //             count: gridSize,
    //             startFrom: 0
    //         },
    //
    //     })
    //
    //     // this.initGridQuadrant(1, 0, 1, 0, scale, position, offset);
    //     // this.initGridQuadrant(1, 0, size, 1, scale, position, offset);
    //     // this.initGridQuadrant(size, 1, 1, 0, scale, position, offset);
    // }
    //
    // initGridQuadrant(
    //     config: {
    //         rows: {
    //             count: number,
    //             startFrom: number
    //         }
    //         columns: {
    //             count: number,
    //             startFrom: number
    //         },
    //         unit: {
    //             geometry: BufferGeometry,
    //             material: Material
    //         }
    //     }
    // ) {
    //
    // }
    //
    //
    // // initGridQuadrant(
    // //     rowCount: number,
    // //     rowIndexOffset: number,
    // //     columnCount: number,
    // //     columnIndexOffset: number,
    // //     scale: Vector3,
    // //     position: Vector3,
    // //     offset: Vector3
    // // ) {
    // //     let geometry = new SphereGeometry();
    // //     let material = new MeshBasicMaterial();
    // //
    // //     for (let rowIndex = rowIndexOffset; rowIndex < rowCount + rowIndexOffset; rowIndex++) {
    // //         for (let columnIndex = columnIndexOffset; columnIndex < columnCount + columnIndexOffset; columnIndex++) {
    // //             let mesh = new Mesh(geometry, material);
    // //
    // //             mesh.scale.set(
    // //                 scale.x,
    // //                 scale.y,
    // //                 scale.z
    // //             );
    // //             mesh.position.set(
    // //                 position.x + (offset.x * columnIndex),
    // //                 position.y + (offset.y * rowIndex),
    // //                 position.z
    // //             );
    // //
    // //             this.sceneChildren.push(mesh);
    // //         }
    // //     }
    // // }
    protected readonly Math = Math;
}
