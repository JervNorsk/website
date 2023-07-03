import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
    JnThSceneProps
} from "../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, interval, take} from "rxjs";
import * as THREE from 'three';
import {MathUtils} from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from "cannon-es-debugger";
import {RenderState} from "ngx-three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';

@Component({
    selector: '[jn-arcade-game-pong]',
    templateUrl: './jn-arcade-game-pong.component.html',
    styleUrls: ['./jn-arcade-game-pong.component.sass']
})
export class JnArcadeGamePong implements OnInit, OnDestroy {

    @Input()
    debug: boolean = false

    assets: {
        font?: Font
    } = {}

    config = {
        resolution: {
            width: 240,
            height: 240
        },
        camera: {
            zoom: 4.8
        },
        field: {
            size: 100
        },
        ball: {
            size: 1.5,
            speed: 50
        },
        player: {
            dimension: {
                width: 1.5,
                height: 2 * 5
            },
            distance: 0.8,
            speed: 50,
            score: [
                new BehaviorSubject(0),
                new BehaviorSubject(0),
            ]
        }
    }

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(take(1)).subscribe(it => {
            this.debug = it["debug"] === 'true'
        });
        new FontLoader().loadAsync('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json')
            .then(it => {
                this.assets.font = it;
            });
    }

    ngOnDestroy() {
        this.config.player.score.forEach(it =>
            it.unsubscribe()
        );
    }

    createCamera() {
        const camera = new THREE.OrthographicCamera(
            this.config.resolution.width / -this.config.camera.zoom, // Left
            this.config.resolution.width / this.config.camera.zoom, // Right
            this.config.resolution.height / this.config.camera.zoom, // Top
            this.config.resolution.height / -this.config.camera.zoom, // Bottom
            0.1, // Near clipping plane
            100 // Far clipping plane
        );
        camera.position.set(0, 2, 0);
        camera.lookAt(0, 0, 0);
        return {
            instance: camera
        };
    }

    createWall(material?: CANNON.Material) {
        const shape = new CANNON.Plane();
        const body = new CANNON.Body({
            material,
            mass: 0
        });

        body.addShape(shape);

        return {
            body
        }
    }

    createField(meshMaterial: THREE.MeshBasicMaterial) {
        const mesh = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineDashedMaterial({
                color: meshMaterial.color,
                dashSize: 1.585
            })
        );

        mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(
            [
                0, 0, -this.config.field.size / 2,
                0, 0, +this.config.field.size / 2
            ],
            3
        ));
        // mesh.material.copy(meshMaterial);
        // mesh.material.dashSize = 1;

        mesh.computeLineDistances();

        const result = {
            instance: mesh
        }
        return result;
    }

    createBall(meshMaterial: THREE.Material, bodyMaterial: CANNON.Material) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.config.ball.size,
                this.config.ball.size,
                this.config.ball.size
            ),
            meshMaterial
        );

        const shape = new CANNON.Sphere(this.config.ball.size / 2);
        const body = new CANNON.Body({
            material: bodyMaterial,
            mass: 1,
            linearDamping: 0,
            angularDamping: 0
        });

        body.addShape(shape);

        const result = {
            instance: mesh,
            body,
            bodyContactMaterial: {
                withWall: (targetMaterial: CANNON.Material) => new CANNON.ContactMaterial(bodyMaterial, targetMaterial, {
                    friction: 0, // Set the friction coefficient to 0 for perfect bouncing
                    restitution: 1 // Set the restitution (bounciness) to 1 for maximum bounce
                }),
                withPlayer: (targetMaterial: CANNON.Material) => new CANNON.ContactMaterial(bodyMaterial, targetMaterial, {
                    friction: 0.3, // Set the friction coefficient to 0 for perfect bouncing
                    restitution: 1 // Set the restitution (bounciness) to 1 for maximum bounce
                })
            },
            bodyListener: {
                onGoal: (it: any, playerScoreIndex: number) => {
                    const contact = it.contact as CANNON.ContactEquation;

                    // Check if the ball collides with the wall
                    if (contact.bi === body || contact.bj === body) {
                        this.config.player.score[playerScoreIndex].next(
                            this.config.player.score[playerScoreIndex].value + 1
                        );
                        result.events.onReset();
                    }
                }
            },
            events: {
                onReset: () => {
                    body.position.set(
                        0,
                        0,
                        // 0
                        MathUtils.randFloat(-1, 1) * (this.config.field.size / 2)
                    );
                    body.velocity.set(
                        // this.config.ball.speed,
                        (MathUtils.randInt(-1, 1) || 1) * this.config.ball.speed,
                        0,
                        // 0
                        (MathUtils.randInt(-1, 1) || 1) * this.config.ball.speed,
                    );
                    if (this.debug) {
                        console.log("[DEBUG] [OnReset]", result.body.velocity);
                    }
                },
                onBeforeRender: (state: RenderState) => {
                    mesh.position.set(
                        body.position.x,
                        body.position.y,
                        body.position.z
                    );
                    mesh.quaternion.set(
                        body.quaternion.x,
                        body.quaternion.y,
                        body.quaternion.z,
                        body.quaternion.w
                    );
                }
            }
        }
        return result;
    }

    createPlayer(meshMaterial: THREE.Material, bodyMaterial: CANNON.Material) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.config.player.dimension.width,
                Math.min(this.config.player.dimension.width, this.config.player.dimension.height),
                this.config.player.dimension.height
            ),
            meshMaterial
        );

        const shape = new CANNON.Box(
            new CANNON.Vec3(
                this.config.player.dimension.width / 2,
                Math.min(this.config.player.dimension.width, this.config.player.dimension.height) / 2,
                this.config.player.dimension.height / 2
            )
        );
        const body = new CANNON.Body({
            material: bodyMaterial,
            mass: 0
        });

        body.addShape(shape);

        const result = {
            instance: mesh,
            body,
            inputs: {
                direction: {
                    velocity: 0,
                },
                mouse: {
                    height: 0
                }
            },
            events: {
                onBeforeRender: (state: RenderState) => {
                    // body.position.z += result.inputs.direction.velocity * state.delta;
                    // body.applyForce(
                    //     new CANNON.Vec3(
                    //         0,
                    //         0,
                    //         result.inputs.direction.velocity * body.mass * 2
                    //     )
                    // );
                    // body.position.z += result.inputs.direction.velocity * state.delta;

                    // if()

                    mesh.position.set(
                        body.position.x,
                        body.position.y,
                        body.position.z
                    );
                    mesh.quaternion.set(
                        body.quaternion.x,
                        body.quaternion.y,
                        body.quaternion.z,
                        body.quaternion.w
                    );

                    body.position.z = result.inputs.mouse.height;
                },
                onInputHandle: (event: Event) => {
                    if (event instanceof KeyboardEvent) {
                        switch (event.type) {
                            case "keydown":
                                switch (event.key) {
                                    case "ArrowUp":
                                        result.inputs.direction.velocity = -this.config.player.speed;
                                        break;
                                    case "ArrowDown":
                                        result.inputs.direction.velocity = +this.config.player.speed;
                                        break;
                                }
                                break;
                            case "keyup":
                                switch (event.key) {
                                    case "ArrowUp":
                                    case "ArrowDown":
                                        result.inputs.direction.velocity = 0;
                                        break;
                                }
                                break;
                        }
                    } else if (event instanceof MouseEvent) {
                        switch (event.type) {
                            case "mousemove":
                                const heightNormalized = event.y / this.config.resolution.height;
                                result.inputs.mouse.height = (heightNormalized * this.config.field.size) - (this.config.field.size / 2);
                                break;
                        }
                    }
                    if (this.debug) {
                        // console.log("[DEBUG] [Input] [Player]", `type: '${event.type}', key: '${event.key}'`);
                        console.log("[DEBUG] [Input] [Player]", JSON.stringify(result.inputs, null, 2));
                    }
                }
            }
        }
        return result;
    }

    createPlayerScore(meshMaterial: THREE.Material) {
        const mesh = new THREE.Mesh(
            new TextGeometry("", {
                font: this.assets.font!,
                size: 10,
                height: 1,
                curveSegments: 4,
            }),
            meshMaterial
        );

        const result = {
            instance: mesh,
            events: {
                onUpdate: (it: number) => {
                    mesh.geometry = new TextGeometry(it.toString(), {
                        font: this.assets.font!,
                        size: 10,
                        height:  1,
                        curveSegments: 4
                    });
                    mesh.geometry.computeBoundingBox();
                    mesh.position.x =  -(mesh.geometry.boundingBox!.max!.x / 1.8);
                }
            }
        }
        return result;
    }

    onInitThScene({engine, scene}: JnThSceneProps): void {
        // Configuration
        // -------------------------------------------------------------------------------------------------------------
        const primaryMaterial = new THREE.MeshBasicMaterial({
            color: "#cfcfcf",
            // wireframe: true
        });

        // Renderer
        // -------------------------------------------------------------------------------------------------------------
        if (engine.renderer) {
            engine.renderer.setSize(this.config.resolution.width, this.config.resolution.height)
        }

        // Physics
        // -------------------------------------------------------------------------------------------------------------
        const world = new CANNON.World({
            gravity: CANNON.Vec3.ZERO
        });

        // Initialization
        // -------------------------------------------------------------------------------------------------------------
        // Camera
        const camera = this.createCamera();

        // Walls
        const wallBodyMaterial = new CANNON.Material();

        const wallTop = this.createWall(wallBodyMaterial);
        const wallRight = this.createWall(wallBodyMaterial);
        const wallBottom = this.createWall(wallBodyMaterial);
        const wallLeft = this.createWall(wallBodyMaterial);

        wallTop.body.position.set(0, 0, this.config.field.size / -2);

        wallRight.body.position.set(this.config.field.size / +2, 0, 0);
        wallRight.body.quaternion.setFromAxisAngle(CANNON.Vec3.UNIT_Y, MathUtils.degToRad(-90));

        wallBottom.body.position.set(0, 0, this.config.field.size / +2);
        wallBottom.body.quaternion.setFromAxisAngle(CANNON.Vec3.UNIT_Y, MathUtils.degToRad(180));

        wallLeft.body.position.set(this.config.field.size / -2, 0, 0);
        wallLeft.body.quaternion.setFromAxisAngle(CANNON.Vec3.UNIT_Y, MathUtils.degToRad(90));

        // Field
        const field = this.createField(primaryMaterial);

        // Ball
        const ballBodyMaterial = new CANNON.Material();
        const ball = this.createBall(primaryMaterial, ballBodyMaterial);

        // Players
        const playerBodyMaterial = new CANNON.Material();
        const playerA = this.createPlayer(primaryMaterial, playerBodyMaterial);
        const playerB = this.createPlayer(primaryMaterial, playerBodyMaterial);

        playerA.body.position.set(
            (this.config.field.size / 2) * this.config.player.distance * -1,
            0,
            0
        );

        playerB.body.position.set(
            (this.config.field.size / 2) * this.config.player.distance,
            0,
            0
        );

        // Player Scopre
        const playerScoreA = this.createPlayerScore(primaryMaterial);
        const playerScoreB = this.createPlayerScore(primaryMaterial);

        playerScoreA.instance.rotation.x = MathUtils.degToRad(-90);
        this.config.player.score[0].subscribe(it => {
            playerScoreA.instance.position.set(0, 0, 0);

            playerScoreA.events.onUpdate(it);

            playerScoreA.instance.position.x +=  (this.config.field.size / 2) * 0.5;
            playerScoreA.instance.position.z -=  (this.config.field.size / 2) * 0.7;
        });

        playerScoreB.instance.rotation.x = MathUtils.degToRad(-90);
        this.config.player.score[1].subscribe(it => {
            playerScoreB.instance.position.set(0, 0, 0);

            playerScoreB.events.onUpdate(it);

            playerScoreB.instance.position.x -=  (this.config.field.size / 2) * 0.5;
            playerScoreB.instance.position.z -=  (this.config.field.size / 2) * 0.7;
        });


        // Compositing
        // -------------------------------------------------------------------------------------------------------------
        // Camera
        scene.add(camera.instance);

        // Walls
        world.addBody(wallTop.body);

        world.addBody(wallRight.body);
        wallRight.body.addEventListener("collide", (it: any) => {
            ball.bodyListener.onGoal(it, 1);
        });

        world.addBody(wallBottom.body);

        world.addBody(wallLeft.body);
        wallLeft.body.addEventListener("collide", (it: any) => {
            ball.bodyListener.onGoal(it, 0);
        });

        // Field
        scene.add(field.instance);

        // Ball
        scene.add(ball.instance);
        world.addBody(ball.body);
        world.addContactMaterial(ball.bodyContactMaterial.withWall(wallBodyMaterial));
        world.addContactMaterial(ball.bodyContactMaterial.withPlayer(playerBodyMaterial));

        // Players
        scene.add(playerA.instance);
        world.addBody(playerA.body);
        document.addEventListener("keydown", playerA.events.onInputHandle);
        document.addEventListener("keyup", playerA.events.onInputHandle);
        document.addEventListener("mousemove", playerA.events.onInputHandle);

        scene.add(playerB.instance);
        world.addBody(playerB.body);
        // document.addEventListener("keydown", playerB.events.onInputHandle);
        // document.addEventListener("keyup", playerB.events.onInputHandle);

        // Player Score
        scene.add(playerScoreA.instance);
        scene.add(playerScoreB.instance);

        // Rendering
        // -------------------------------------------------------------------------------------------------------------
        engine.beforeRender$.subscribe(it => {
            // Physics
            // ---------------------------------------------------------------------------------------------------------
            world.step(1 / 60);

            // Scene
            // ---------------------------------------------------------------------------------------------------------
            // Ball
            ball.events.onBeforeRender(it);

            // Players
            playerA.events.onBeforeRender(it);
            playerB.events.onBeforeRender(it);

            playerB.body.position.set(
                playerB.body.position.x,
                playerB.body.position.y,
                ball.body.position.z
            );
        });

        // Debug
        // -------------------------------------------------------------------------------------------------------------
        if (this.debug) {
            // Physics
            // ---------------------------------------------------------------------------------------------------------
            const worldDebugger = CannonDebugger(scene, world);

            // Scene
            // ---------------------------------------------------------------------------------------------------------
            // Camera
            const cameraControl = new OrbitControls(
                camera.instance,
                engine.renderer!.domElement
            );

            // Field
            const axisHelper = new THREE.AxesHelper(this.config.field.size / 2);
            const gridHelper = new THREE.GridHelper(this.config.field.size, 20);

            gridHelper.position.y -= 0.0001;

            scene.add(axisHelper);
            scene.add(gridHelper);

            // Ball
            interval(1000).subscribe(it => {
                console.log("[DEBUG] [Interval] [Ball]", ball.body.velocity);
            });


            // Rendering
            // ---------------------------------------------------------------------------------------------------------
            engine.beforeRender$.subscribe(it => {
                // Physics
                // -----------------------------------------------------------------------------------------------------
                worldDebugger.update();
            });
        }

        // Controls
        // -------------------------------------------------------------------------------------------------------------
        ball.events.onReset();
    }
}
