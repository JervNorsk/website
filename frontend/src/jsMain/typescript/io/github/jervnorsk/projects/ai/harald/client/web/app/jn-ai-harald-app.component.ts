import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs";
import {
    JnThSceneProps
} from "../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import * as THREE from "three";
import {
    AxesHelper,
    CameraHelper,
    DirectionalLightHelper,
    DoubleSide,
    GridHelper,
    Material, MathUtils, MeshStandardMaterial,
    PCFSoftShadowMap
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import CannonDebugRenderer from 'cannon-es-debugger';
import CannonDebugger from "cannon-es-debugger";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';

@Component({
    templateUrl: './jn-ai-harald-app.component.html',
    styleUrls: ['./jn-ai-harald-app.component.sass']
})
export class JnAiHaraldApp implements OnInit {

    @Input()
    debug: boolean = false

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(take(1)).subscribe(it => {
            this.debug = it["debug"] === 'true'
        });
    }

    onInitThScene({engine, scene}: JnThSceneProps): void {
        // Configuration
        // -------------------------------------------------------------------------------------------------------------
        if (engine.renderer) {
            engine.renderer.shadowMap.enabled = true;
            engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        // Physics
        // -------------------------------------------------------------------------------------------------------------
        // Create a world in Cannon.js
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);

        // Update the physics simulation in each frame
        const fixedTimeStep = 1.0 / 60.0;
        const maxSubSteps = 10;
        // -------------------------------------------------------------------------------------------------------------

        // Camera
        // -------------------------------------------------------------------------------------------------------------
        // Create a camera
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(
            0,
            10,
            10
        );
        camera.lookAt(0,0,0);

        scene.add(camera);
        // -------------------------------------------------------------------------------------------------------------

        // Ambient Light
        // -------------------------------------------------------------------------------------------------------------
        // Create an ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

        scene.add(ambientLight);
        // -------------------------------------------------------------------------------------------------------------

        // Directional Light
        // -------------------------------------------------------------------------------------------------------------
        // Create a directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7); // Set the color and intensity of the directional light
        const directionalLightRadius = 15; // The distance from the origin
        const directionalLightInclinationDeg = 20; // The inclination angle in degrees
        const directionalLightAzimuthDeg = 90; // The azimuth angle in degrees

        directionalLight.castShadow = true;

        directionalLight.shadow.mapSize.width =
        directionalLight.shadow.mapSize.height = 1024;

        directionalLight.shadow.camera.top =
            +directionalLightRadius * 2;
        directionalLight.shadow.camera.bottom =
            -directionalLightRadius * 2;
        directionalLight.shadow.camera.left =
            -directionalLightRadius * 2;
        directionalLight.shadow.camera.right =
            +directionalLightRadius * 2;
        directionalLight.shadow.camera.near =
            -directionalLightRadius / 2;
        directionalLight.shadow.camera.far =
            +directionalLightRadius * 2;

        directionalLight.position.setFromSphericalCoords(
            directionalLightRadius,
            THREE.MathUtils.degToRad(directionalLightInclinationDeg),
            THREE.MathUtils.degToRad(directionalLightAzimuthDeg)
        );

        // scene.add(directionalLight);
        //
        // if(this.debug) {
        //     // Enable directional light debugging
        //     scene.add(
        //         new DirectionalLightHelper(directionalLight)
        //     );
        //     scene.add(
        //         new CameraHelper(directionalLight.shadow.camera)
        //     );
        // }
        // -------------------------------------------------------------------------------------------------------------

        // Floor
        // -------------------------------------------------------------------------------------------------------------
        // Defines floor variables
        const floorWidth = 20;
        const floorHeight = 100;
        const floorDepth = 10;

        // Create a material for the floor
        const floorMaterial = new THREE.MeshStandardMaterial({color: 0x555555});

        // Create the floor mesh and boxy
        const floorGeometry = new THREE.BoxGeometry(floorWidth, floorHeight, floorDepth);
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        const floorShape = new CANNON.Box(new CANNON.Vec3(floorWidth / 2, floorHeight / 2, floorDepth / 2));
        // const floorShape = new CANNON.Box(new CANNON.Vec3(floorSize / 2  - 0.05, floorHeight / 2 - 0.05, floorSize / 2 - 0.05));
        // const floorShape = new CANNON.Plane();
        // const floorOffset = new CANNON.Vec3(0, 0, 0); // Offset to center the shape
        const floorBody = new CANNON.Body({mass: 0, material: new CANNON.Material()});

        floorBody.addShape(floorShape);
        // floorBody.addShape(floorShape, floorOffset);

        floorMesh.castShadow = true;
        floorMesh.receiveShadow = true;

        // Align the floor mesh and body
        floorMesh.position.set(0, -floorHeight / 2, 0);
        floorBody.position.set(floorMesh.position.x, floorMesh.position.y, floorMesh.position.z);
        // floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

        // Add the floor wall mesh to the scene and the body to the world
        scene.add(floorMesh);
        world.addBody(floorBody);

        if(this.debug) {
            // Enable grid level zero debugging
            scene.add(
                new GridHelper(10)
            );
        }
        // -------------------------------------------------------------------------------------------------------------

        // Walls
        // -------------------------------------------------------------------------------------------------------------
        // Defines walls variables
        const wallHeight = 10;
        const wallDepth = 1;
        const wallLedge = 5;

        // Create a material for the wall
        const wallMaterial = new THREE.MeshStandardMaterial({
            // color: 0x666666
            color: 0xffffff
        });

        // Create the back wall mesh and body
        const backWallGeometry = new THREE.BoxGeometry(floorWidth, floorHeight + wallHeight, wallDepth);
        const backWallMesh = new THREE.Mesh(backWallGeometry, wallMaterial);
        const backWallShape = new CANNON.Box(new CANNON.Vec3(floorWidth / 2, (floorHeight + wallHeight) / 2, wallDepth / 2));
        const backWallBody = new CANNON.Body({mass: 0});

        backWallBody.addShape(backWallShape);

        backWallMesh.castShadow = true;
        backWallMesh.receiveShadow = true;

        // Align the back wall mesh and body
        backWallMesh.position.set(
            0,
            -floorHeight / 2 + wallHeight / 2,
            -floorDepth / 2 - wallDepth / 2
        );
        backWallBody.position.set(backWallMesh.position.x, backWallMesh.position.y, backWallMesh.position.z);

        // Add the back wall mesh to the scene and the body to the world
        scene.add(backWallMesh);
        world.addBody(backWallBody);

        // Create the left wall mesh and body
        const leftWallGeometry = new THREE.BoxGeometry(wallDepth, floorHeight + wallHeight, (floorDepth + wallDepth) + wallLedge );
        const leftWallMesh = new THREE.Mesh(leftWallGeometry, wallMaterial);
        const leftWallShape = new CANNON.Box(new CANNON.Vec3(wallDepth / 2, (floorHeight + wallHeight) / 2, ((floorDepth + wallDepth) + wallLedge) / 2));
        const leftWallBody = new CANNON.Body({mass: 0});

        leftWallBody.addShape(leftWallShape);

        leftWallMesh.castShadow = true;
        leftWallMesh.receiveShadow = true;

        // Align the left wall mesh and body
        leftWallMesh.position.set(
            -floorWidth / 2 - wallDepth / 2,
            -floorHeight / 2 + wallHeight / 2,
            -wallDepth / 2 + wallLedge / 2
        );
        leftWallBody.position.set(leftWallMesh.position.x, leftWallMesh.position.y, leftWallMesh.position.z);

        // Add the left wall mesh to the scene and the body to the world
        scene.add(leftWallMesh);
        world.addBody(leftWallBody);

        // Create the right wall mesh and body
        const rightWallGeometry = new THREE.BoxGeometry(wallDepth, floorHeight + wallHeight, (floorDepth + wallDepth) + wallLedge);
        const rightWallMesh = new THREE.Mesh(rightWallGeometry, wallMaterial);
        const rightWallShape = new CANNON.Box(new CANNON.Vec3(wallDepth / 2, (floorHeight + wallHeight) / 2, ((floorDepth + wallDepth) + wallLedge) / 2));
        const rightWallBody = new CANNON.Body({mass: 0});

        rightWallBody.addShape(leftWallShape);

        rightWallMesh.castShadow = true;
        rightWallMesh.receiveShadow = true;

        // Align the back wall mesh and body
        rightWallMesh.position.set(
            +floorWidth / 2 + wallDepth / 2,
            -floorHeight / 2 + wallHeight / 2,
            -wallDepth / 2 + wallLedge / 2
        );
        rightWallBody.position.set(rightWallMesh.position.x, rightWallMesh.position.y, rightWallMesh.position.z);

        // Add the right wall mesh to the scene and the body to the world
        scene.add(rightWallMesh);
        world.addBody(rightWallBody);
        // -------------------------------------------------------------------------------------------------------------

        // Ceil
        // -------------------------------------------------------------------------------------------------------------
        const spotlightArray: THREE.SpotLight[] = [];
        const spotlightPadding = floorDepth;
        const spotlightCount = floorDepth / spotlightPadding;
9
        camera.position.y += 15;
        camera.position.z = 0;

        for(let iX = 0; iX < spotlightCount; iX++) {
            for(let iZ = 0; iZ < spotlightCount; iZ++) {
                // Create a spotlight
                const spotlight = new THREE.SpotLight(
                    0xffffff,
                    // 1 / (spotlightCount * 2)
                    1
                );

                spotlight.angle = MathUtils.degToRad(57.5);

                spotlight.castShadow = true;
                spotlight.shadow.mapSize.width = 1024; // Set the shadow map width
                spotlight.shadow.mapSize.height = 1024; // Set the shadow map height
                spotlight.shadow.camera.near = 0.5; // Set the near clipping plane of the shadow camera
                spotlight.shadow.camera.far = 200; // Set the far clipping plane of the shadow camera

                spotlight.position.set(
                  (-floorDepth / 2) + (iX * floorDepth),
                  wallHeight,
                  // (-floorDepth / 2 + 0.5)
                    // 0
                    floorDepth / 2
                );

                // Align the spotlight
                // spotlight.position.setY(wallHeight);
                // spotlight.position.set(
                //     (iX * spotlightPadding) - (spotlightPadding / 2),
                //     wallHeight,
                //     iZ * spotlightPadding * 2
                // );

                spotlight.target.position.set(
                    spotlight.position.x,
                    0,
                    // -floorDepth / 2 + floorDepth / 4
                    // spotlight.position.z
                    0
                );
                spotlight.target.updateMatrixWorld();

                scene.add(spotlight);

                if (this.debug) {
                    // Add a spotlight helper to visualize the spotlight direction and shadow camera
                    scene.add(
                        new THREE.SpotLightHelper(spotlight)
                    );
                    // scene.add(
                    //     new CameraHelper(spotlight.shadow.camera)
                    // );
                }
            }
        }
        // -------------------------------------------------------------------------------------------------------------

        // Actor
        // -------------------------------------------------------------------------------------------------------------
        // Defines actor variables
        const actorSize = 1;

        // Create a material for the actor
        const actorMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});

        // Create the actor mesh and body
        const actorGeometry = new THREE.BoxGeometry(actorSize, actorSize, actorSize);
        const actorMesh = new THREE.Mesh(actorGeometry, actorMaterial);
        const actorShape = new CANNON.Box(new CANNON.Vec3(actorSize / 2, actorSize / 2, actorSize / 2));
        // const actorShape = new CANNON.Box(new CANNON.Vec3(actorSize / 2 - 0.05, actorSize / 2 - 0.05, actorSize / 2 - 0.05));
        // const actorOffset = new CANNON.Vec3(0, 0, 0); // Offset to center the shape
        const actorBody = new CANNON.Body({mass: 1, material: new CANNON.Material()});

        actorBody.addShape(actorShape);
        // actorBody.addShape(actorShape, actorOffset);

        actorMesh.receiveShadow = true;
        actorMesh.castShadow = true;

        // Configure the actor body
        actorBody.linearDamping = 0; // Disable linear damping
        actorBody.angularDamping = 0; // Disable angular damping

        // Configure the actor material
        world.addContactMaterial(
            new CANNON.ContactMaterial(floorBody.material!, actorBody.material!, {
                friction: 0,
                restitution: 0.3,
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3,
            })
        );

        // Align the actor mesh and body
        actorMesh.position.set(0, actorSize / 2 + 10, 0);
        actorBody.position.set(actorMesh.position.x, actorMesh.position.y, actorMesh.position.z);

        // Add the right wall mesh to the scene and the body to the world
        scene.add(actorMesh);
        world.addBody(actorBody);

        // Set up keyboard input handling
        const keyboardState: {
            [code: string]: boolean
        } = {};
        document.addEventListener('keydown', (event) => {
            keyboardState[event.code] = true;
        });
        document.addEventListener('keyup', (event) => {
            keyboardState[event.code] = false;
        });

        // Apply forces based on keyboard input
        function handleKeyboardInput() {
            const speed = 1; // Increase the speed value

            const velocity = actorBody.velocity;

            if (keyboardState['ArrowLeft']) {
                // Update velocity to slide left
                velocity.x = -speed;
            } else if (keyboardState['ArrowRight']) {
                // Update velocity to slide right
                velocity.x = speed;
            } else {
                // No input, stop sliding
                velocity.x = 0;
            }

            if (keyboardState['Space'] && actorBody.position.y <= 1.1) {
                // Apply upward velocity for jumping
                velocity.y = 10; // Increase the velocity value
            }

            if (keyboardState['ArrowUp']) {
                // Update velocity to move forward
                velocity.z = -speed;
            } else if (keyboardState['ArrowDown']) {
                // Update velocity to move backward
                velocity.z = speed;
            } else {
                // No input, stop moving
                velocity.z = 0;
            }

            // Prevent rolling by disabling rotation along all axes
            actorBody.angularVelocity.set(0, actorBody.angularVelocity.y, 0);
        }
        // -------------------------------------------------------------------------------------------------------------

        // Composer
        // -------------------------------------------------------------------------------------------------------------
        // Add post-processing for soft shadows
        const composer = new EffectComposer(engine.renderer!);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bokehPass = new BokehPass(scene, camera, {
            focus: 1.0,
            aperture: 0.025,
            maxblur: 0.01
        });
        bokehPass.renderToScreen = true;
        composer.addPass(bokehPass);

        // Debugging
        // -------------------------------------------------------------------------------------------------------------
        const worldDebugger = CannonDebugger(scene, world);
        if (this.debug) {
            // Adjust camera position
            // camera.position.set(5, 10, 10);
            // Enable orbital camera
            new OrbitControls(camera, engine.renderer!.domElement);

            // Enable grid axes debugging
            scene.add(
                new AxesHelper(10)
            );
        }

        // Events
        // -------------------------------------------------------------------------------------------------------------
        engine.renderer!.setAnimationLoop(it => {
        });
        engine.beforeRender$.subscribe(it => {
            // Step the physics simulation
            world.step(fixedTimeStep, 1, maxSubSteps);

            // Update the actor's position in Three.js based on the physics simulation
            actorMesh.position.set(actorBody.position.x, actorBody.position.y, actorBody.position.z);
            // actorMesh.quaternion.set(0, actorBody.quaternion.y, 0, actorBody.quaternion.w);
            actorMesh.quaternion.set(actorBody.quaternion.x, actorBody.quaternion.y, actorBody.quaternion.z, actorBody.quaternion.w);

            // Handle keyboard input
            handleKeyboardInput();

            // Update the shadow camera
            // directionalLight.shadow.camera.position.copy(camera.position);
            // directionalLight.shadow.camera.rotation.copy(camera.rotation);

            // Update composer
            composer.render(it.delta);

            if(this.debug) {
                worldDebugger.update();
            }
        });

        console.log(scene.children);
        console.log(world);
    }
}

//     onInitThScene(props: JnThSceneProps): void {
//         // Configuration
//         // -------------------------------------------------------------------------------------------------------------
//
//         // Initialization
//         // -------------------------------------------------------------------------------------------------------------
//         this.camera.thOnInit(props);
//
//         if(this.debug) {
//             this.camera.debug
//         }
//
//         // Events
//         // -------------------------------------------------------------------------------------------------------------
//         props.engine.beforeRender$.subscribe(it => {
//         });
//         props.engine.renderer?.setAnimationLoop(it => {
//         });
//
//         console.log(props.scene.children);
//     }
//
//     camera = new JnThObject<
//         THREE.PerspectiveCamera,
//         {
//             debug: JnThObject<THREE.PerspectiveCamera>
//         }>({
//         doInit: (renderer, root) => {
//             // Create a camera
//             const camera = new THREE.PerspectiveCamera(
//                 75,
//                 window.innerWidth / window.innerHeight,
//                 0.1,
//                 1000
//             );
//             camera.position.z = 5;
//
//             return camera;
//         },
//         debug: new JnThObject<THREE.PerspectiveCamera>({
//             doInit: (renderer: Renderer, root: Object3D) => {
//                 // Create a camera
//                 const camera = new THREE.PerspectiveCamera(
//                     75,
//                     window.innerWidth / window.innerHeight,
//                     0.1,
//                     1000
//                 );
//                 camera.position.z = 5;
//
//                 return camera;
//             }
//         })
//     });
// }
//
// class JnThObject<T extends THREE.Object3D, R = {}> {
//     constructor(
//         private props: {
//                 instance?: T,
//                 doInit(renderer: THREE.Renderer, root: THREE.Object3D): T
//                 doUpdate?(renderer: THREE.Renderer, delta: number): void,
//
//                 debug?: JnThObject<T>
//             }
//             & R
//     ) {
//     }
//
//     public thOnInit({engine, scene}: JnThSceneProps) {
//         // Executing
//         // -------------------------------------------------------------------------------------------------------------
//         this.props.instance = this.props.doInit(engine.renderer!, scene);
//
//         // Rendering
//         // -------------------------------------------------------------------------------------------------------------
//         if (this.props.instance) {
//             scene.add(this.props.instance!);
//         }
//     }
//
//     public thOnUpdate({engine, delta}: RenderState) {
//         // Checking
//         // -------------------------------------------------------------------------------------------------------------
//         if (!this.props.instance && !this.props.doUpdate) {
//             return;
//         }
//         // Executing
//         // -------------------------------------------------------------------------------------------------------------
//         this.props.doUpdate!(engine.renderer!, delta);
//     }
// }
//
// interface JnThObjectProps<T, R = {}> {
//     instance?: T
// }

//     camera: JnThObject<THREE.PerspectiveCamera> = new class extends JnThObject<THREE.PerspectiveCamera> {
//         protected doInit(renderer: THREE.Renderer, root: THREE.Object3D): THREE.PerspectiveCamera {
//             return new THREE.PerspectiveCamera();
//         }
//     }
//
//     environment: JnThObject<THREE.Group> = new class extends JnThObject<THREE.Group> {
//         protected override doInit(renderer: Renderer, root: Object3D): Group {
//             return new Group();
//         }
//     }
//
//     onInitThScene(props: JnThSceneProps): void {
//         // Configuration
//         // -------------------------------------------------------------------------------------------------------------
//
//         // Initialization
//         // -------------------------------------------------------------------------------------------------------------
//         this.camera.thOnInit(props);
//
//         // Events
//         // -------------------------------------------------------------------------------------------------------------
//         props.engine.beforeRender$.subscribe(it => {
//         });
//         props.engine.renderer?.setAnimationLoop(it => {
//         });
//
//         console.log(props.scene.children);
//     }
// }
//
// interface JnAiHaraldAppProps {
//
// }
//
// abstract class JnThObject<I> {
//     instance?: I
//     controls?: OrbitControls;
//     assets?: {
//         maps?: {
//             [p: string]: JnThAssetProps<Texture>
//         }
//     };
//
//     public thOnInit({engine, scene}: JnThSceneProps): void {
//         // Executing
//         // -------------------------------------------------------------------------------------------------------------
//         this.instance = this.doInit(engine.renderer!, scene);
//     }
//
//     public thOnUpdate({engine, delta}: RenderState): void {
//         // Checking
//         // -------------------------------------------------------------------------------------------------------------
//         if (!this.instance) {
//             return;
//         }
//         // Executing
//         // -------------------------------------------------------------------------------------------------------------
//         this.doUpdate(engine.renderer!, delta);
//     }
//
//     protected abstract doInit(renderer: THREE.Renderer, root: THREE.Object3D): I;
//
//     protected doUpdate(renderer: THREE.Renderer, delta: number): void {
//     };
// }
//
// interface JnThAssetProps<I> {
//     instance?: I,
//     url: string
// }

//     camera: JnThObject<THREE.PerspectiveCamera> = {
//         thOnInit: ({engine, scene}: JnThSceneProps) => {
//             // Initializing
//             // ---------------------------------------------------------------------------------------------------------
//             this.camera.instance = new PerspectiveCamera(
//                 75,
//                 window.innerWidth / window.innerHeight,
//                 0.1,
//                 1000
//             );
//             this.camera.instance.position.set(0, 5, 10);
//             this.camera.instance?.lookAt(0, 0, 0);
//
//             // Finalizing
//             // ---------------------------------------------------------------------------------------------------------
//             if(this.debug) {
//                 this.cameraDebug.thOnInit({engine, scene});
//             }
//             scene.add(this.camera.instance);
//         },
//         thOnUpdate: ({engine, delta}: RenderState) => {
//             // Checking
//             // ---------------------------------------------------------------------------------------------------------
//             if (!this.camera.instance) {
//                 return;
//             }
//         }
//     }
//     cameraDebug: JnThObject<THREE.PerspectiveCamera> = {
//         thOnInit: ({engine, scene}: JnThSceneProps) => {
//             // Initializing
//             // ---------------------------------------------------------------------------------------------------------
//             this.cameraDebug.instance = new PerspectiveCamera();
//             this.cameraDebug.instance!.position.set(5, 10, 10);
//             this.cameraDebug.instance!.lookAt(0, 0, 0);
//
//             this.cameraDebug.controls = new OrbitControls(this.cameraDebug.instance!, engine.renderer!.domElement!)
//             this.cameraDebug.controls!.enablePan = true;
//             this.cameraDebug.controls!.enableZoom = true;
//
//             // Finalizing
//             // ---------------------------------------------------------------------------------------------------------
//             scene.add(this.cameraDebug.instance);
//             scene.add(
//                 new CameraHelper(this.camera.instance!)
//             )
//         },
//         thOnUpdate: ({engine, delta}: RenderState) => {
//             // Checking
//             // ---------------------------------------------------------------------------------------------------------
//             if (!this.cameraDebug.instance) {
//                 return;
//             }
//         }
//     }
//
//     environment: JnThObject<THREE.Group> = {
//         thOnInit: ({engine, scene}: JnThSceneProps) => {
//             // Initializing
//             // ---------------------------------------------------------------------------------------------------------
//             this.environment.instance = new THREE.Group();
//             this.environment.instance!.add(
//                 new THREE.AmbientLight(
//                     0xffffff,
//                     0.5,
//                 )
//             )
//             // Create a directional light
//             // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//             //
//             // // Set the light's position using spherical coordinates (in degrees)
//             // const distance = 5; // Distance from the origin
//             // const polarAngleDeg = 25; // Angle from the positive y-axis (vertical angle)
//             // const azimuthalAngleDeg = 90; // Angle around the y-axis (horizontal angle)
//             //
//             // // Convert the angles to radians
//             // const polarAngleRad = THREE.MathUtils.degToRad(polarAngleDeg);
//             // const azimuthalAngleRad = THREE.MathUtils.degToRad(azimuthalAngleDeg);
//             //
//             //
//             // directionalLight.position.setFromSphericalCoords(distance, polarAngleRad, azimuthalAngleRad);
//             // this.environment.instance!.add(directionalLight);
//             //
//             // if(this.debug) {
//             //     directionalLight.add(new DirectionalLightHelper(directionalLight))
//             // }
//
//             // Finalizing
//             // ---------------------------------------------------------------------------------------------------------
//             if(this.debug) {
//                 this.environmentDebug.thOnInit({engine, scene});
//             }
//             scene.add(this.environment.instance);
//         },
//         thOnUpdate: ({engine, delta}: RenderState) => {
//             // Checking
//             // ---------------------------------------------------------------------------------------------------------
//             if (!this.environment.instance) {
//                 return;
//             }
//         }
//     }
//     environmentDebug: JnThObject<THREE.Group> = {
//         thOnInit: ({engine, scene}: JnThSceneProps) => {
//             // Initializing
//             // ---------------------------------------------------------------------------------------------------------
//             this.environmentDebug.instance = new THREE.Group();
//             this.environmentDebug.instance!.add(
//                 new THREE.AxesHelper(10)
//             )
//             this.environmentDebug.instance!.add(
//                 new THREE.GridHelper()
//             )
//
//             const box = new THREE.Mesh(
//                 new THREE.BoxGeometry(),
//                 new THREE.MeshStandardMaterial()
//             );
//             box.position.y = box.scale.y / 2;
//             this.environmentDebug.instance!.add(box);
//
//             // Finalizing
//             // ---------------------------------------------------------------------------------------------------------
//             scene.add(this.environmentDebug.instance);
//         },
//         thOnUpdate: ({engine, delta}: RenderState) => {
//             // Checking
//             // ---------------------------------------------------------------------------------------------------------
//             if (!this.environmentDebug.instance) {
//                 return;
//             }
//         }
//     }
//
//     room: JnThObject<THREE.Group> = {
//         assets: {
//             maps: {
//                 uvChecker: {
//                     url: `${window.location.pathname}/assets/maps/uv/uv-checker.png`
//                 }
//             }
//         },
//         thOnInit: ({engine, scene}: JnThSceneProps) => {
//             // Initializing
//             // ---------------------------------------------------------------------------------------------------------
//             this.room.instance = new THREE.Group();
//
//             // Create a custom shader material
//             // let checkeredMaterial: Material = new THREE.ShaderMaterial({
//             //     uniforms: {
//             //         uTexture: {
//             //             value: new THREE.TextureLoader().load(this.room.assets!.maps!["uvChecker"].url, it => {
//             //                 it.wrapS = THREE.RepeatWrapping;
//             //                 it.wrapT = THREE.RepeatWrapping;
//             //             })
//             //         },
//             //         uSize: {value: 0.3},
//             //         directionalLightDirection: {
//             //             value: this.environment.instance!.children.find(it => it instanceof THREE.DirectionalLight)!.position
//             //         }
//             //     },
//             //     vertexShader: `
//             //         varying vec2 vUv;
//             //         varying vec3 vNormal;
//             //         varying vec3 vPosition;
//             //         varying vec3 vWorldPosition;
//             //
//             //         void main() {
//             //             vUv = uv;
//             //             vNormal = normal;
//             //             vPosition = position;
//             //             vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
//             //
//             //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//             //         }
//             //     `,
//             //     fragmentShader: `
//             //         uniform sampler2D uTexture;
//             //         uniform float uSize;
//             //         uniform vec3 directionalLightDirection;
//             //
//             //         varying vec2 vUv;
//             //         varying vec3 vNormal;
//             //         varying vec3 vPosition;
//             //         varying vec3 vWorldPosition;
//             //
//             //         void main() {
//             //             // vec2 uv = vec2(vWorldPosition.x, vWorldPosition.y) * uSize;
//             //             // uv = (uv + vec2(1.0)) / 2.0;
//             //             // gl_FragColor = texture2D(uTexture, uv);
//             //
//             //             vec3 blend = abs(normalize(vNormal));
//             //             vec2 uvX = vPosition.yz * uSize;
//             //             vec2 uvY = vPosition.xz * uSize;
//             //             vec2 uvZ = vPosition.xy * uSize;
//             //             vec4 colorX = texture2D(uTexture, uvX);
//             //             vec4 colorY = texture2D(uTexture, uvY);
//             //             vec4 colorZ = texture2D(uTexture, uvZ);
//             //             gl_FragColor = colorX * blend.x + colorY * blend.y + colorZ * blend.z;
//             //
//             //             vec3 lightDirection = normalize(directionalLightDirection - vPosition);
//             //             vec3 normal = normalize(vNormal);
//             //             float intensity = max(dot(normal, lightDirection), 0.0);
//             //
//             //             gl_FragColor *= intensity;
//             //         }
//             //     `
//             // });
//             const checkeredMaterial = new THREE.MeshStandardMaterial({
//                 map: new THREE.TextureLoader().load(this.room.assets!.maps!["uvChecker"].url, it => {
//                     it.wrapS = THREE.RepeatWrapping;
//                     it.wrapT = THREE.RepeatWrapping;
//                 }),
//
//             });
//
// // Room dimensions
//             const roomWidth = 10;
//             const roomHeight = 10;
//             const roomDepth = 10;
//             const wallThickness = 1;
//
// // Create the walls
//             const wall1 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness), checkeredMaterial);
//             const wall2 = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness), checkeredMaterial);
//             const wall3 = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth - wallThickness * 2), checkeredMaterial);
//
// // Position the walls
//             wall1.position.z = -roomDepth / 2 + wallThickness / 2;
//             wall2.position.z = roomDepth / 2 - wallThickness / 2;
//             wall3.position.x = roomWidth / 2 - wallThickness / 2;
//             wall1.position.y = roomHeight / 2;
//             wall2.position.y = roomHeight / 2;
//             wall3.position.y = roomHeight / 2;
//
// // Create the floor
//             const floorGeometry = new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth);
//             const floor = new THREE.Mesh(floorGeometry, checkeredMaterial);
//
// // Position the floor
//             floor.position.y = 0;
//
// // Add the walls and floor to the scene
//             scene.add(wall1);
//             scene.add(wall2);
//             scene.add(wall3);
//             scene.add(floor);
//
//
//             // this.room.instance!
//
//             // Finalizing
//             // ---------------------------------------------------------------------------------------------------------
//             scene.add(this.room.instance);
//         },
//         thOnUpdate: ({engine, delta}: RenderState) => {
//             // Checking
//             // ---------------------------------------------------------------------------------------------------------
//             if (!this.room.instance) {
//                 return;
//             }
//         }
//     }
//
//     onInitThScene(props: JnThSceneProps): void {
//         // Configuration
//         // -------------------------------------------------------------------------------------------------------------
//
//         // Initialization
//         // -------------------------------------------------------------------------------------------------------------
//         this.camera.thOnInit(props);
//         this.environment.thOnInit(props);
//         this.room.thOnInit(props);
//
//         console.log(props.scene.children);
//
//         // Events
//         // -------------------------------------------------------------------------------------------------------------
//         props.engine.beforeRender$.subscribe(it => {
//         });
//         props.engine.renderer?.setAnimationLoop(it => {
//         });
//     }
// }
//
// export interface JnThAssetProps<I> {
//     instance?: I,
//     url: string
// }
//
// export interface JnThObjectProps<I> {
//     instance?: I;
//     controls?: OrbitControls;
//     assets?: {
//         maps?: {
//             [p: string]: JnThAssetProps<Texture>
//         }
//     };
// }
//
// export interface JnThObject<I> extends JnThObjectProps<I> {
//     thOnInit({engine, scene}: JnThSceneProps): void;
//     thOnUpdate({engine, delta}: RenderState): void;
// }
//
// export interface JnAiHaraldAppProps {
//
// }
