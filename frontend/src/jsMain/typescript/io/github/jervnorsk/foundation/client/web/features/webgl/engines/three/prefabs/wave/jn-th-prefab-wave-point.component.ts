import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {RenderState, ThBufferGeometry, ThEngineService, ThObject3D, ThPoints} from "ngx-three";
import {BufferAttribute, BufferGeometry, Color, Points} from "three";
import {BehaviorSubject} from "rxjs";
import {JnThGridProps} from "../../utils/grid/jn-th-grid.component";
import {JnThPrefabComponent} from "../../prebas/jn-th-prefab.component";

export interface JnThPrefabWavePointProps {
    grid?: JnThGridProps,
    point?: JnThPrefabWavePointUnitProps,
    animation?: JnThPrefabWavePointAnimationProps
}

export interface JnThPrefabWavePointUnitProps {
    geometry?: {
        radius?: number
    },
    material?: {
        color?: Color | string
    }
}

export interface JnThPrefabWavePointAnimationProps {
    enabled?: boolean
    frame?: number,
    wave?: {
        speed?: number,
        height?: number
    },
    point?: {
        inflate?: number
    },
    onRender?: (state: RenderState, props: JnThPrefabWavePointProps & { points: ThPoints  }) => void
}

/**
 *
 * Code Reference: https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_waves.html
 */
@Component({
    selector: 'jn-th-prefab-wave-point',
    templateUrl: './jn-th-prefab-wave-point.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnThPrefabWavePoint extends JnThPrefabComponent implements JnThPrefabWavePointProps {

    @ViewChild(ThPoints, {static: true})
    points: ThPoints | undefined

    // @ContentChild(ThBufferGeometry, {static: true})
    @ViewChild(ThBufferGeometry, {static: true})
    geometry: ThBufferGeometry | undefined

    @Input()
    set grid(value: JnThGridProps | undefined) {
        this.grid$.next({...this.grid$.value, ...value});
    }

    get grid(): JnThGridProps {
        return this.grid$.value;
    }

    private grid$ = new BehaviorSubject<JnThGridProps>({
        size: {
            x: 10,
            y: 10
        },
        padding: 0.5
    });

    @Input()
    set point(value: JnThPrefabWavePointUnitProps | undefined) {
        this.point$.next({...this.point$.value, ...value});
    }

    get point(): JnThPrefabWavePointUnitProps {
        return this.point$.value;
    }
    private point$ = new BehaviorSubject<JnThPrefabWavePointUnitProps>({
        geometry: {
            radius: 0.02,
        },
        material: {
            color: "#FFFFFF"
        }
    });


    @Input()
    set animation(value: JnThPrefabWavePointAnimationProps | undefined) {
        this.animation$.next({...this.animation$.value, ...value});
    }

    get animation(): JnThPrefabWavePointAnimationProps {
        return this.animation$.value;
    }

    private animation$ = new BehaviorSubject<JnThPrefabWavePointAnimationProps>({
        enabled: true,
        frame: 0,
        wave: {
            speed: 0.01,
            height: 0.1
        },
        point: {
            inflate: 0.02
        },
    });

    constructor(
        private engine: ThEngineService,
        parent: ThObject3D
    ) {
        super(parent);
    }

    override thOnInitPrefab() {
        const SEPARATION = this.grid.padding!;
        const AMOUNTX = this.grid.size!.x;
        const AMOUNTY = this.grid.size!.y;

        const numParticles = AMOUNTX * AMOUNTY;

        const positions = new Float32Array(numParticles * 3);
        const scales = new Float32Array(numParticles);

        let i = 0, j = 0;

        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {

                positions[i] = this.objRef!.position.x + ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
                positions[i + 1] = this.objRef!.position.y; // y
                positions[i + 2] = this.objRef!.position.z + iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z

                scales[j] = this.point.geometry!.radius!;

                i += 3;
                j++;
            }
        }

        if (this.geometry) {
            this.geometry.objRef!.setAttribute("position", new BufferAttribute(positions, 3))
            this.geometry.objRef!.setAttribute("scale", new BufferAttribute(scales, 1))
        }

        this.engine.beforeRender$.subscribe(it => {
            if (this.geometry && this.animation.enabled) {

                if(this.animation.onRender) {
                    this.animation.onRender(it, {
                        grid: this.grid,
                        point: this.point,
                        animation: this.animation,
                        points: this.points!
                    });
                }
                else {
                    const positions: any = this.geometry.objRef!.attributes['position'].array;
                    const scales: any = this.geometry.objRef!.attributes['scale'].array;

                    let i = 0, j = 0;

                    for (let ix = 0; ix < this.grid.size!.x; ix++) {
                        for (let iy = 0; iy < this.grid.size!.y; iy++) {
                            let xAnimationFunction = Math.sin((ix + this.animation.frame!) * 0.3);
                            let yAnimationFunction = Math.sin((iy + this.animation.frame!) * 0.5);

                            positions[i + 1] =
                                xAnimationFunction * this.animation.wave!.height! +
                                yAnimationFunction * this.animation.wave!.height!
                            ;
                            positions[i + 1] = Math.max(0, positions[i + 1]);
                            scales[j] =
                                (xAnimationFunction < 0 ? 0 : xAnimationFunction * this.animation.point!.inflate!) +
                                (yAnimationFunction < 0 ? 0 : yAnimationFunction * this.animation.point!.inflate!) +
                                this.point.geometry!.radius!
                            ;

                            i += 3;
                            j++;
                        }
                    }

                    this.geometry.objRef!.attributes['position'].needsUpdate = true;
                    this.geometry.objRef!.attributes['scale'].needsUpdate = true;
                }
            }

            this.animation.frame! += this.animation.wave!.speed!;
        });
    }

    getShaderUniforms() {
        return {
            color: {
                value: new Color(this.point.material!.color)
            }
        }
    }

    getShaderVertex() {
        return `
        attribute float scale;

        void main() {
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

            gl_PointSize = scale * ( 300.0 / - mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
        }
        `;
    }

    getShaderFragment() {
        return `
        uniform vec3 color;

        void main() {

            if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 )
                discard;

            gl_FragColor = vec4( color, 1.0 );

        }
        `;
    }
}
