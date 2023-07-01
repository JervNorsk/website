import {Component, Input, OnInit} from '@angular/core';
import {
    JnThSceneProps
} from "../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from 'cannon-es';
import CannonDebugger from "cannon-es-debugger";
import {MathUtils} from "three";

@Component({
    selector: '[jn-arcade-game-pong]',
    templateUrl: './jn-arcade-game-pong.component.html',
    styleUrls: ['./jn-arcade-game-pong.component.sass']
})
export class JnArcadeGamePong implements OnInit {

    @Input()
    debug: boolean = false

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
            speed: 1000
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

    createBall(material: CANNON.Material) {
        const ballShape = new CANNON.Sphere(1);
        const ballBody = new CANNON.Body({
            material,
            mass: 1
        });

        ballBody.addShape(ballShape);

        const ball = {
            instance: new THREE.Object3D(),
            body: ballBody,
            bodyContactMaterial: {
                bounce: (targetMaterial: CANNON.Material) => new CANNON.ContactMaterial(material, targetMaterial, {
                    friction: 0, // Set the friction coefficient to 0 for perfect bouncing
                    restitution: 1 // Set the restitution (bounciness) to 1 for maximum bounce
                })
            },
            bodyListener: {
                goal: (it: any) => {
                    const contact = it.contact as CANNON.ContactEquation;

                    // Check if the ball collides with the wall
                    if (contact.bi === ballBody || contact.bj === ballBody) {
                      ball.actions.reset();
                    }
                }
            },
            actions: {
                reset: () => {
                    ballBody.position.set(
                        0,
                        0,
                        MathUtils.randFloat(-1, 1) * (this.config.field.size / 2)
                    );
                    ballBody.velocity.set(
                        (MathUtils.randInt(-1, 1) || 1) * this.config.ball.speed,
                        0,
                        (MathUtils.randInt(-1, 1) || 1) * this.config.ball.speed,
                    );
                    console.log(ballBody.velocity);
                }
            }
        }
        return ball;
    }

    createWall(material?: CANNON.Material) {
        const wallShape = new CANNON.Plane();
        const wallBody = new CANNON.Body({
            material,
            mass: 0
        });

        wallBody.addShape(wallShape);

        return {
            body: wallBody
        }
    }

    onInitThScene({engine, scene}: JnThSceneProps): void {
        // Set up the renderer
        if (engine.renderer) {
            engine.renderer.setSize(this.config.resolution.width, this.config.resolution.height)
        }

        // Camera
        // -------------------------------------------------------------------------------------------------------------
        const camera = this.createCamera();

        // Ball
        // -------------------------------------------------------------------------------------------------------------
        const ballBodyMaterial = new CANNON.Material();
        const ball = this.createBall(ballBodyMaterial);

        // Walls
        // -------------------------------------------------------------------------------------------------------------
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


        // Goals
        // -------------------------------------------------------------------------------------------------------------


        // Players
        // -------------------------------------------------------------------------------------------------------------


        // Field
        // -------------------------------------------------------------------------------------------------------------


        // Scene
        // -------------------------------------------------------------------------------------------------------------
        scene.add(camera.instance);

        // Physics
        // -------------------------------------------------------------------------------------------------------------
        const world = new CANNON.World();
        world.gravity.set(0, 0, 0); // Set gravity to zero since PONG doesn't have gravity

        // Add the ball and materials to the world
        world.addBody(ball.body);
        world.addContactMaterial(ball.bodyContactMaterial.bounce(wallBodyMaterial));

        // Add the walls to the world
        world.addBody(wallTop.body);

        world.addBody(wallRight.body);
        // wallRight.body.addEventListener("collide", ball.bodyListener.goal);

        world.addBody(wallBottom.body);

        world.addBody(wallLeft.body);
        // wallLeft.body.addEventListener("collide", ball.bodyListener.goal);

        // Rendering
        // -------------------------------------------------------------------------------------------------------------
        engine.beforeRender$.subscribe(it => {
            // Step the physics world forward in time
            world.step(1 / 60);  // Use an appropriate time step value
        });

        // Debug
        // -------------------------------------------------------------------------------------------------------------
        if (this.debug) {
            // Field
            // ---------------------------------------------------------------------------------------------------------
            scene.add(new THREE.GridHelper(this.config.field.size, 10));

            // Physics
            // ---------------------------------------------------------------------------------------------------------
            const worldDebugger = CannonDebugger(scene, world);

            // Rendering
            // ---------------------------------------------------------------------------------------------------------
            engine.beforeRender$.subscribe(it => {
                worldDebugger.update();
            });
        }

        // Controls
        // -------------------------------------------------------------------------------------------------------------
        ball.actions.reset();
    }
}
