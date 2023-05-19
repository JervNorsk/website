import {Component, Input, OnInit} from '@angular/core';
import {
    BoxGeometry,
    DirectionalLight,
    InstancedMesh,
    LinearToneMapping,
    MathUtils,
    Matrix4,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    Vector3
} from "three";
import {Sky} from "three/examples/jsm/objects/Sky";
import {
    JnThSceneProps
} from "../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {VRButton} from "three/examples/jsm/webxr/VRButton";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs";

@Component({
    templateUrl: './jn-streaming-scene-game-loz-tok.component.html',
    styleUrls: ['./jn-streaming-scene-game-loz-tok.component.sass']
})
export class JnStreamingSceneGameLozTok implements OnInit {

    @Input()
    vr: boolean = false

    constructor(
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(take(1)).subscribe(it => {
            this.vr = it["vr"] === 'true'
        });
    }

    onInitBackground({engine, scene}: JnThSceneProps): void {
        if (this.vr) {
            engine.renderer!.xr.enabled = true;
            {
                document.body.append(
                    VRButton.createButton(engine.renderer!)
                )
                engine.beforeRender$.subscribe(renderState => {
                    if (!engine.renderer!.xr.isPresenting) {
                    }
                });
                engine.renderer!.setAnimationLoop(() => {
                    engine.render()
                })
            }
        }

        let camera = new PerspectiveCamera();
        {
            camera.position.set(3, 2, 3);
            camera.lookAt(new Vector3(0, 1, 0))

            scene.add(camera);
        }

        // let meshGeometry = new BoxGeometry();
        // let meshMaterial = new MeshStandardMaterial();
        // let mesh = new Mesh(meshGeometry, meshMaterial);
        // {
        //     scene.add(mesh);
        // }

        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_sky.html
        // const skyController = {
        //     turbidity: 5,
        //     rayleigh: 1.8,
        //     mieCoefficient: 0.002,
        //     mieDirectionalG: 0.8,
        //     elevation: -5,
        //     azimuth: 180,
        //     exposure: 0.5
        // };
        let sky = {
            object: Sky.prototype,
            controller: {
                turbidity: 0.2,
                rayleigh: 1,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.8,
                elevation: 10,
                azimuth: 90 + 30,
                exposure: 0.5
            },
            sun: DirectionalLight.prototype,
            sunElevationSpeed: 0.1,
            sunElevationDirection: 1,
            onInit: () => {
                sky.object = new Sky();
                sky.object.scale.setScalar(500000);

                sky.sun = new DirectionalLight();

                if (engine.renderer) {
                    engine.renderer.toneMapping = LinearToneMapping;
                    engine.renderer.toneMappingExposure = sky.controller.exposure
                }

                scene.add(sky.object);
                scene.add(sky.sun);
            },
            onRender: () => {
                const uniforms = sky.object.material.uniforms;
                uniforms['turbidity'].value = sky.controller.turbidity;
                uniforms['rayleigh'].value = sky.controller.rayleigh;
                uniforms['mieCoefficient'].value = sky.controller.mieCoefficient;
                uniforms['mieDirectionalG'].value = sky.controller.mieDirectionalG;

                const phi = MathUtils.degToRad(90 - sky.controller.elevation);
                const theta = MathUtils.degToRad(sky.controller.azimuth);

                sky.sun.position.setFromSphericalCoords(1, phi, theta);
                sky.sun.lookAt(new Vector3());

                uniforms['sunPosition'].value.copy(sky.sun.position);

                // if(sky.controller.elevation >= 45 || sky.controller.elevation <= -10) {
                //     sky.sunElevationDirection *= -1;
                // }
                // sky.controller.elevation += sky.sunElevationSpeed * sky.sunElevationDirection;
                // camera.lookAt(sky.sun);
            }
        };

        let ruins = {
            object: InstancedMesh.prototype,
            instance: {
                count: 100,
                coordinates: {
                    generator: (index: number): Object3D => {
                        let object = new Object3D();

                        object.rotation.set(
                            Math.random() * 360,
                            Math.random() * 360,
                            Math.random() * 360
                        )

                        object.position.set(
                            -Math.random() * 50 - 2,
                            + Math.random() * 200 + 10,
                            // +Math.random() * 5,
                            -Math.random() * 50 - 2
                        );

                        object.updateMatrix();

                        ruins.object.setMatrixAt(index, object.matrix);

                        return object;
                    },
                    fall: (index: number): Matrix4 => {
                        let matrix = new Matrix4();

                        ruins.object.getMatrixAt(index, matrix);

                        let position = new Vector3();

                        position.setFromMatrixPosition(matrix);

                        position.y -= 0.02;

                        matrix.setPosition(position);

                        ruins.object.setMatrixAt(index, matrix);

                        return matrix;
                    }
                }
            },
            onInit: () => {
                ruins.object = new InstancedMesh(
                    new BoxGeometry(),
                    new MeshPhongMaterial(),
                    ruins.instance.count
                );

                for (let index = 0; index < ruins.instance.count; index++) {
                    ruins.instance.coordinates.generator(index);
                }

                scene.add(ruins.object);
            },
            onRender: () => {
                for (let index = 0; index < ruins.instance.count; index++) {
                    let matrix = ruins.instance.coordinates.fall(index);
                    let position = new Vector3();

                    position.setFromMatrixPosition(matrix);

                    if(position.y < -100) {
                        ruins.instance.coordinates.generator(index);
                    }
                }

                ruins.object.instanceMatrix.needsUpdate = true;
            }
        }

        // Initialize the scene.
        sky.onInit();
        ruins.onInit();

        // Event subscriptions.
        engine.beforeRender$.subscribe(it => {
            sky.onRender();
            ruins.onRender();
        });
    }
}
