import {Component, Input, OnInit} from '@angular/core';
import {
    AdditiveBlending,
    AmbientLight,
    AxesHelper,
    BasicShadowMap,
    BoxGeometry,
    BufferGeometry,
    CameraHelper,
    Color,
    DirectionalLight,
    DirectionalLightHelper,
    DoubleSide,
    Euler,
    FileLoader,
    Fog,
    GridHelper,
    Group,
    InstancedMesh,
    LinearMipMapLinearFilter,
    LinearToneMapping,
    Material,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    MultiplyBlending,
    NoBlending,
    NormalBlending,
    Object3D,
    PCFShadowMap,
    PCFSoftShadowMap,
    PerspectiveCamera,
    PlaneGeometry, PointLight, PointLightHelper,
    Quaternion,
    RepeatWrapping, RGBAFormat,
    ShaderMaterial,
    ShadowMapType,
    SubtractiveBlending,
    Texture,
    TextureLoader,
    Vector2,
    Vector3,
    VSMShadowMap
} from "three";
import {Sky} from "three/examples/jsm/objects/Sky";
import {
    JnThSceneProps
} from "../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";
import {ActivatedRoute} from "@angular/router";
import {from, of, take, zip} from "rxjs";
import {RenderState} from "ngx-three";
import {HttpClient} from "@angular/common/http";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import MeshPhysicalNodeMaterial from "three/examples/jsm/nodes/materials/MeshPhysicalNodeMaterial";
import {color} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {instance} from "three/examples/jsm/nodes/shadernode/ShaderNodeElements";
import {Lensflare, LensflareElement} from "three/examples/jsm/objects/Lensflare";

@Component({
    templateUrl: './jn-streaming-scene-game-loz-tok.component.html',
    styleUrls: ['./jn-streaming-scene-game-loz-tok.component.sass']
})
export class JnStreamingSceneGameLozTok implements OnInit {

    @Input()
    debug: boolean = false

    @Input()
    vr: boolean = false

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(take(1)).subscribe(it => {
            this.debug = it["debug"] === 'true'
            this.vr = it["vr"] === 'true'
        });
    }

    onInitBackground({engine, scene}: JnThSceneProps): void {
        const surface = {
            instance: Mesh.prototype as Mesh<PlaneGeometry, Material>,
            parameters: {
                scalar: 1024,
                scalarMultiplier: 2,
                subdivision: 1024 / 2,
                displacementScaleMultiplier: 0.05
            },
            assets: {
                maps: {
                    heightmap: {
                        instance: Texture.prototype,
                        url: `${window.location.pathname}/assets/maps/surface/surface.heightmap.png`,
                    }
                }
            },
            onLoad: () => {
                return zip(
                    from(
                        new TextureLoader().loadAsync(surface.assets.maps.heightmap.url).then(it => {
                            // Configuration
                            // -----------------------------------------------------------------------------------------
                            it.wrapS = it.wrapT = RepeatWrapping;

                            it.center.set(0.5, 0.5);
                            it.repeat.set(0.7, 0.7);

                            // Finalization
                            // -----------------------------------------------------------------------------------------
                            surface.assets.maps.heightmap.instance = it;
                        })
                    )
                )
            },
            onInit: () => {
                // Initialization
                // -----------------------------------------------------------------------------------------------------
                surface.instance = new Mesh(
                    new PlaneGeometry(
                        surface.parameters.scalar * surface.parameters.scalarMultiplier,
                        surface.parameters.scalar * surface.parameters.scalarMultiplier,
                        surface.parameters.subdivision,
                        surface.parameters.subdivision
                    ),
                    new MeshPhongMaterial({
                        // wireframe: true,
                        // color: "#373737",
                        color: "#867562",
                        map: surface.assets.maps.heightmap.instance,
                        displacementMap: surface.assets.maps.heightmap.instance,
                        displacementScale: surface.parameters.scalar * surface.parameters.scalarMultiplier * surface.parameters.displacementScaleMultiplier,
                        specular: 0,
                        shininess: 0
                    })
                );

                surface.instance.rotation.x = -Math.PI / 2;

                surface.instance.castShadow= true;
                surface.instance.receiveShadow = true;

                // Rendering
                // -----------------------------------------------------------------------------------------------------
                scene.add(surface.instance);

                if (this.debug) {
                    // scene.add(new GridHelper(surface.parameters.scalar, 64, 0xffffff, 0xffffff))
                }

                // Finalization
                // -----------------------------------------------------------------------------------------------------
                surface.isInitialized = true;
            },
            onRender: ({}: RenderState) => {
                // Checking
                // -----------------------------------------------------------------------------------------------------
                if (!surface.isInitialized) {
                    return;
                }
            },
            isInitialized: false
        };
        const camera = {
            instance: PerspectiveCamera.prototype,
            parameters: {
                scalar: surface.parameters.scalar / 4,
                farMultiplier: 6.5,
                fov: 40,
                position: () => new Vector3(
                    -surface.parameters.scalar * 0.8,
                    surface.parameters.scalar * 0.6,
                    -surface.parameters.scalar * 0.4,
                ),
                lookAt: () => new Vector3(
                    surface.parameters.scalar * 0.2,
                    camera.instance.position.y * 0.8,
                    -surface.parameters.scalar * 0.15,
                ),
                fog: {
                    visible: true,
                    // color: new Color("#d9e4e0"),
                    color: new Color("#e0efef"),
                    nearMultiplier: 0.5,
                    farMultiplier: 1
                }
            },
            debug: {
                instance: PerspectiveCamera.prototype,
                controls: OrbitControls.prototype,
                parameters: {
                    farMultiplier: 8,
                }
            },
            onInit: () => {
                // Initialization
                // -----------------------------------------------------------------------------------------------------
                camera.instance = new PerspectiveCamera();
                camera.instance.fov = camera.parameters.fov;
                camera.instance.far = camera.parameters.scalar  * camera.parameters.farMultiplier;

                if (this.debug) {
                    camera.debug.instance = new PerspectiveCamera();
                    camera.debug.instance.far = surface.parameters.scalar * camera.debug.parameters.farMultiplier;

                    camera.debug.controls = new OrbitControls(camera.debug.instance, engine.renderer?.domElement);
                    scene.add(new AxesHelper(camera.parameters.scalar));
                }

                // Configuration
                // -----------------------------------------------------------------------------------------------------
                if(camera.parameters.fog.visible && !this.debug) {
                    scene.fog = new Fog(
                        camera.parameters.fog.color,
                        camera.instance.far * camera.parameters.fog.nearMultiplier,
                        camera.instance.far * camera.parameters.fog.farMultiplier,
                    );
                }
                camera.instance.position.copy(camera.parameters.position())
                camera.instance.lookAt(camera.parameters.lookAt());

                // Rendering
                // -----------------------------------------------------------------------------------------------------
                if (this.debug) {
                    scene.add(camera.debug.instance);
                }

                scene.add(camera.instance);

                if(this.debug) {
                    scene.add(new CameraHelper(camera.instance));
                }

                // Finalization
                // -----------------------------------------------------------------------------------------------------
                camera.isInitialized = true;
            },
            onRender: ({}: RenderState) => {
                // Checking
                // -----------------------------------------------------------------------------------------------------
                if (!camera.isInitialized) {
                    return;
                }
            },
            isInitialized: false
        };
        const sky = {
            instance: Group.prototype,
            parameters: {
                scalar: surface.parameters.scalar,
                radiusMultiplier: 1.2
            },
            children: {
                background: {
                    instance: Mesh.prototype as Sky,
                    parameters: {
                        turbidity: 0.1,
                        rayleigh: 1,
                        mieCoefficient: 0.001,
                        mieDirectionalG: 0.97,
                        exposure: 0.5,
                    }
                },
                ambient: {
                    instance: AmbientLight.prototype,
                    parameters: {
                        intensity: 1,
                    }
                },
                sun: {
                    instance: DirectionalLight.prototype,
                    parameters: {
                        intensity: 2,
                        elevation: 24,
                        azimuth: 90 + 15
                    }
                },
                lensflare: {
                    instance: PointLight.prototype,
                    assets: {
                        maps: [
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare0.png',
                                size: window.innerWidth * 0.9,
                                distance: 0,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 60,
                                distance: -0.14,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 90,
                                distance: -0.12,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 40,
                                distance: -0.10,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 80,
                                distance: +0.15,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 200,
                                distance: +0.18,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 70,
                                distance: +0.20,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 120,
                                distance: +0.25,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 40,
                                distance: +0.27,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 70,
                                distance: +0.32,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                            {
                                instance: Texture.prototype,
                                url: 'https://threejs.org/examples/textures/lensflare/lensflare3.png',
                                size: 150,
                                distance: +0.34,
                                color: new Color("#f9f4da"),
                                visible: true
                            },
                        ]
                    }
                },
                cloud: {
                    instance: Mesh.prototype as InstancedMesh<BufferGeometry, ShaderMaterial>,
                    parameters: {
                        heaps: {
                            count: 20,
                            size: 1
                        },
                        spawn: {
                            position: {
                                depth: 20,
                                offset: surface.parameters.scalar * 0.1,
                            },
                            size: {
                                scalar: surface.parameters.scalar * 0.4,
                                offset: surface.parameters.scalar * 0.1,
                            }
                        },
                        animate: {
                            speed: new Vector3(
                                // surface.parameters.scalar * 0.00001,
                                0,
                                0,
                                surface.parameters.scalar * 0.0002
                            )
                        }
                    },
                    assets: {
                        map: {
                            instance: Texture.prototype,
                            url: `${window.location.pathname}/assets/maps/sky/cloud/sky-cloud.png`,
                        },
                        shader: {
                            vertex: {
                                instance: ``,
                                url: `${window.location.pathname}/assets/shaders/sky/cloud/sky-cloud.vertex.glsl`
                            },
                            fragment: {
                                instance: ``,
                                url: `${window.location.pathname}/assets/shaders/sky/cloud/sky-cloud.fragment.glsl`
                            },
                        }
                    },
                    actions: {
                        spawn: (size: number, indexOffset: number = 0, spawnPointOffset: Vector3 = new Vector3()) => {
                            const spawnPoint = new Vector3(
                                MathUtils.randInt(
                                    spawnPointOffset.x - surface.parameters.scalar * 0.4,
                                    spawnPointOffset.x + surface.parameters.scalar * 0.5,

                                ),
                                MathUtils.randInt(
                                    0,
                                    spawnPointOffset.y + surface.parameters.scalar * 0.8,
                                ),
                                MathUtils.randInt(
                                    spawnPointOffset.z - surface.parameters.scalar * 2,
                                    spawnPointOffset.z + surface.parameters.scalar,
                                ),
                            );
                            const object = new Object3D();

                            for(let index = 0; index < size; index++) {
                                sky.children.cloud.instance.getMatrixAt(index + indexOffset, object.matrix);

                                object.position.copy(spawnPoint);

                                object.position.add(new Vector3(
                                    MathUtils.randInt(
                                        -sky.children.cloud.parameters.spawn.position.offset,
                                        +sky.children.cloud.parameters.spawn.position.offset
                                    ),
                                    MathUtils.randInt(
                                        -sky.children.cloud.parameters.spawn.position.offset,
                                        +sky.children.cloud.parameters.spawn.position.offset
                                    ),
                                    +sky.children.cloud.parameters.spawn.position.depth * index,
                                ));

                                object.rotateY(MathUtils.degToRad(90));
                                object.rotateZ(
                                    MathUtils.degToRad(
                                        MathUtils.randFloat(0, 360)
                                    )
                                );

                                object.scale.setX(
                                    // sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
                                    MathUtils.randInt(
                                        sky.children.cloud.parameters.spawn.size.scalar,
                                        sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
                                    )
                                );
                                object.scale.setY(
                                    // sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
                                    MathUtils.randInt(
                                        sky.children.cloud.parameters.spawn.size.scalar,
                                        sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
                                    )
                                );

                                object.updateMatrix();

                                sky.children.cloud.instance.setMatrixAt(index + indexOffset, object.matrix);
                            }

                            sky.children.cloud.instance.userData["spawnPoint"] = spawnPoint;
                        },
                        animate: (size: number, indexOffset: number = 0) => {
                            let object = new Object3D();
                            let eye = new Object3D();

                            for(let index = 0; index < size; index++) {
                                sky.children.cloud.instance.getMatrixAt(index + indexOffset, object.matrix);

                                object.position.setFromMatrixPosition(object.matrix);
                                object.rotation.setFromRotationMatrix(object.matrix);
                                object.scale.setFromMatrixScale(object.matrix);

                                object.position.x += sky.children.cloud.parameters.animate.speed.x * MathUtils.randInt(-1, 1);
                                object.position.y += sky.children.cloud.parameters.animate.speed.y;
                                object.position.z += sky.children.cloud.parameters.animate.speed.z;

                                eye.position.copy(object.position);
                                eye.lookAt(camera.instance.position);

                                // object.rotation.y = eye.rotation.y;
                                // object.rotation.copy(eye.rotation);

                                object.updateMatrix();

                                sky.children.cloud.instance.setMatrixAt(index + indexOffset, object.matrix);
                            }

                            if(object.position.z > surface.parameters.scalar * 1.2) {
                                sky.children.cloud.actions.spawn(
                                    size,
                                    indexOffset,
                                    new Vector3(
                                        0,
                                        0,
                                        -surface.parameters.scalar * 2
                                    )
                                );
                            }
                        },
                    }
                }
            },
            onLoad: () => {
                return zip(
                    from(
                        new TextureLoader().loadAsync(sky.children.lensflare.assets.maps[0].url).then(it => {
                            // Finalization
                            // ---------------------------------------------------------------------------------------------
                            sky.children.lensflare.assets.maps[0].instance = it;
                        })
                    ),
                    from(
                        new TextureLoader().loadAsync(sky.children.lensflare.assets.maps[1].url).then(it => {
                            // Finalization
                            // ---------------------------------------------------------------------------------------------
                            for(let index = 1; index < sky.children.lensflare.assets.maps.length; index++){
                                sky.children.lensflare.assets.maps[index].instance = it;
                            }
                        })
                    ),
                    from(
                        new TextureLoader().loadAsync(sky.children.cloud.assets.map.url).then(it => {
                            // Configuration
                            // ---------------------------------------------------------------------------------------------
                            it.minFilter = LinearMipMapLinearFilter;
                            it.magFilter = LinearMipMapLinearFilter;

                            // Finalization
                            // ---------------------------------------------------------------------------------------------
                            sky.children.cloud.assets.map.instance = it;
                        })
                    ),
                    from(
                        new FileLoader().loadAsync(sky.children.cloud.assets.shader.vertex.url).then(it => {
                            // Finalization
                            // ---------------------------------------------------------------------------------------------
                            sky.children.cloud.assets.shader.vertex.instance = it as string;
                        })
                    ),
                    from(
                        new FileLoader().loadAsync(sky.children.cloud.assets.shader.fragment.url).then(it => {
                            // Finalization
                            // ---------------------------------------------------------------------------------------------
                            sky.children.cloud.assets.shader.fragment.instance = it as string;
                        })
                    )
                )
            },
            onInit: () => {
                // Initialization
                // -----------------------------------------------------------------------------------------------------
                sky.instance = new Group();

                // Background
                // -----------------------------------------------------------------------------------------------------
                sky.children.background.instance = new Sky();

                sky.children.background.instance.scale.setScalar(
                    sky.parameters.scalar * 100000
                );
                sky.children.background.instance.position.y =
                    sky.children.background.instance.scale.y * 0.49;


                // Ambient
                // -----------------------------------------------------------------------------------------------------
                sky.children.ambient.instance = new AmbientLight();
                sky.children.ambient.instance.intensity = sky.children.ambient.parameters.intensity;

                // Sun
                // -----------------------------------------------------------------------------------------------------
                sky.children.sun.instance = new DirectionalLight();
                sky.children.sun.instance.intensity = sky.children.sun.parameters.intensity;

                sky.children.sun.instance.position.setFromSphericalCoords(
                    sky.parameters.scalar * sky.parameters.radiusMultiplier,
                    MathUtils.degToRad(90 - sky.children.sun.parameters.elevation),
                    MathUtils.degToRad(sky.children.sun.parameters.azimuth)
                );
                sky.children.sun.instance.lookAt(new Vector3());

                if(this.debug) {
                    sky.children.sun.instance.userData["sunSpeed"] = 0.01;
                }
                else {
                    sky.children.sun.instance.userData["sunSpeed"] = 0.0001;
                }
                sky.children.sun.instance.userData["sunElevationDirection"] = 1;

                sky.children.sun.instance.castShadow = true;
                // sky.children.sun.instance.shadow.bias = -0.001;
                //
                sky.children.sun.instance.shadow.mapSize.width =
                    sky.children.sun.instance.shadow.mapSize.height = 1024;

                // sky.children.sun.instance.shadow.camera.top =
                //     0.2 * sky.parameters.scalar * -1;
                sky.children.sun.instance.shadow.camera.bottom =
                    -surface.parameters.scalar * 0.4
                sky.children.sun.instance.shadow.camera.left =
                    +surface.parameters.scalar * 0.62
                sky.children.sun.instance.shadow.camera.right =
                    -surface.parameters.scalar * 0.7

                sky.children.sun.instance.shadow.camera.near =
                    +surface.parameters.scalar * 0.2;
                sky.children.sun.instance.shadow.camera.far =
                    +surface.parameters.scalar * 1.1

                // Lensflare
                // -----------------------------------------------------------------------------------------------------
                let lensflare = new Lensflare();
                for(let index = 0; index < sky.children.lensflare.assets.maps.length; index++)
                {
                    if (sky.children.lensflare.assets.maps[index].visible) {
                        lensflare.addElement(
                            new LensflareElement(
                                sky.children.lensflare.assets.maps[index].instance,
                                sky.children.lensflare.assets.maps[index].size,
                                sky.children.lensflare.assets.maps[index].distance,
                                sky.children.lensflare.assets.maps[index].color,
                            )
                        );
                    }
                }
                sky.children.lensflare.instance = new PointLight();
                sky.children.lensflare.instance.add(lensflare);
                sky.children.lensflare.instance.position
                    .setX(-surface.parameters.scalar * 0.72)
                    .setY(+surface.parameters.scalar * 0.4)
                    .setZ(-surface.parameters.scalar * 1.5);

                if(this.debug) {
                    scene.add(new PointLightHelper(sky.children.lensflare.instance, 100));
                }

                // Cloud
                // -----------------------------------------------------------------------------------------------------
                sky.children.cloud.instance = new InstancedMesh(
                    new PlaneGeometry(1, 1),
                    new ShaderMaterial({
                        transparent: true,
                        depthWrite: false,
                        depthTest: true,
                        // blending: AdditiveBlending,
                        uniforms: {
                            map: {
                                value: sky.children.cloud.assets.map.instance
                            },
                            fogColor: {
                                value: camera.parameters.fog.color,
                            },
                            fogNear: {
                                value: sky.parameters.scalar * camera.parameters.fog.nearMultiplier,
                            },
                            fogFar: {
                                value: sky.parameters.scalar * camera.parameters.fog.farMultiplier,
                            }
                        },
                        vertexShader: sky.children.cloud.assets.shader.vertex.instance,
                        fragmentShader: sky.children.cloud.assets.shader.fragment.instance
                    }),
                    sky.children.cloud.parameters.heaps.count * sky.children.cloud.parameters.heaps.size
                );

                sky.children.cloud.instance.material.side = DoubleSide;

                for(let cloudHeapIndex = 0; cloudHeapIndex < sky.children.cloud.parameters.heaps.count; cloudHeapIndex++) {
                    sky.children.cloud.actions.spawn(
                        sky.children.cloud.parameters.heaps.size,
                        sky.children.cloud.parameters.heaps.size * cloudHeapIndex,
                    );
                }

                // Rendering
                // -----------------------------------------------------------------------------------------------------
                sky.instance.add(sky.children.ambient.instance);
                sky.instance.add(sky.children.sun.instance);
                camera.instance.add(sky.children.lensflare.instance);

                sky.instance.add(sky.children.background.instance);
                sky.instance.add(sky.children.cloud.instance);

                scene.add(sky.instance);

                if(this.debug) {
                    scene.add( new DirectionalLightHelper(sky.children.sun.instance, sky.parameters.scalar * 0.05) );
                    scene.add( new CameraHelper(sky.children.sun.instance.shadow.camera))
                }

                // Finalization
                // -----------------------------------------------------------------------------------------------------
                sky.isInitialized = true
            },
            onRender: ({}: RenderState) => {
                // Checking
                // -----------------------------------------------------------------------------------------------------
                if (!sky.isInitialized) {
                    return;
                }

                // Sun
                // -----------------------------------------------------------------------------------------------------
                sky.children.sun.instance.position.setFromSphericalCoords(
                    sky.parameters.scalar * sky.parameters.radiusMultiplier,
                    MathUtils.degToRad(90 - sky.children.sun.parameters.elevation),
                    MathUtils.degToRad(sky.children.sun.parameters.azimuth)
                );
                sky.children.sun.instance.lookAt(new Vector3());

                if(this.debug) {
                    if (sky.children.sun.parameters.elevation >= 45 || sky.children.sun.parameters.elevation <= -1) {
                        sky.children.sun.instance.userData["sunElevationDirection"] *= -1;
                    }
                }
                // sky.children.sun.parameters.elevation += sky.children.sun.instance.userData["sunSpeed"] * sky.children.sun.instance.userData["sunElevationDirection"];
                // sky.children.sun.parameters.azimuth -= sky.children.sun.instance.userData["sunSpeed"];

                // Background
                // -----------------------------------------------------------------------------------------------------
                sky.children.background.instance.material.uniforms['turbidity'].value = sky.children.background.parameters.turbidity;
                sky.children.background.instance.material.uniforms['rayleigh'].value = sky.children.background.parameters.rayleigh;
                sky.children.background.instance.material.uniforms['mieCoefficient'].value = sky.children.background.parameters.mieCoefficient;
                sky.children.background.instance.material.uniforms['mieDirectionalG'].value = sky.children.background.parameters.mieDirectionalG;
                sky.children.background.instance.material.uniforms['sunPosition'].value.copy(
                    sky.children.sun.instance.position
                );

                // Cloud
                // -----------------------------------------------------------------------------------------------------
                for(let cloudHeapIndex = 0; cloudHeapIndex < sky.children.cloud.parameters.heaps.count; cloudHeapIndex++) {
                    sky.children.cloud.actions.animate(
                        sky.children.cloud.parameters.heaps.size,
                        sky.children.cloud.parameters.heaps.size * cloudHeapIndex,
                    )
                    sky.children.cloud.instance.instanceMatrix.needsUpdate = true;
                }
            },
            isInitialized: false
        };
        const hud = {
            instance: Group.prototype,
            children: {
                logo: {
                    instance: Mesh.prototype as Mesh<PlaneGeometry, Material>,
                    parameters: {
                        resolution: 16,
                        resolutionMultiplier: 5
                    },
                    assets: {
                        maps: {
                            shadow: {
                                instance: Texture.prototype,
                                url: `${window.location.pathname}/assets/maps/logo/shadow/logo-shadow.diffuse.webp`
                            }
                        }
                    },
                }
            },
            onLoad: () => {
                return zip(
                    from(
                        new TextureLoader().loadAsync(hud.children.logo.assets.maps.shadow.url).then(it => {
                            // Configuration
                            // -----------------------------------------------------------------------------------------

                            // Finalization
                            // -----------------------------------------------------------------------------------------
                            hud.children.logo.assets.maps.shadow.instance = it;
                        })
                    )
                )
            },
            onInit: () => {
                // Initialization
                // -----------------------------------------------------------------------------------------------------
                hud.instance = new Group();

                // hud.instance.rotation.y = MathUtils.degToRad(-90);
                // hud.instance.position.copy(camera.instance.position);
                hud.instance.position.z -= 100;

                // Logo
                // -----------------------------------------------------------------------------------------------------
                hud.children.logo.instance = new Mesh(
                    new PlaneGeometry(
                        1,
                        1
                    ),
                    new MeshBasicMaterial({
                        map: hud.children.logo.assets.maps.shadow.instance,
                        transparent: true,
                        depthWrite: true,
                        depthTest: true,
                        toneMapped: false
                    })
                );
                hud.children.logo.instance.scale
                    .setX(hud.children.logo.parameters.resolution * hud.children.logo.parameters.resolutionMultiplier)
                    .setY(hud.children.logo.parameters.resolution * hud.children.logo.parameters.resolutionMultiplier * (
                        hud.children.logo.assets.maps.shadow.instance.image.height /
                        hud.children.logo.assets.maps.shadow.instance.image.width
                    ));
                hud.children.logo.instance.position
                    .setX(hud.children.logo.instance.scale.x * 0.3);



                // Rendering
                // -----------------------------------------------------------------------------------------------------
                hud.instance.add(hud.children.logo.instance);
                camera.instance.add(hud.instance);

                // Finalization
                // -----------------------------------------------------------------------------------------------------
                hud.isInitialized = true;
            },
            onRender: ({}: RenderState) => {
                // Checking
                // -----------------------------------------------------------------------------------------------------
                if (!hud.isInitialized) {
                    return;
                }
            },
            isInitialized: false
        };

        // Configuration
        // -------------------------------------------------------------------------------------------------------------
        camera.onInit();

        if (engine.renderer) {
            engine.renderer.shadowMap.enabled = true;
            engine.renderer.shadowMap.type = PCFSoftShadowMap;

            engine.renderer.toneMapping = LinearToneMapping;
            engine.renderer.toneMappingExposure = sky.children.background.parameters.exposure;
        }

        // Loading
        // -------------------------------------------------------------------------------------------------------------
        zip(
            surface.onLoad(),
            sky.onLoad(),
            hud.onLoad()
        ).subscribe(it => {
            // Initialization
            // ---------------------------------------------------------------------------------------------------------
            surface.onInit();
            sky.onInit();
            hud.onInit();

            // Configuration
            // ---------------------------------------------------------------------------------------------------------



            if (this.debug) {
                camera.debug.instance.position.set(
                    surface.parameters.scalar * 1.5 * -1,
                    surface.parameters.scalar * 0.5,
                    surface.parameters.scalar * 1.5
                );
                camera.debug.instance.position.set(
                    0,
                    surface.parameters.scalar * 2.5,
                    0
                );
                camera.debug.controls.target = new Vector3();
                // camera.debug.controls.target = new Vector3(
                //     0,
                //     camera.instance.position.y,
                //     0
                // );
                // camera.debug.controls.target = hud.children.lensflare.instance.position;
                // camera.debug.controls.target = camera.instance.position;

                let unit = new Mesh(
                    new BoxGeometry(),
                    new MeshStandardMaterial({
                        color: new Color(255, 255, 255)
                    })
                );
                unit.castShadow = true;
                unit.receiveShadow = true;
                unit.scale.y = sky.parameters.scalar;
                unit.position.y = sky.parameters.scalar / 2;
                scene.add(unit);

                return;
            }

            scene.rotation.z += MathUtils.degToRad(18);
            scene.rotation.x += MathUtils.degToRad(-5);
        });

        // Subscriptions
        // -------------------------------------------------------------------------------------------------------------
        engine.beforeRender$.subscribe(it => {
            camera.onRender(it);
            surface.onRender(it);
            sky.onRender(it);
            hud.onRender(it)
        });
        engine.renderer?.setAnimationLoop(it => {
            if(this.debug) {
                camera.debug.controls.update();
            }
        });
    }

    // onInitBackground({engine, scene}: JnThSceneProps): void {
    //     const surface = {
    //         instance: Mesh.prototype as Mesh<PlaneGeometry, Material>,
    //         parameters: {
    //             scalar: 1024,
    //             scalarMultiplier: 2,
    //             subdivision: 1024,
    //             displacementScaleMultiplier: 0.1
    //         },
    //         assets: {
    //             maps: {
    //                 heightmap: {
    //                     instance: Texture.prototype,
    //                     url: `${window.location.pathname}/assets/maps/surface/surface.heightmap.png`,
    //                 }
    //             }
    //         },
    //         onLoad: () => {
    //             return zip(
    //                 from(
    //                     new TextureLoader().loadAsync(surface.assets.maps.heightmap.url).then(it => {
    //                         // Configuration
    //                         // -----------------------------------------------------------------------------------------
    //                         it.wrapS = it.wrapT = RepeatWrapping;
    //
    //                         it.center.set(0.5, 0.5);
    //                         it.repeat.set(0.7, 0.7);
    //
    //                         // Finalization
    //                         // -----------------------------------------------------------------------------------------
    //                         surface.assets.maps.heightmap.instance = it;
    //                     })
    //                 )
    //             )
    //         },
    //         onInit: () => {
    //             // Initialization
    //             // -----------------------------------------------------------------------------------------------------
    //             surface.instance = new Mesh(
    //                 new PlaneGeometry(
    //                     surface.parameters.scalar * surface.parameters.scalarMultiplier,
    //                     surface.parameters.scalar * surface.parameters.scalarMultiplier,
    //                     surface.parameters.subdivision,
    //                     surface.parameters.subdivision
    //                 ),
    //                 new MeshPhongMaterial({
    //                     // wireframe: true,
    //                     // color: "#373737",
    //                     color: "#867562",
    //                     map: surface.assets.maps.heightmap.instance,
    //                     displacementMap: surface.assets.maps.heightmap.instance,
    //                     displacementScale: surface.parameters.scalar * surface.parameters.scalarMultiplier * surface.parameters.displacementScaleMultiplier,
    //                     specular: 0,
    //                     shininess: 0
    //                 })
    //             );
    //
    //             // Configuration
    //             // -----------------------------------------------------------------------------------------------------
    //             surface.instance.rotation.x = -Math.PI / 2;
    //
    //             surface.instance.castShadow= true;
    //             surface.instance.receiveShadow = true;
    //
    //             // Rendering
    //             // -----------------------------------------------------------------------------------------------------
    //             scene.add(surface.instance);
    //
    //             if (this.debug) {
    //                 // scene.add(new GridHelper(surface.parameters.scalar, 64, 0xffffff, 0xffffff))
    //             }
    //
    //             // Finalization
    //             // -----------------------------------------------------------------------------------------------------
    //             camera.isInitialized = true;
    //         },
    //         onRender: ({}: RenderState) => {
    //             // Checking
    //             // -----------------------------------------------------------------------------------------------------
    //             if (!camera.isInitialized) {
    //                 return;
    //             }
    //         },
    //         isInitialized: false
    //     };
    //     const camera = {
    //         instance: PerspectiveCamera.prototype,
    //         parameters: {
    //             scalar: surface.parameters.scalar / 4,
    //             farMultiplier: 6.5,
    //             position: () => new Vector3(
    //                 -surface.parameters.scalar * 0.8,
    //                 surface.parameters.scalar * 0.5,
    //                 -surface.parameters.scalar * 0.4,
    //             ),
    //             lookAt: () => new Vector3(
    //                 surface.parameters.scalar * 0.2,
    //                 camera.instance.position.y * 0.8,
    //                 0,
    //             ),
    //             fog: {
    //                 visible: true,
    //                 color: new Color("#b3b3b3"),
    //                 nearMultiplier: 0.5,
    //                 farMultiplier: 1
    //             }
    //         },
    //         debug: {
    //             instance: PerspectiveCamera.prototype,
    //             controls: OrbitControls.prototype,
    //             parameters: {
    //                 farMultiplier: 8,
    //             }
    //         },
    //         onInit: () => {
    //             // Initialization
    //             // -----------------------------------------------------------------------------------------------------
    //             camera.instance = new PerspectiveCamera();
    //             camera.instance.far = camera.parameters.scalar  * camera.parameters.farMultiplier;
    //
    //             if (this.debug) {
    //                 camera.debug.instance = new PerspectiveCamera();
    //                 camera.debug.instance.far = surface.parameters.scalar * camera.debug.parameters.farMultiplier;
    //
    //                 camera.debug.controls = new OrbitControls(camera.debug.instance, engine.renderer?.domElement);
    //                 scene.add(new AxesHelper(camera.parameters.scalar));
    //             }
    //
    //             // Configuration
    //             // -----------------------------------------------------------------------------------------------------
    //             if(camera.parameters.fog.visible && !this.debug) {
    //                 scene.fog = new Fog(
    //                     camera.parameters.fog.color,
    //                     camera.instance.far * camera.parameters.fog.nearMultiplier,
    //                     camera.instance.far * camera.parameters.fog.farMultiplier,
    //                 );
    //             }
    //
    //             // Rendering
    //             // -----------------------------------------------------------------------------------------------------
    //             if (this.debug) {
    //                 scene.add(camera.debug.instance);
    //             }
    //
    //             scene.add(camera.instance);
    //
    //             if(this.debug) {
    //                 scene.add(new CameraHelper(camera.instance));
    //             }
    //
    //             // Finalization
    //             // -----------------------------------------------------------------------------------------------------
    //             camera.isInitialized = true;
    //         },
    //         onRender: ({}: RenderState) => {
    //             // Checking
    //             // -----------------------------------------------------------------------------------------------------
    //             if (!camera.isInitialized) {
    //                 return;
    //             }
    //         },
    //         isInitialized: false
    //     };
    //     const sky = {
    //         instance: Group.prototype,
    //         parameters: {
    //             scalar: camera.parameters.scalar / 2,
    //             radiusMultiplier: 1.2
    //         },
    //         children: {
    //             background: {
    //                 instance: Mesh.prototype as Sky,
    //                 parameters: {
    //                     turbidity: 0.4,
    //                     rayleigh: 1,
    //                     mieCoefficient: 0.006,
    //                     mieDirectionalG: 0.8,
    //                     exposure: 0.4,
    //                 }
    //             },
    //             ambient: {
    //                 instance: AmbientLight.prototype,
    //                 parameters: {
    //                     intensity: 1,
    //                 }
    //             },
    //             sun: {
    //                 instance: DirectionalLight.prototype,
    //                 parameters: {
    //                     intensity: 2,
    //                     elevation: 30,
    //                     azimuth: 15
    //                 }
    //             },
    //             cloud: {
    //                 instance: Mesh.prototype as InstancedMesh<BufferGeometry, ShaderMaterial>,
    //                 parameters: {
    //                     heaps: {
    //                         count: 10,
    //                         size: 2
    //                     },
    //                     spawn: {
    //                         position: {
    //                             depth: 20,
    //                             offset: 100
    //                         },
    //                         size: {
    //                             scalar: 200,
    //                             offset: 400
    //                         }
    //                     },
    //                     animate: {
    //                         speed: new Vector3(
    //                             0.1,
    //                             0,
    //                             0.01
    //                         )
    //                     }
    //                 },
    //                 assets: {
    //                     map: {
    //                         instance: Texture.prototype,
    //                         url: `${window.location.pathname}/assets/maps/sky/cloud/sky-cloud.png`,
    //                     },
    //                     shader: {
    //                         vertex: {
    //                             instance: ``,
    //                             url: `${window.location.pathname}/assets/shaders/sky/cloud/sky-cloud.vertex.glsl`
    //                         },
    //                         fragment: {
    //                             instance: ``,
    //                             url: `${window.location.pathname}/assets/shaders/sky/cloud/sky-cloud.fragment.glsl`
    //                         },
    //                     }
    //                 },
    //                 actions: {
    //                     spawn: (size: number, indexOffset: number = 0, spawnPointOffset: Vector3 = new Vector3()) => {
    //                         const spawnPoint = new Vector3(
    //                             MathUtils.randInt(
    //                                 -sky.parameters.scalar * 0.5 + spawnPointOffset.x,
    //                                 sky.parameters.scalar * 0.5 + spawnPointOffset.x,
    //                             ),
    //                             MathUtils.randInt(
    //                                 sky.parameters.scalar * 0.1 + spawnPointOffset.y,
    //                                 sky.parameters.scalar * 0.4 + spawnPointOffset.y,
    //                             ),
    //                             MathUtils.randInt(
    //                                 -sky.parameters.scalar * 0.5 + spawnPointOffset.z,
    //                                 spawnPointOffset.y,
    //                             ),
    //                         );
    //                         const object = new Object3D();
    //
    //                         const positionDepth = 20;
    //                         const positionOffset = 100;
    //
    //                         const sizeScalar = 50;
    //                         const sizeOffset = 150;
    //
    //                         for(let index = 0; index < size; index++) {
    //                             sky.children.cloud.instance.getMatrixAt(index + indexOffset, object.matrix);
    //
    //                             object.position.copy(spawnPoint);
    //
    //                             object.position.add(new Vector3(
    //                                 MathUtils.randInt(
    //                                     -sky.children.cloud.parameters.spawn.position.offset,
    //                                     +sky.children.cloud.parameters.spawn.position.offset
    //                                 ),
    //                                 MathUtils.randInt(
    //                                     -sky.children.cloud.parameters.spawn.position.offset,
    //                                     +sky.children.cloud.parameters.spawn.position.offset
    //                                 ),
    //                                 +sky.children.cloud.parameters.spawn.position.depth * index,
    //                             ));
    //
    //                             object.rotateZ(
    //                                 MathUtils.degToRad(
    //                                     MathUtils.randFloat(0, 360)
    //                                 )
    //                             );
    //
    //                             object.scale.setX(
    //                                 sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
    //                                 // MathUtils.randInt(
    //                                 //     sky.children.cloud.parameters.spawn.size.scalar,
    //                                 //     sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
    //                                 // )
    //                             );
    //                             object.scale.setY(
    //                                 sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
    //                                 // MathUtils.randInt(
    //                                 //     sky.children.cloud.parameters.spawn.size.scalar,
    //                                 //     sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
    //                                 // )
    //                             );
    //
    //                             object.updateMatrix();
    //
    //                             sky.children.cloud.instance.setMatrixAt(index + indexOffset, object.matrix);
    //                         }
    //
    //                         sky.children.cloud.instance.userData["spawnPoint"] = spawnPoint;
    //                     },
    //                     animate: (size: number, indexOffset: number = 0) => {
    //                         let object = new Object3D();
    //                         let eye = new Object3D();
    //
    //                         for(let index = 0; index < size; index++) {
    //                             sky.children.cloud.instance.getMatrixAt(index + indexOffset, object.matrix);
    //
    //                             object.position.setFromMatrixPosition(object.matrix);
    //                             object.rotation.setFromRotationMatrix(object.matrix);
    //                             object.scale.setFromMatrixScale(object.matrix);
    //
    //                             object.position.x += sky.children.cloud.parameters.animate.speed.x;
    //                             object.position.y += sky.children.cloud.parameters.animate.speed.y;
    //                             object.position.z += sky.children.cloud.parameters.animate.speed.z * MathUtils.randInt(-1, 1);
    //
    //                             eye.position.copy(object.position);
    //                             eye.lookAt(camera.instance.position);
    //
    //                             object.rotation.y = eye.rotation.y;
    //
    //                             object.updateMatrix();
    //
    //                             sky.children.cloud.instance.setMatrixAt(index + indexOffset, object.matrix);
    //                         }
    //
    //                         if(object.position.x > sky.parameters.scalar / 2) {
    //                             sky.children.cloud.actions.spawn(
    //                                 size,
    //                                 indexOffset,
    //                                 new Vector3(
    //                                     -sky.parameters.scalar,
    //                                     0,
    //                                     -sky.parameters.scalar / 2
    //                                 )
    //                             );
    //                         }
    //                     },
    //                 }
    //             }
    //         },
    //         onLoad: () => {
    //             return zip(
    //                 from(
    //                     new TextureLoader().loadAsync(sky.children.cloud.assets.map.url).then(it => {
    //                         // Configuration
    //                         // ---------------------------------------------------------------------------------------------
    //                         it.minFilter = LinearMipMapLinearFilter;
    //                         it.magFilter = LinearMipMapLinearFilter;
    //
    //                         // Finalization
    //                         // ---------------------------------------------------------------------------------------------
    //                         sky.children.cloud.assets.map.instance = it;
    //                     })
    //                 ),
    //                 from(
    //                     new FileLoader().loadAsync(sky.children.cloud.assets.shader.vertex.url).then(it => {
    //                         // Finalization
    //                         // ---------------------------------------------------------------------------------------------
    //                         sky.children.cloud.assets.shader.vertex.instance = it as string;
    //                     })
    //                 ),
    //                 from(
    //                     new FileLoader().loadAsync(sky.children.cloud.assets.shader.fragment.url).then(it => {
    //                         // Finalization
    //                         // ---------------------------------------------------------------------------------------------
    //                         sky.children.cloud.assets.shader.fragment.instance = it as string;
    //                     })
    //                 )
    //             )
    //         },
    //         onInit: () => {
    //             // Initialization
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.instance = new Group();
    //
    //             // Background
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.background.instance = new Sky();
    //
    //             sky.children.background.instance.scale.setScalar(
    //                 sky.parameters.scalar * 2
    //             );
    //
    //             // Ambient
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.ambient.instance = new AmbientLight();
    //             sky.children.ambient.instance.intensity = sky.children.ambient.parameters.intensity;
    //
    //             // Sun
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.sun.instance = new DirectionalLight();
    //             sky.children.sun.instance.intensity = sky.children.sun.parameters.intensity;
    //
    //             sky.children.sun.instance.position.setFromSphericalCoords(
    //                 sky.parameters.scalar * sky.parameters.radiusMultiplier,
    //                 MathUtils.degToRad(90 - sky.children.sun.parameters.elevation),
    //                 MathUtils.degToRad(sky.children.sun.parameters.azimuth)
    //             );
    //             sky.children.sun.instance.lookAt(new Vector3());
    //
    //             if(this.debug) {
    //                 sky.children.sun.instance.userData["sunSpeed"] = 0.01;
    //             }
    //             else {
    //                 sky.children.sun.instance.userData["sunSpeed"] = 0.0001;
    //             }
    //             sky.children.sun.instance.userData["sunElevationDirection"] = 1;
    //
    //             sky.children.sun.instance.castShadow = true;
    //             // sky.children.sun.instance.shadow.bias = -0.001;
    //             //
    //             sky.children.sun.instance.shadow.mapSize.width =
    //                 sky.children.sun.instance.shadow.mapSize.height = 1024;
    //
    //             // sky.children.sun.instance.shadow.camera.top =
    //             //     0.2 * sky.parameters.scalar * -1;
    //             // sky.children.sun.instance.shadow.camera.right =
    //             //     0.5 * sky.parameters.scalar * -1;
    //             // sky.children.sun.instance.shadow.camera.bottom =
    //             //     0.2 * sky.parameters.scalar
    //             // sky.children.sun.instance.shadow.camera.left =
    //             //     0.5 * sky.parameters.scalar;
    //
    //             sky.children.sun.instance.shadow.camera.near =
    //                 0;
    //             sky.children.sun.instance.shadow.camera.far =
    //                 sky.children.sun.instance.position.distanceTo(new Vector3());
    //
    //             // Cloud
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.cloud.instance = new InstancedMesh(
    //                 new PlaneGeometry(1, 1),
    //                 new ShaderMaterial({
    //                     transparent: true,
    //                     depthWrite: false,
    //                     depthTest: false,
    //                     // blending: AdditiveBlending,
    //                     uniforms: {
    //                         map: {
    //                             value: sky.children.cloud.assets.map.instance
    //                         },
    //                         fogColor: {
    //                             value: camera.parameters.fog.color,
    //                         },
    //                         fogNear: {
    //                             value: sky.parameters.scalar * camera.parameters.fog.nearMultiplier,
    //                         },
    //                         fogFar: {
    //                             value: sky.parameters.scalar * camera.parameters.fog.farMultiplier,
    //                         }
    //                     },
    //                     vertexShader: sky.children.cloud.assets.shader.vertex.instance,
    //                     fragmentShader: sky.children.cloud.assets.shader.fragment.instance
    //                 }),
    //                 sky.children.cloud.parameters.heaps.count * sky.children.cloud.parameters.heaps.size
    //             );
    //
    //             sky.children.cloud.instance.material.side = DoubleSide;
    //
    //             for(let cloudHeapIndex = 0; cloudHeapIndex < sky.children.cloud.parameters.heaps.count; cloudHeapIndex++) {
    //                 sky.children.cloud.actions.spawn(
    //                     sky.children.cloud.parameters.heaps.size,
    //                     sky.children.cloud.parameters.heaps.size * cloudHeapIndex,
    //                 );
    //             }
    //
    //             // Rendering
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.instance.add(sky.children.ambient.instance);
    //             sky.instance.add(sky.children.sun.instance);
    //
    //             sky.instance.add(sky.children.background.instance);
    //             // sky.instance.add(sky.children.cloud.instance);
    //
    //             scene.add(sky.instance);
    //
    //             if(this.debug) {
    //                 scene.add( new DirectionalLightHelper(sky.children.sun.instance, sky.parameters.scalar * 0.05) );
    //                 scene.add( new CameraHelper(sky.children.sun.instance.shadow.camera))
    //             }
    //
    //             // Finalization
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.isInitialized = true
    //         },
    //         onRender: ({}: RenderState) => {
    //             // Checking
    //             // -----------------------------------------------------------------------------------------------------
    //             if (!sky.isInitialized) {
    //                 return;
    //             }
    //
    //             // Sun
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.sun.instance.position.setFromSphericalCoords(
    //                 sky.parameters.scalar * sky.parameters.radiusMultiplier,
    //                 MathUtils.degToRad(90 - sky.children.sun.parameters.elevation),
    //                 MathUtils.degToRad(sky.children.sun.parameters.azimuth)
    //             );
    //             sky.children.sun.instance.lookAt(new Vector3());
    //
    //             if(this.debug) {
    //                 if (sky.children.sun.parameters.elevation >= 45 || sky.children.sun.parameters.elevation <= -1) {
    //                     sky.children.sun.instance.userData["sunElevationDirection"] *= -1;
    //                 }
    //             }
    //             // sky.children.sun.parameters.elevation += sky.children.sun.instance.userData["sunSpeed"] * sky.children.sun.instance.userData["sunElevationDirection"];
    //             // sky.children.sun.parameters.azimuth -= sky.children.sun.instance.userData["sunSpeed"];
    //
    //             // Background
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.background.instance.material.uniforms['turbidity'].value = sky.children.background.parameters.turbidity;
    //             sky.children.background.instance.material.uniforms['rayleigh'].value = sky.children.background.parameters.rayleigh;
    //             sky.children.background.instance.material.uniforms['mieCoefficient'].value = sky.children.background.parameters.mieCoefficient;
    //             sky.children.background.instance.material.uniforms['mieDirectionalG'].value = sky.children.background.parameters.mieDirectionalG;
    //             sky.children.background.instance.material.uniforms['sunPosition'].value.copy(
    //                 sky.children.sun.instance.position
    //             );
    //             sky.children.background.instance.position.copy(camera.instance.position);
    //             sky.children.background.instance.position.y = camera.instance.position.y * 0.3;
    //
    //             // Cloud
    //             // -----------------------------------------------------------------------------------------------------
    //             for(let cloudHeapIndex = 0; cloudHeapIndex < sky.children.cloud.parameters.heaps.count; cloudHeapIndex++) {
    //                 sky.children.cloud.actions.animate(
    //                     sky.children.cloud.parameters.heaps.size,
    //                     sky.children.cloud.parameters.heaps.size * cloudHeapIndex,
    //                 )
    //                 sky.children.cloud.instance.instanceMatrix.needsUpdate = true;
    //             }
    //         },
    //         isInitialized: false
    //     };
    //
    //     // Configuration
    //     // -------------------------------------------------------------------------------------------------------------
    //     camera.onInit();
    //
    //     if (engine.renderer) {
    //         engine.renderer.shadowMap.enabled = true;
    //         engine.renderer.shadowMap.type = PCFSoftShadowMap;
    //
    //         engine.renderer.toneMapping = LinearToneMapping;
    //         engine.renderer.toneMappingExposure = sky.children.background.parameters.exposure;
    //     }
    //
    //     // Loading
    //     // -------------------------------------------------------------------------------------------------------------
    //     zip(
    //         surface.onLoad(),
    //         sky.onLoad(),
    //     ).subscribe(it => {
    //         // Initialization
    //         // ---------------------------------------------------------------------------------------------------------
    //         surface.onInit();
    //         sky.onInit();
    //
    //         // Configuration
    //         // ---------------------------------------------------------------------------------------------------------
    //         camera.instance.position.copy(camera.parameters.position())
    //         camera.instance.lookAt(camera.parameters.lookAt());
    //
    //         if (this.debug) {
    //             camera.debug.instance.position.set(
    //                 surface.parameters.scalar * 1.5 * -1,
    //                 surface.parameters.scalar * 0.5,
    //                 surface.parameters.scalar * 1.5
    //             );
    //             camera.debug.controls.target = new Vector3();
    //             camera.debug.controls.target = camera.instance.position;
    //
    //             let unit = new Mesh(
    //                 new BoxGeometry(),
    //                 new MeshStandardMaterial({
    //                     color: new Color(255, 255, 255)
    //                 })
    //             );
    //             unit.castShadow = true;
    //             unit.receiveShadow = true;
    //             unit.scale.y = sky.parameters.scalar;
    //             unit.position.y = sky.parameters.scalar / 2;
    //             scene.add(unit);
    //         }
    //     });
    //
    //     // Subscriptions
    //     // -------------------------------------------------------------------------------------------------------------
    //     engine.beforeRender$.subscribe(it => {
    //         camera.onRender(it);
    //         sky.onRender(it);
    //         surface.onRender(it);
    //     });
    //     engine.renderer?.setAnimationLoop(it => {
    //         if(this.debug) {
    //             camera.debug.controls.update();
    //         }
    //     });
    // }

    // onInitBackground({engine, scene}: JnThSceneProps): void {
    //     const camera = {
    //         instance: PerspectiveCamera.prototype,
    //         parameters: {
    //             // scalar: 1024 * 1024 * 250,
    //             // scalar: 1024 * 1024,
    //             scalar: 1024,
    //             farMultiplier: 1
    //         },
    //         debug: {
    //             instance: PerspectiveCamera.prototype,
    //             controls: OrbitControls.prototype,
    //             parameters: {
    //                 farMultiplier: 4,
    //             }
    //         },
    //         onInit: () => {
    //             // Initialization
    //             // -----------------------------------------------------------------------------------------------------
    //             camera.instance = new PerspectiveCamera();
    //             camera.instance.far = camera.parameters.scalar  * camera.parameters.farMultiplier;
    //
    //             if (this.debug) {
    //                 camera.debug.instance = new PerspectiveCamera();
    //                 camera.debug.instance.far = camera.parameters.scalar * camera.debug.parameters.farMultiplier;
    //
    //                 camera.debug.controls = new OrbitControls(camera.debug.instance, engine.renderer?.domElement);
    //                 scene.add(new AxesHelper(camera.parameters.scalar));
    //             }
    //
    //             // Configuration
    //             // -----------------------------------------------------------------------------------------------------
    //
    //             // Rendering
    //             // -----------------------------------------------------------------------------------------------------
    //             if (this.debug) {
    //                 scene.add(camera.debug.instance);
    //             }
    //
    //             scene.add(camera.instance);
    //
    //             if(this.debug) {
    //                 scene.add(new CameraHelper(camera.instance));
    //             }
    //
    //             // Finalization
    //             // -----------------------------------------------------------------------------------------------------
    //             camera.isInitialized = true;
    //         },
    //         onRender: ({}: RenderState) => {
    //             // Checking
    //             // -----------------------------------------------------------------------------------------------------
    //             if (!camera.isInitialized) {
    //                 return;
    //             }
    //         },
    //         isInitialized: false
    //     };
    //     const sky = {
    //         instance: Group.prototype,
    //         parameters: {
    //             scalar: camera.parameters.scalar / 2,
    //             radiusMultiplier: 1.2,
    //             fog: {
    //                 visible: true,
    //                 color: new Color("#b3b3b3"),
    //                 nearMultiplier: 0.6,
    //                 farMultiplier: 2
    //             }
    //         },
    //         children: {
    //             background: {
    //                 instance: Mesh.prototype as Sky,
    //                 parameters: {
    //                     turbidity: 0.4,
    //                     rayleigh: 1,
    //                     mieCoefficient: 0.006,
    //                     mieDirectionalG: 0.8,
    //                     exposure: 0.4,
    //                 }
    //             },
    //             ambient: {
    //                 instance: AmbientLight.prototype,
    //                 parameters: {
    //                     intensity: 1,
    //                 }
    //             },
    //             sun: {
    //                 instance: DirectionalLight.prototype,
    //                 parameters: {
    //                     intensity: 2,
    //                     elevation: 30,
    //                     azimuth: 15
    //                 }
    //             },
    //             cloud: {
    //                 instance: Mesh.prototype as InstancedMesh<BufferGeometry, ShaderMaterial>,
    //                 parameters: {
    //                     heaps: {
    //                         count: 10,
    //                         size: 2
    //                     },
    //                     spawn: {
    //                         position: {
    //                             depth: 20,
    //                             offset: 100
    //                         },
    //                         size: {
    //                             scalar: 200,
    //                             offset: 400
    //                         }
    //                     },
    //                     animate: {
    //                         speed: new Vector3(
    //                             0.1,
    //                             0,
    //                             0.01
    //                         )
    //                     }
    //                 },
    //                 assets: {
    //                     map: {
    //                         instance: Texture.prototype,
    //                         url: `${window.location.pathname}/assets/maps/sky/cloud/sky-cloud.png`,
    //                     },
    //                     shader: {
    //                         vertex: {
    //                             instance: ``,
    //                             url: `${window.location.pathname}/assets/shaders/sky/cloud/sky-cloud.vertex.glsl`
    //                         },
    //                         fragment: {
    //                             instance: ``,
    //                             url: `${window.location.pathname}/assets/shaders/sky/cloud/sky-cloud.fragment.glsl`
    //                         },
    //                     }
    //                 },
    //                 actions: {
    //                     spawn: (size: number, indexOffset: number = 0, spawnPointOffset: Vector3 = new Vector3()) => {
    //                         const spawnPoint = new Vector3(
    //                             MathUtils.randInt(
    //                                 -sky.parameters.scalar * 0.5 + spawnPointOffset.x,
    //                                 sky.parameters.scalar * 0.5 + spawnPointOffset.x,
    //                             ),
    //                             MathUtils.randInt(
    //                                 sky.parameters.scalar * 0.1 + spawnPointOffset.y,
    //                                 sky.parameters.scalar * 0.4 + spawnPointOffset.y,
    //                             ),
    //                             MathUtils.randInt(
    //                                 -sky.parameters.scalar * 0.5 + spawnPointOffset.z,
    //                                 spawnPointOffset.y,
    //                             ),
    //                         );
    //                         const object = new Object3D();
    //
    //                         const positionDepth = 20;
    //                         const positionOffset = 100;
    //
    //                         const sizeScalar = 50;
    //                         const sizeOffset = 150;
    //
    //                         for(let index = 0; index < size; index++) {
    //                             sky.children.cloud.instance.getMatrixAt(index + indexOffset, object.matrix);
    //
    //                             object.position.copy(spawnPoint);
    //
    //                             object.position.add(new Vector3(
    //                                 MathUtils.randInt(
    //                                     -sky.children.cloud.parameters.spawn.position.offset,
    //                                     +sky.children.cloud.parameters.spawn.position.offset
    //                                 ),
    //                                 MathUtils.randInt(
    //                                     -sky.children.cloud.parameters.spawn.position.offset,
    //                                     +sky.children.cloud.parameters.spawn.position.offset
    //                                 ),
    //                                 +sky.children.cloud.parameters.spawn.position.depth * index,
    //                             ));
    //
    //                             object.rotateZ(
    //                                 MathUtils.degToRad(
    //                                     MathUtils.randFloat(0, 360)
    //                                 )
    //                             );
    //
    //                             object.scale.setX(
    //                                 sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
    //                                 // MathUtils.randInt(
    //                                 //     sky.children.cloud.parameters.spawn.size.scalar,
    //                                 //     sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
    //                                 // )
    //                             );
    //                             object.scale.setY(
    //                                 sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
    //                                 // MathUtils.randInt(
    //                                 //     sky.children.cloud.parameters.spawn.size.scalar,
    //                                 //     sky.children.cloud.parameters.spawn.size.scalar + sky.children.cloud.parameters.spawn.size.offset
    //                                 // )
    //                             );
    //
    //                             object.updateMatrix();
    //
    //                             sky.children.cloud.instance.setMatrixAt(index + indexOffset, object.matrix);
    //                         }
    //
    //                         sky.children.cloud.instance.userData["spawnPoint"] = spawnPoint;
    //                     },
    //                     animate: (size: number, indexOffset: number = 0) => {
    //                         let object = new Object3D();
    //                         let eye = new Object3D();
    //
    //                         for(let index = 0; index < size; index++) {
    //                             sky.children.cloud.instance.getMatrixAt(index + indexOffset, object.matrix);
    //
    //                             object.position.setFromMatrixPosition(object.matrix);
    //                             object.rotation.setFromRotationMatrix(object.matrix);
    //                             object.scale.setFromMatrixScale(object.matrix);
    //
    //                             object.position.x += sky.children.cloud.parameters.animate.speed.x;
    //                             object.position.y += sky.children.cloud.parameters.animate.speed.y;
    //                             object.position.z += sky.children.cloud.parameters.animate.speed.z * MathUtils.randInt(-1, 1);
    //
    //                             eye.position.copy(object.position);
    //                             eye.lookAt(camera.instance.position);
    //
    //                             object.rotation.y = eye.rotation.y;
    //
    //                             object.updateMatrix();
    //
    //                             sky.children.cloud.instance.setMatrixAt(index + indexOffset, object.matrix);
    //                         }
    //
    //                         if(object.position.x > sky.parameters.scalar / 2) {
    //                             sky.children.cloud.actions.spawn(
    //                                 size,
    //                                 indexOffset,
    //                                 new Vector3(
    //                                     -sky.parameters.scalar,
    //                                     0,
    //                                     -sky.parameters.scalar / 2
    //                                 )
    //                             );
    //                         }
    //                     },
    //                 }
    //             }
    //         },
    //         onLoad: () => {
    //             return zip(
    //                 from(
    //                     new TextureLoader().loadAsync(sky.children.cloud.assets.map.url).then(it => {
    //                         // Configuration
    //                         // ---------------------------------------------------------------------------------------------
    //                         it.minFilter = LinearMipMapLinearFilter;
    //                         it.magFilter = LinearMipMapLinearFilter;
    //
    //                         // Finalization
    //                         // ---------------------------------------------------------------------------------------------
    //                         sky.children.cloud.assets.map.instance = it;
    //                     })
    //                 ),
    //                 from(
    //                     new FileLoader().loadAsync(sky.children.cloud.assets.shader.vertex.url).then(it => {
    //                         // Finalization
    //                         // ---------------------------------------------------------------------------------------------
    //                         sky.children.cloud.assets.shader.vertex.instance = it as string;
    //                     })
    //                 ),
    //                 from(
    //                     new FileLoader().loadAsync(sky.children.cloud.assets.shader.fragment.url).then(it => {
    //                         // Finalization
    //                         // ---------------------------------------------------------------------------------------------
    //                         sky.children.cloud.assets.shader.fragment.instance = it as string;
    //                     })
    //                 )
    //             )
    //         },
    //         onInit: () => {
    //             // Initialization
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.instance = new Group();
    //
    //             // Background
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.background.instance = new Sky();
    //
    //             sky.children.background.instance.scale.setScalar(
    //                 sky.parameters.scalar * 2
    //             );
    //
    //             if(sky.parameters.fog.visible && !this.debug) {
    //                 scene.fog = new Fog(
    //                     sky.parameters.fog.color,
    //                     sky.parameters.scalar * sky.parameters.fog.nearMultiplier,
    //                     sky.parameters.scalar * sky.parameters.fog.farMultiplier,
    //                 );
    //             }
    //
    //             // Ambient
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.ambient.instance = new AmbientLight();
    //             sky.children.ambient.instance.intensity = sky.children.ambient.parameters.intensity;
    //
    //             // Sun
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.sun.instance = new DirectionalLight();
    //             sky.children.sun.instance.intensity = sky.children.sun.parameters.intensity;
    //
    //             sky.children.sun.instance.position.setFromSphericalCoords(
    //                 sky.parameters.scalar * sky.parameters.radiusMultiplier,
    //                 MathUtils.degToRad(90 - sky.children.sun.parameters.elevation),
    //                 MathUtils.degToRad(sky.children.sun.parameters.azimuth)
    //             );
    //             sky.children.sun.instance.lookAt(new Vector3());
    //
    //             if(this.debug) {
    //                 sky.children.sun.instance.userData["sunSpeed"] = 0.01;
    //             }
    //             else {
    //                 sky.children.sun.instance.userData["sunSpeed"] = 0.0001;
    //             }
    //             sky.children.sun.instance.userData["sunElevationDirection"] = 1;
    //
    //             sky.children.sun.instance.castShadow = true;
    //             // sky.children.sun.instance.shadow.bias = -0.001;
    //             //
    //             sky.children.sun.instance.shadow.mapSize.width =
    //             sky.children.sun.instance.shadow.mapSize.height = 1024;
    //
    //             // sky.children.sun.instance.shadow.camera.top =
    //             //     0.2 * sky.parameters.scalar * -1;
    //             // sky.children.sun.instance.shadow.camera.right =
    //             //     0.5 * sky.parameters.scalar * -1;
    //             // sky.children.sun.instance.shadow.camera.bottom =
    //             //     0.2 * sky.parameters.scalar
    //             // sky.children.sun.instance.shadow.camera.left =
    //             //     0.5 * sky.parameters.scalar;
    //
    //             sky.children.sun.instance.shadow.camera.near =
    //                 0;
    //             sky.children.sun.instance.shadow.camera.far =
    //                 sky.children.sun.instance.position.distanceTo(new Vector3());
    //
    //             // Cloud
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.cloud.instance = new InstancedMesh(
    //                 new PlaneGeometry(1, 1),
    //                 new ShaderMaterial({
    //                     transparent: true,
    //                     depthWrite: false,
    //                     depthTest: false,
    //                     // blending: AdditiveBlending,
    //                     uniforms: {
    //                         map: {
    //                             value: sky.children.cloud.assets.map.instance
    //                         },
    //                         fogColor: {
    //                             value: sky.parameters.fog.color,
    //                         },
    //                         fogNear: {
    //                             value: sky.parameters.scalar * sky.parameters.fog.nearMultiplier,
    //                         },
    //                         fogFar: {
    //                             value: sky.parameters.scalar * sky.parameters.fog.farMultiplier,
    //                         }
    //                     },
    //                     vertexShader: sky.children.cloud.assets.shader.vertex.instance,
    //                     fragmentShader: sky.children.cloud.assets.shader.fragment.instance
    //                 }),
    //                 sky.children.cloud.parameters.heaps.count * sky.children.cloud.parameters.heaps.size
    //             );
    //
    //             sky.children.cloud.instance.material.side = DoubleSide;
    //
    //             for(let cloudHeapIndex = 0; cloudHeapIndex < sky.children.cloud.parameters.heaps.count; cloudHeapIndex++) {
    //                 sky.children.cloud.actions.spawn(
    //                     sky.children.cloud.parameters.heaps.size,
    //                     sky.children.cloud.parameters.heaps.size * cloudHeapIndex,
    //                 );
    //             }
    //
    //             // Rendering
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.instance.add(sky.children.ambient.instance);
    //             sky.instance.add(sky.children.sun.instance);
    //
    //             sky.instance.add(sky.children.background.instance);
    //             // sky.instance.add(sky.children.cloud.instance);
    //
    //             scene.add(sky.instance);
    //
    //             if(this.debug) {
    //                 scene.add( new DirectionalLightHelper(sky.children.sun.instance, sky.parameters.scalar * 0.05) );
    //                 scene.add( new CameraHelper(sky.children.sun.instance.shadow.camera))
    //             }
    //
    //             // Finalization
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.isInitialized = true
    //         },
    //         onRender: ({}: RenderState) => {
    //             // Checking
    //             // -----------------------------------------------------------------------------------------------------
    //             if (!sky.isInitialized) {
    //                 return;
    //             }
    //
    //             // Sun
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.sun.instance.position.setFromSphericalCoords(
    //                 sky.parameters.scalar * sky.parameters.radiusMultiplier,
    //                 MathUtils.degToRad(90 - sky.children.sun.parameters.elevation),
    //                 MathUtils.degToRad(sky.children.sun.parameters.azimuth)
    //             );
    //             sky.children.sun.instance.lookAt(new Vector3());
    //
    //             if(this.debug) {
    //                 if (sky.children.sun.parameters.elevation >= 45 || sky.children.sun.parameters.elevation <= -1) {
    //                     sky.children.sun.instance.userData["sunElevationDirection"] *= -1;
    //                 }
    //             }
    //             // sky.children.sun.parameters.elevation += sky.children.sun.instance.userData["sunSpeed"] * sky.children.sun.instance.userData["sunElevationDirection"];
    //             // sky.children.sun.parameters.azimuth -= sky.children.sun.instance.userData["sunSpeed"];
    //
    //             // Background
    //             // -----------------------------------------------------------------------------------------------------
    //             sky.children.background.instance.material.uniforms['turbidity'].value = sky.children.background.parameters.turbidity;
    //             sky.children.background.instance.material.uniforms['rayleigh'].value = sky.children.background.parameters.rayleigh;
    //             sky.children.background.instance.material.uniforms['mieCoefficient'].value = sky.children.background.parameters.mieCoefficient;
    //             sky.children.background.instance.material.uniforms['mieDirectionalG'].value = sky.children.background.parameters.mieDirectionalG;
    //             sky.children.background.instance.material.uniforms['sunPosition'].value.copy(
    //                 sky.children.sun.instance.position
    //             );
    //
    //             // Cloud
    //             // -----------------------------------------------------------------------------------------------------
    //             for(let cloudHeapIndex = 0; cloudHeapIndex < sky.children.cloud.parameters.heaps.count; cloudHeapIndex++) {
    //                 sky.children.cloud.actions.animate(
    //                     sky.children.cloud.parameters.heaps.size,
    //                     sky.children.cloud.parameters.heaps.size * cloudHeapIndex,
    //                 )
    //                 sky.children.cloud.instance.instanceMatrix.needsUpdate = true;
    //             }
    //         },
    //         isInitialized: false
    //     };
    //     const surface = {
    //         instance: Mesh.prototype as Mesh<PlaneGeometry, Material>,
    //         parameters: {
    //             scalar: camera.parameters.scalar,
    //             subdivision: 1024,
    //             displacementScaleMultiplier: 0.15
    //         },
    //         assets: {
    //             maps: {
    //                 heightmap: {
    //                     instance: Texture.prototype,
    //                     url: `${window.location.pathname}/assets/maps/surface/surface.heightmap.png`,
    //                 }
    //             }
    //         },
    //         onLoad: () => {
    //             return zip(
    //                 from(
    //                     new TextureLoader().loadAsync(surface.assets.maps.heightmap.url).then(it => {
    //                         // Configuration
    //                         // -----------------------------------------------------------------------------------------
    //                         it.wrapS = it.wrapT = RepeatWrapping;
    //
    //                         it.center.set(0.5, 0.5);
    //                         it.repeat.set(0.7, 0.7);
    //
    //                         // Finalization
    //                         // -----------------------------------------------------------------------------------------
    //                         surface.assets.maps.heightmap.instance = it;
    //                     })
    //                 )
    //             )
    //         },
    //         onInit: () => {
    //             // Initialization
    //             // -----------------------------------------------------------------------------------------------------
    //             surface.instance = new Mesh(
    //                 new PlaneGeometry(
    //                     surface.parameters.scalar * 2,
    //                     surface.parameters.scalar * 2,
    //                     surface.parameters.subdivision,
    //                     surface.parameters.subdivision
    //                 ),
    //                 new MeshPhongMaterial({
    //                     // wireframe: true,
    //                     // color: "#373737",
    //                     color: "#867562",
    //                     map: surface.assets.maps.heightmap.instance,
    //                     displacementMap: surface.assets.maps.heightmap.instance,
    //                     displacementScale: surface.parameters.scalar * surface.parameters.displacementScaleMultiplier,
    //                     specular: 0,
    //                     shininess: 0
    //                 })
    //             );
    //
    //             // Configuration
    //             // -----------------------------------------------------------------------------------------------------
    //             surface.instance.rotation.x = -Math.PI / 2;
    //
    //             surface.instance.castShadow= true;
    //             surface.instance.receiveShadow = true;
    //
    //             // Rendering
    //             // -----------------------------------------------------------------------------------------------------
    //             scene.add(surface.instance);
    //
    //             if (this.debug) {
    //                 // scene.add(new GridHelper(surface.parameters.scalar, 64, 0xffffff, 0xffffff))
    //             }
    //
    //             // Finalization
    //             // -----------------------------------------------------------------------------------------------------
    //             camera.isInitialized = true;
    //         },
    //         onRender: ({}: RenderState) => {
    //             // Checking
    //             // -----------------------------------------------------------------------------------------------------
    //             if (!camera.isInitialized) {
    //                 return;
    //             }
    //         },
    //         isInitialized: false
    //     };
    //     const islands = {
    //         instance: Object3D.prototype,
    //         onInit: () => {
    //             // Initialization
    //             // -----------------------------------------------------------------------------------------------------
    //
    //             // Configuration
    //             // -----------------------------------------------------------------------------------------------------
    //
    //             // Rendering
    //             // -----------------------------------------------------------------------------------------------------
    //
    //             // Finalization
    //             // -----------------------------------------------------------------------------------------------------
    //             camera.isInitialized = true;
    //         },
    //         onRender: ({}: RenderState) => {
    //             // Checking
    //             // -----------------------------------------------------------------------------------------------------
    //             if (!camera.isInitialized) {
    //                 return;
    //             }
    //         },
    //         isInitialized: false
    //     };
    //     const ruins = {
    //         instance: Object3D.prototype,
    //         onInit: () => {
    //             // Initialization
    //             // -----------------------------------------------------------------------------------------------------
    //
    //             // Configuration
    //             // -----------------------------------------------------------------------------------------------------
    //
    //             // Rendering
    //             // -----------------------------------------------------------------------------------------------------
    //
    //             // Finalization
    //             // -----------------------------------------------------------------------------------------------------
    //             camera.isInitialized = true;
    //         },
    //         onRender: ({}: RenderState) => {
    //             // Checking
    //             // -----------------------------------------------------------------------------------------------------
    //             if (!camera.isInitialized) {
    //                 return;
    //             }
    //         },
    //         isInitialized: false
    //     };
    //
    //     // Configuration
    //     // -------------------------------------------------------------------------------------------------------------
    //     camera.onInit();
    //
    //     if (engine.renderer) {
    //         engine.renderer.shadowMap.enabled = true;
    //         engine.renderer.shadowMap.type = PCFSoftShadowMap;
    //
    //         engine.renderer.toneMapping = LinearToneMapping;
    //         engine.renderer.toneMappingExposure = sky.children.background.parameters.exposure;
    //     }
    //
    //     // Loading
    //     // -------------------------------------------------------------------------------------------------------------
    //     zip(
    //         sky.onLoad(),
    //         surface.onLoad()
    //     ).subscribe(it => {
    //         // Initialization
    //         // ---------------------------------------------------------------------------------------------------------
    //         sky.onInit();
    //         surface.onInit();
    //
    //         // Configuration
    //         // ---------------------------------------------------------------------------------------------------------
    //         camera.instance.position.set(0, sky.parameters.scalar * 0.8, 0);
    //         camera.instance.lookAt(
    //             0,
    //             camera.instance.position.y - 2.5,
    //             camera.instance.position.z + 10
    //         );
    //         surface.instance.position.z += sky.parameters.scalar;
    //         surface.instance.position.y -= sky.parameters.scalar * 0.2;
    //         surface.instance.rotation.z += MathUtils.degToRad(90);
    //
    //         if (this.debug) {
    //             // camera.debug.instance.position.set(0, sky.parameters.scalar * 0.1, -50);
    //             // camera.debug.instance.position.set(0, sky.parameters.scalar * 0.1, sky.parameters.scalar * 0.1);
    //             camera.debug.instance.position.set(
    //                 sky.parameters.scalar * 1.5 * -1,
    //                 sky.parameters.scalar * 0.5,
    //                 sky.parameters.scalar * 1.5
    //             );
    //             camera.debug.controls.target = new Vector3();
    //             camera.debug.controls.target = camera.instance.position;
    //             // camera.debug.controls.target = new Vector3(0, camera.debug.instance.position.y - 50, 0);
    //             // camera.controls.instance.autoRotate = true;
    //             // camera.controls.instance.autoRotateSpeed = -1;
    //
    //             let unit = new Mesh(
    //                 new BoxGeometry(),
    //                 new MeshStandardMaterial({
    //                     color: new Color(255, 255, 255)
    //                 })
    //             );
    //             unit.castShadow = true;
    //             unit.receiveShadow = true;
    //             unit.scale.y = sky.parameters.scalar;
    //             unit.position.y = sky.parameters.scalar / 2;
    //             scene.add(unit);
    //             // camera.controls.instance.target = unit.position;
    //         }
    //     });
    //
    //     // Subscriptions
    //     // -------------------------------------------------------------------------------------------------------------
    //     engine.beforeRender$.subscribe(it => {
    //         camera.onRender(it);
    //         sky.onRender(it);
    //         surface.onRender(it);
    //     });
    //     engine.renderer?.setAnimationLoop(it => {
    //         if(this.debug) {
    //             camera.debug.controls.update();
    //         }
    //     });
    // }

    // onInitBackground({engine, scene}: JnThSceneProps): void {
    //     if (this.vr) {
    //         engine.renderer!.xr.enabled = true;
    //         {
    //             document.body.append(
    //                 VRButton.createButton(engine.renderer!)
    //             )
    //             engine.beforeRender$.subscribe(renderState => {
    //                 if (!engine.renderer!.xr.isPresenting) {
    //                 }
    //             });
    //             engine.renderer!.setAnimationLoop(() => {
    //                 engine.render()
    //             })
    //         }
    //     }
    //
    //     let camera = new PerspectiveCamera();
    //     {
    //         camera.position.set(3, 2, 3);
    //         camera.lookAt(new Vector3(0, 4, 0))
    //     }
    //
    //     // https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_sky.html
    //     // const skyController = {
    //     //     turbidity: 5,
    //     //     rayleigh: 1.8,
    //     //     mieCoefficient: 0.002,
    //     //     mieDirectionalG: 0.8,
    //     //     elevation: -5,
    //     //     azimuth: 180,
    //     //     exposure: 0.5
    //     // };
    //     let sky = {
    //         object: Sky.prototype,
    //         controller: {
    //             turbidity: 0.7,
    //             rayleigh: 1,
    //             mieCoefficient: 0.006,
    //             mieDirectionalG: 0.8,
    //             elevation: 35,
    //             // azimuth: 90,
    //             azimuth: 180 + 45 + 20,
    //             exposure: 0.5
    //         },
    //         sun: DirectionalLight.prototype,
    //         sunElevationSpeed: 0.1,
    //         sunElevationDirection: 1,
    //         onInit: () => {
    //             sky.object = new Sky();
    //             sky.object.scale.setScalar(500000);
    //
    //             sky.sun = new DirectionalLight();
    //
    //             if (engine.renderer) {
    //                 engine.renderer.toneMapping = LinearToneMapping;
    //                 engine.renderer.toneMappingExposure = sky.controller.exposure
    //             }
    //
    //             scene.add(sky.object);
    //             scene.add(sky.sun);
    //         },
    //         onRender: ({}: RenderState) => {
    //             const uniforms = sky.object.material.uniforms;
    //             uniforms['turbidity'].value = sky.controller.turbidity;
    //             uniforms['rayleigh'].value = sky.controller.rayleigh;
    //             uniforms['mieCoefficient'].value = sky.controller.mieCoefficient;
    //             uniforms['mieDirectionalG'].value = sky.controller.mieDirectionalG;
    //
    //             const phi = MathUtils.degToRad(90 - sky.controller.elevation);
    //             const theta = MathUtils.degToRad(sky.controller.azimuth);
    //
    //             sky.sun.position.setFromSphericalCoords(1, phi, theta);
    //             sky.sun.lookAt(new Vector3());
    //
    //             uniforms['sunPosition'].value.copy(sky.sun.position);
    //
    //             // if(sky.controller.elevation >= 45 || sky.controller.elevation <= -10) {
    //             //     sky.sunElevationDirection *= -1;
    //             // }
    //             // sky.controller.elevation += sky.sunElevationSpeed * sky.sunElevationDirection;
    //             // camera.lookAt(sky.sun);
    //         }
    //     };
    //
    //     let ruins = {
    //         object: InstancedMesh.prototype,
    //         trail: InstancedMesh.prototype,
    //         instance: {
    //             count: 50,
    //             // speed: 0.1,
    //             speed: 0.3,
    //             shader: {
    //                 uniforms: {
    //                     uTime:  {value: 1.0},
    //                     uSpeed: {value: new Vector3(0.0, 0.2, 1.0)},
    //                     uScale: {value: new Vector3(3.0, 3.0, 1.0)},
    //                 },
    //                 vertexUrl: `${window.location.pathname}/assets/shaders/ruins/ruin-trail.vertex.glsl`,
    //                 vertex: `
    //                     varying vec2 vUV;
    //                     varying vec3 vPosition;
    //
    //                     void main(){
    //                         // PROJECT ---------------------------------------------------------------------------------------------------------
    //                         vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
    //
    //                         vec4 viewPosition = viewMatrix * modelPosition;
    //
    //                         gl_Position = projectionMatrix * viewPosition;
    //
    //                         vUV = uv;
    //                         vPosition = gl_Position.xyz;
    //
    //                         // DEFAULT ---------------------------------------------------------------------------------------------------------
    //                         //gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    //                     }
    //                 `,
    //                 fragmentUrl: `${window.location.pathname}/assets/shaders/ruins/ruin-trail.fragment.glsl`,
    //                 fragment: `
    //                     uniform float uTime;
    //                     uniform vec3  uSpeed;
    //                     uniform vec3  uScale;
    //
    //                     varying vec2 vUV;
    //                     varying vec3 vPosition;
    //
    //                     // 2D Random
    //                     float random (in vec2 st) {
    //                         return fract(sin(dot(st.xy,
    //                                 vec2(12.9898,78.233)))
    //                             * 43758.681);
    //                     }
    //
    //                     // 2D Noise based on Morgan McGuire @morgan3d
    //                     // https://www.shadertoy.com/view/4dS3Wd
    //                     float noise (vec2 st) {
    //                         vec2 i = floor(st);
    //                         vec2 f = fract(st);
    //
    //                         // Four corners in 2D of a tile
    //                         float a = random(i);
    //                         float b = random(i + vec2(1.0, 0.0));
    //                         float c = random(i + vec2(0.0, 1.0));
    //                         float d = random(i + vec2(1.0, 1.0));
    //
    //                         // Smooth Interpolation
    //
    //                         // Cubic Hermine Curve.  Same as SmoothStep()
    //                         vec2 u = f*f*(3.0-2.0*f);
    //                         // u = smoothstep(0.,1.,f);
    //
    //                         // Mix 4 coorners percentages
    //                         return mix(a, b, u.x) +
    //                             (c - a)* u.y * (1. - u.x) +
    //                             (d - b) * u.x * u.y;
    //                     }
    //
    //                     vec3 texture(vec3 tCoord) {
    //                         return vec3(
    //                             noise(tCoord.xy)
    //                         );
    //                     }
    //
    //                     void main() {
    //                         vec3 tICoord = vec3(vUV, 0.);
    //
    //                         vec3 t1 = texture(
    //                             vec3(
    //                                 (tICoord.x * uScale.x) + (uSpeed.x * uTime * 0.2) + 0.0 + vPosition.x,
    //                                 (tICoord.y * uScale.y) - (uSpeed.y * uTime * 2.0) + 0.0,
    //                                 0.0
    //                             )
    //                         );
    //                         vec3 t2 = texture(
    //                             vec3(
    //                                 (tICoord.x * uScale.x) - (uSpeed.x * uTime * 0.2) + 0.0 - vPosition.x,
    //                                 (tICoord.y * uScale.y) - (uSpeed.y * uTime * 1.5) + 0.0,
    //                                 0.0
    //                             )
    //                         );
    //                         vec3 t3 = texture(
    //                             vec3(
    //                                 (tICoord.x * uScale.x) + (uSpeed.x * uTime * 0.7) + 0.0 + vPosition.x,
    //                                 (tICoord.y * uScale.y) + (uSpeed.y * uTime * 0.2) + 0.0,
    //                                 0.0
    //                             )
    //                         );
    //
    //                         vec3 t0 = t1 * t2 * t3 * 1.0;
    //
    //                         vec3 m1 = vec3(tICoord.x - 0.0);
    //                         vec3 m2 = vec3(tICoord.x - 1.0) * -1.0;
    //                         vec3 m3 = vec3(tICoord.y - 0.2);
    //                         vec3 m4 = vec3(tICoord.y - 1.0) * -1.0;
    //                         vec3 m5 = vec3(
    //                                 length(
    //                                     vec3(
    //                                         tICoord.x - 0.5,
    //                                         tICoord.y - 0.4,
    //                                         0.0
    //                                     )
    //                                 )
    //                                 - 0.6
    //                             )
    //                             * -1.0;
    //
    //                         // vec3 m0 = m1 * m2 * m3 * m4;
    //                         vec3 m0 = m1 * m2 * m3 * m5 * m4;
    //
    //                         m0 *= 10.0;
    //
    //                         vec4 baseColor = vec4(
    //                             mix(
    //                                 vec3(0.0, 1.0, 0.0),
    //                                 vec3(0.0, 1.0, 1.0),
    //                                 tICoord.y + 0.2
    //                             ),
    //                             t0 * m0 * 10.0
    //                         );
    //                         // baseColor = vec4(m0, 1.0);
    //
    //                         gl_FragColor = vec4(baseColor.rgb, baseColor.a);
    //                         //gl_FragColor = vec4(vPosition, 1.0);
    //                     }
    //                 `
    //             },
    //             coordinates: {
    //                 generator: (index: number): Object3D => {
    //                     // OBJECT ---------------------------------------------
    //
    //                     let object = new Object3D();
    //
    //                     object.position.set(
    //                         // -Math.random() * 200  - 5,
    //                         // +Math.random() * 2000 + 400,
    //                         // -Math.random() * 200  - 5
    //                         -Math.random() * 50 - 5,
    //                         +Math.random() * 500 + 100,
    //                         -Math.random() * 50 - 5
    //                     );
    //
    //                     object.rotation.set(
    //                         Math.random() * 360,
    //                         Math.random() * 360,
    //                         Math.random() * 360
    //                     )
    //
    //                     object.updateMatrix();
    //
    //                     ruins.object.setMatrixAt(index, object.matrix);
    //
    //                     // TRAIL ----------------------------------------------
    //
    //                     let trail = new Object3D();
    //
    //                     trail.position.copy(object.position);
    //
    //                     if (ruins.trail.geometry instanceof PlaneGeometry) {
    //                         trail.position.y += ruins.trail.geometry.parameters.height / 2;
    //                     }
    //
    //                     trail.lookAt(camera.position);
    //
    //                     trail.rotation.x = 0;
    //                     trail.rotation.z = 0;
    //
    //                     trail.updateMatrix();
    //
    //                     ruins.trail.setMatrixAt(index, trail.matrix);
    //
    //                     return object;
    //                 },
    //                 fall: (index: number): Matrix4 => {
    //                     // OBJECT ---------------------------------------------
    //
    //                     let object = new Matrix4();
    //
    //                     ruins.object.getMatrixAt(index, object);
    //
    //                     let position = new Vector3();
    //
    //                     position.setFromMatrixPosition(object);
    //
    //                     position.y -= ruins.instance.speed;
    //
    //                     object.setPosition(position);
    //
    //                     ruins.object.setMatrixAt(index, object);
    //
    //                     // TRAIL ----------------------------------------------
    //
    //                     let trail = new Matrix4();
    //
    //                     ruins.trail.getMatrixAt(index, trail);
    //
    //                     position.setFromMatrixPosition(trail);
    //
    //                     position.y -= ruins.instance.speed;
    //
    //                     trail.setPosition(position);
    //
    //                     // trail.lookAt(camera.position, position, new Vector3(0, 1, 0));
    //
    //                     ruins.trail.setMatrixAt(index, trail);
    //
    //                     return object;
    //                 }
    //             }
    //         },
    //         onInit: () => {
    //             ruins.object = new InstancedMesh(
    //                 new BoxGeometry(4, 6, 5),
    //                 new MeshPhongMaterial(),
    //                 ruins.instance.count
    //             );
    //             ruins.trail = new InstancedMesh(
    //                 new PlaneGeometry(4, 12),
    //                 // new MeshPhongMaterial(),
    //                 new ShaderMaterial({
    //                     uniforms: ruins.instance.shader.uniforms,
    //                     vertexShader: ruins.instance.shader.vertex,
    //                     fragmentShader: ruins.instance.shader.fragment,
    //                     transparent: true,
    //                     depthWrite: false,
    //                     blending: AdditiveBlending
    //                 }),
    //                 ruins.instance.count
    //             );
    //
    //             for (let index = 0; index < ruins.instance.count; index++) {
    //                 ruins.instance.coordinates.generator(index);
    //             }
    //
    //             scene.add(ruins.object);
    //             scene.add(ruins.trail);
    //
    //             console.log(ruins.trail.material);
    //         },
    //         onRender: ({delta}: RenderState) => {
    //             for (let index = 0; index < ruins.instance.count; index++) {
    //                 let matrix = ruins.instance.coordinates.fall(index);
    //                 let position = new Vector3();
    //
    //                 position.setFromMatrixPosition(matrix);
    //
    //                 if (position.y < -100) {
    //                     ruins.instance.coordinates.generator(index);
    //                 }
    //             }
    //
    //             ruins.trail.material.uniforms['uTime'].value += delta;
    //
    //             ruins.object.instanceMatrix.needsUpdate = true;
    //             ruins.trail.instanceMatrix.needsUpdate = true;
    //         }
    //     }
    //
    //     scene.add(camera);
    //
    //     // Loads assets.
    //     zip(
    //         this.http.get(ruins.instance.shader.vertexUrl, {responseType: 'text'}),
    //         this.http.get(ruins.instance.shader.fragmentUrl, {responseType: 'text'}),
    //     ).subscribe(it => {
    //         ruins.instance.shader.vertex = it[0];
    //         ruins.instance.shader.fragment = it[1];
    //
    //         // Initialize the scene.
    //         sky.onInit();
    //         ruins.onInit();
    //
    //         // Event subscriptions.
    //         engine.beforeRender$.subscribe(it => {
    //             sky.onRender(it);
    //             ruins.onRender(it);
    //         });
    //     });
    // }
}
