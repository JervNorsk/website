import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {ThBufferGeometry, ThEngineService, ThObject3D, ThPoints} from "ngx-three";
import {
    JnThGridProps
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/utils/grid/jn-th-grid.component";
import {BufferAttribute, Color} from "three";
import {BehaviorSubject} from "rxjs";
import {
    JnThPrefab
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/prebas/jn-th-prefab.component";

export interface JnWebsiteThPrefabWavePointProps {
    grid: JnThGridProps,
    animation: JnWebsiteThPrefabWavePointAnimationProps
}

export interface JnWebsiteThPrefabWavePointAnimationProps {
    enabled?: boolean
    frame?: number,
    wave?: {
        speed?: number,
        height?: number
    },
    point?: {
        inflate?: number
    },
}

/**
 *
 * Code Reference: https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_waves.html
 */
@Component({
    selector: 'jn-website-th-prefab-wave-point',
    templateUrl: './jn-website-th-prefab-wave-point.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThPrefabWavePoint extends JnThPrefab implements JnWebsiteThPrefabWavePointProps, AfterViewInit {

    @ViewChild(ThPoints, {static: true})
    points: ThPoints | undefined

    // @ContentChild(ThBufferGeometry, {static: true})
    @ViewChild(ThBufferGeometry, {static: true})
    geometry: ThBufferGeometry | undefined

    @Input()
    set grid(value: JnThGridProps) {
        this.grid$$.next({...this.grid$$.value, ...value});
    }

    get grid(): JnThGridProps {
        return this.grid$$.value;
    }

    private grid$$ = new BehaviorSubject<JnThGridProps>({
        padding: 0.5
    });

    @Input()
    point = {
        geometry: {
            radius: 0.02,
        },
        material: {
            color: "#FFFFFF"
        }
    }

    @Input()
    set animation(value: JnWebsiteThPrefabWavePointAnimationProps) {
        this.grid$$.next({...this.grid$$.value, ...value});
    }

    get animation(): JnWebsiteThPrefabWavePointAnimationProps {
        return this.animation$$.value;
    }

    private animation$$ = new BehaviorSubject<JnWebsiteThPrefabWavePointAnimationProps>({
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

    ngAfterViewInit() {
        this.initGeometry()
    }

    initGeometry() {
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

                scales[j] = this.point.geometry.radius;

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
                const positions: any = this.geometry.objRef!.attributes['position'].array;
                const scales: any = this.geometry.objRef!.attributes['scale'].array;

                const SEPARATION = this.grid.padding;
                const AMOUNTX = this.grid.size!.x;
                const AMOUNTY = this.grid.size!.y;

                let i = 0, j = 0;

                for (let ix = 0; ix < AMOUNTX; ix++) {
                    for (let iy = 0; iy < AMOUNTY; iy++) {
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
                            this.point.geometry.radius
                        ;

                        i += 3;
                        j++;
                    }
                }

                this.geometry.objRef!.attributes['position'].needsUpdate = true;
                this.geometry.objRef!.attributes['scale'].needsUpdate = true;
            }

            this.animation.frame! += this.animation.wave!.speed!;
        });
    }

    getShaderUniforms() {
        return {
            color: {
                value: new Color(this.point.material.color)
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
