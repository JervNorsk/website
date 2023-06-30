import {RenderState} from "ngx-three";
import {JnThSceneProps} from "../scenes/jn-th-scene.component";
import {Object3D, PerspectiveCamera, Texture} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export interface JnThAssetProps<I> {
    instance?: I,
    url: string
}

export interface JnThObjectProps<I> {
    instance?: I,
    controls?: OrbitControls
    assets?: {
        maps?: {
            [p: string]: JnThAssetProps<Texture>
        }
    }
}

export interface JnThObject<I> extends JnThObjectProps<I> {

    thOnInit({engine, scene}: JnThSceneProps): void;

    thOnUpdate({engine, delta}: RenderState): void;
}
