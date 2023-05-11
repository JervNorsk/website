import {AfterViewInit, Component} from '@angular/core';
import {ThEngineService, ThGroup, ThObject3D} from "ngx-three";
import * as THREE from 'three';
import {AmbientLight, LoadingManager, Mesh, Scene} from 'three';
import {VRButton} from "three/examples/jsm/webxr/VRButton";

/**
 *
 * Code Reference: https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_waves.html
 */
@Component({
    selector: 'th-example-panorama-vr',
    templateUrl: './th-example-panorama-vr.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThExampleVRPanorama extends ThGroup implements AfterViewInit {

    constructor(
        private engine: ThEngineService,
        parent: ThObject3D
    ) {
        super(parent);
    }

    ngAfterViewInit() {
        console.log(this.engine);

        this.initPrefab();

        console.log(this.parent);
    }

    initPrefab() {
        let light = new AmbientLight(0xffffff, 1);
        this.objRef!.add(light);

        let panoSphereGeo = new THREE.SphereGeometry(6, 256, .56);
        let panoSphereMat = new THREE.MeshStandardMaterial({
            side: THREE.BackSide,
            displacementScale: -4.0
        })
        let sphere = new Mesh(panoSphereGeo, panoSphereMat);

        let manager = new THREE.LoadingManager();
        let loader = new THREE.TextureLoader(manager);

        loader.load(
            "https://threejs.org/examples/textures/kandao3.jpg",
            (texture) => {
                // texture.colorSpace = SRGBColorSpace;
                texture.minFilter = THREE.NearestFilter;
                texture.generateMipmaps = false;
                sphere.material.map = texture;
            }
        )

        loader.load(
            "https://threejs.org/examples/textures/kandao3_depthmap.jpg",
            (depth) => {
                depth.minFilter = THREE.NearestFilter;
                depth.generateMipmaps = false;
                sphere.material.displacementMap = depth;
            }
        );

        manager.onLoad = () => {
            this.objRef!.add(sphere);
        };

        this.engine.renderer!.xr.enabled = true;
        // this.engine.renderer!.xr.setReferenceSpaceType('');

        document.body.append(VRButton.createButton( this.engine.renderer! ))

        this.engine.beforeRender$.subscribe(state => {
            if(!this.engine.renderer!.xr.isPresenting) {
                sphere.rotation.y += 0.001;
                sphere.rotation.x = Math.sin(state.delta) * 0.2;
                sphere.rotation.z = Math.cos(state.delta) * 0.2;
            }
        });
        this.engine.renderer!.setAnimationLoop(() => {
            this.engine.render()
        })
    }

    // constructor(
    //     // parent: ThObject3D,
    //     private engine: ThEngineService
    // ) {
    //     // super(parent);
    //     // this.light = new AmbientLight(0xffffff, 1);
    //     //
    //     // this.sphere = new Mesh<SphereGeometry, MeshStandardMaterial>(
    //     //     new SphereGeometry(6, 256, 256),
    //     //     new MeshStandardMaterial({
    //     //         side: BackSide,
    //     //         displacementScale: -4.0
    //     //     })
    //     // )
    //     //
    //     // let manager = new LoadingManager();
    //     // let loader = new TextureLoader(manager);
    //     //
    //     // loader.load(
    //     //     "https://threejs.org/examples/textures/kandao3.jpg",
    //     //     (texture) => {
    //     //         // texture.colorSpace = SRGBColorSpace;
    //     //         texture.minFilter = NearestFilter;
    //     //         texture.generateMipmaps = false;
    //     //         this.sphere.material.map = texture;
    //     //     }
    //     // )
    //     // loader.load(
    //     //     "https://threejs.org/examples/textures/kandao3_depthmap.jpg",
    //     //     (depth) => {
    //     //         depth.minFilter = NearestFilter;
    //     //         depth.generateMipmaps = false;
    //     //         this.sphere.material.displacementMap = depth;
    //     //     }
    //     // );
    // }
    //
    // ngAfterViewInit() {
    //     // this.engine.renderer!.xr.enabled = true;
    //     // this.engine.renderer!.xr.setReferenceSpaceType('');
    //
    //     // let light = new AmbientLight(0xffffff, 1);
    //     // this.objRef!.add(light);
    //     //
    //     // let panoSphereGeo = new SphereGeometry(6, 256, 256);
    //     // let panoSphereMat = new MeshStandardMaterial({
    //     //     side: BackSide,
    //     //     displacementScale: -4.0
    //     // })
    //     // this.sphere = new Mesh(panoSphereGeo, panoSphereMat);
    //     //
    //     let manager = new LoadingManager();
    //     let loader = new TextureLoader(manager);
    //
    //     loader.load(
    //         "https://threejs.org/examples/textures/kandao3.jpg",
    //         (texture) => {
    //             // texture.colorSpace = SRGBColorSpace;
    //             texture.minFilter = NearestFilter;
    //             texture.generateMipmaps = false;
    //             this.sphere.material.map = texture;
    //         }
    //     )
    //
    //     loader.load(
    //         "https://threejs.org/examples/textures/kandao3_depthmap.jpg",
    //         (depth) => {
    //             depth.minFilter = NearestFilter;
    //             depth.generateMipmaps = false;
    //             this.sphere.material.displacementMap = depth;
    //         }
    //     );
    //
    //     manager.onLoad = () => {
    //         this.sphere.updateMatrix();
    //     };
    //
    //     // console.log(this.objRef!.parent);
    // }
    //
    // // onRenderUpdate(state: RenderState) {
    // //     if(!state.engine.renderer!.xr.enabled) {
    // //         state.engine.renderer!.xr.enabled = true;
    // //         state.engine.renderer!.xr.setReferenceSpace('local' as any);
    // //     }
    // //
    // //     if(!state.engine.renderer!.xr.isPresenting) {
    // //         console.log("this")
    // //         this.sphere.rotation.y *= 0.001;
    // //         this.sphere.rotation.x *= Math.sin(state.delta) * 0.2;
    // //         this.sphere.rotation.z *= Math.cos(state.delta) * 0.2;
    // //     }
    // // }
    //
    // onUpdateRenderState(state: RenderState) {
    //     this.sphere.position.y *= 0.001;
    //     // if(!state.engine.renderer!.xr.isPresenting) {
    //     //     this.sphere.rotation.y *= 0.001;
    //     //     this.sphere.rotation.x *= Math.sin(state.delta) * 0.2;
    //     //     this.sphere.rotation.z *= Math.cos(state.delta) * 0.2;
    //     // }
    // }
    //
    // protected readonly BackSide = BackSide;
}
