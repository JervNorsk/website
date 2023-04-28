import {AfterContentInit, AfterViewInit, Component, ContentChild, Input, ViewChild} from '@angular/core';
import {RenderState, ThBufferGeometry} from "ngx-three";
import {BufferAttribute, Color, MeshBasicMaterial, SphereGeometry, Vector3} from "three";

/**
 *
 * Code Reference: https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_waves.html
 */
@Component({
    selector: 'th-prefab-wave',
    templateUrl: './th-prefab-wave.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThPrefabWave implements AfterContentInit, AfterViewInit {

    // @ContentChild(ThBufferGeometry, {static: true})
    @ViewChild(ThBufferGeometry, {static: true})
    geometry: ThBufferGeometry | undefined

    @Input()
    set position(value: Vector3 | [x: number, y: number, z: number]) {
        if(value instanceof Vector3) {
            this.config.unit.position.set(
                value.x,
                value.y,
                value.z
            );
        }
        else {
            this.config.unit.position.set(
                value[0],
                value[1],
                value[2],
            );
        }
    }

    @Input()
    set padding(value: number) {
        this.config.unit.padding = value
    }

    @Input()
    set size(value: [x: number, y:number]) {
        this.config.size.x = value[0];
        this.config.size.y = value[1];
    }

    private config = {
        unit: {
            position: new Vector3(0, 0,0),
            radius: 0.01,
            padding: 0.5
        },
        size: {
            x: 10,
            y: 10
        },
        animation: {
            count: 0,
            speed: 0.05,
            amplitude: 0.2,
            inflate: 0.05
        }
    }

    ngAfterContentInit() {
        // console.log("ngAfterContentInit", "th-grid", this.geometry)
        //
        // this.setGeometryAttributes();
    }

    ngAfterViewInit() {
        console.log("ngAfterViewInit", "th-grid", this.geometry)

        this.setGeometryAttributes();
    }

    setGeometryAttributes() {
        const SEPARATION = this.config.unit.padding;
        const AMOUNTX = this.config.size.x;
        const AMOUNTY = this.config.size.y;

        const numParticles = AMOUNTX * AMOUNTY;

        const positions = new Float32Array( numParticles * 3 );
        const scales = new Float32Array( numParticles );

        let i = 0, j = 0;

        for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

            for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

                positions[ i ] = this.config.unit.position.x + ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
                positions[ i + 1 ] = this.config.unit.position.y; // y
                positions[ i + 2 ] = this.config.unit.position.z + iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

                scales[ j ] = 0.05;

                i += 3;
                j ++;

            }

        }

        if (this.geometry) {
            this.geometry.objRef!.setAttribute("position", new BufferAttribute(positions, 3))
            this.geometry.objRef!.setAttribute("scale", new BufferAttribute(scales, 1))

            // this.geometry.objRef!.attributes['position'].needsUpdate = true
            // this.geometry.objRef!.attributes['scale'].needsUpdate = true
        }
    }


    getVertexShader() {
        return `
        attribute float scale;

        void main() {
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

            gl_PointSize = scale * ( 300.0 / - mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
        }
        `;
    }
    getFragmentShader() {
        return `
        uniform vec3 color;

        void main() {

            if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 )
                discard;

            gl_FragColor = vec4( color, 1.0 );

        }
        `;
    }

    getUniforms() {
        return  {
            color: {
                value: new Color(0xffffff)
            }
        }
    }

    onBeforeRender(state: RenderState) {
        if(this.geometry) {
            const positions: any = this.geometry.objRef!.attributes['position'].array;
            const scales: any = this.geometry.objRef!.attributes['scale'].array;

            const SEPARATION = this.config.unit.padding;
            const AMOUNTX = this.config.size.x;
            const AMOUNTY = this.config.size.y;

            let i = 0, j = 0;

            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    positions[i + 1] =
                        (Math.sin((ix + this.config.animation.count) * 0.3) * this.config.animation.amplitude) +
                        (Math.sin((iy + this.config.animation.count) * 0.5) * this.config.animation.amplitude)
                    scales[j] =
                        (Math.sin((ix + this.config.animation.count) * 0.3) + 1) * this.config.animation.inflate +
                        (Math.sin((iy + this.config.animation.count) * 0.5) + 1) * this.config.animation.inflate;

                    i += 3;
                    j++;
                }
            }

            this.geometry.objRef!.attributes['position'].needsUpdate = true;
            this.geometry.objRef!.attributes['scale'].needsUpdate = true;
        }

        this.config.animation.count += this.config.animation.speed;
    }
}
