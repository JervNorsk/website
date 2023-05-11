import {Component} from '@angular/core';
import {
    JnThPrefabWavePointProps
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/prefabs/wave/jn-th-prefab-wave-point.component";

@Component({
    selector: 'jn-streaming-th-prefab-wave-point',
    templateUrl: './jn-streaming-th-prefab-wave-point.component.html',
})
export class JnStreamingThPrefabWavePoints {

    wavePoint: JnThPrefabWavePointProps = {
        grid: {
            size: {
                x: 60,
                y: 60
            }
        },
        point: {
            geometry: {
                radius: 0.01
            }
        },
        animation: {
            wave: {
                height: 0.2,
                speed: 0.05
            },
            point: {
                inflate: 0.05
            },
            onRender: (it, props) => {
                const positions: any = props.points.objRef!.geometry.attributes['position'].array;
                const scales: any = props.points.objRef!.geometry.attributes['scale'].array;

                const AMOUNTX = props.grid!.size!.x;
                const AMOUNTY = props.grid!.size!.y;

                let i = 0, j = 0;

                for (let ix = 0; ix < AMOUNTX; ix++) {
                    for (let iy = 0; iy < AMOUNTY; iy++) {
                        positions[i + 1] =
                            (Math.sin((ix + props.animation!.frame!) * 0.3) * props.animation!.wave!.height!) +
                            (Math.sin((iy + props.animation!.frame!) * 0.5) * props.animation!.wave!.height!)
                        scales[j] =
                            (Math.sin((ix + props.animation!.frame!) * 0.3) + 1) * props.animation!.point!.inflate! +
                            (Math.sin((iy + props.animation!.frame!) * 0.5) + 1) * props.animation!.point!.inflate!;

                        i += 3;
                        j++;
                    }
                }

                props.points.objRef!.geometry.attributes['position'].needsUpdate = true;
                props.points.objRef!.geometry.attributes['scale'].needsUpdate = true;
            }
        }
    }
}
