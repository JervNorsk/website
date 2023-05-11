import {NgModule} from "@angular/core";
import {NgxThreeModule} from "ngx-three";
import {ThExampleWave} from "./examples/wave/th-example-wave.component";
import {JnThScene} from "./scenes/jn-th-scene.component";
import {ThExampleVRPanorama} from "./examples/vr/panorama/th-prefab-panorama-vr.component";
import {JnThGrid} from "./utils/grid/jn-th-grid.component";
import {JnThPrefab} from "./prebas/jn-th-prefab.component";

@NgModule({
    declarations: [
        JnThScene,
        JnThPrefab,
        JnThGrid,
        ThExampleWave,
        ThExampleVRPanorama
    ],
    imports: [
        NgxThreeModule
    ],
    exports: [
        NgxThreeModule,
        JnThScene,
        JnThPrefab,
        JnThGrid,
        ThExampleWave,
        ThExampleVRPanorama,
    ],
    providers: []
})
export class JnThreeModule {
}
