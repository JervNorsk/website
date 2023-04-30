import {NgModule} from "@angular/core";
import {NgxThreeModule} from "ngx-three";
import {ThPrefabGrid} from "./prefabs/grid/th-prefab-grid.component";
import {ThPrefabWave} from "./prefabs/wave/th-prefab-wave.component";
import {ThPrefabPanoramaVR} from "./prefabs/panorama/th-prefab-panorama-vr.component";
import {JnThScene} from "./scenes/jn-th-scene.component";

@NgModule({
    declarations: [
        JnThScene,
        ThPrefabGrid,
        ThPrefabWave,
        ThPrefabPanoramaVR
    ],
    imports: [
        NgxThreeModule
    ],
    exports: [
        NgxThreeModule,
        JnThScene,
        ThPrefabGrid,
        ThPrefabWave,
        ThPrefabPanoramaVR,
    ],
    providers: []
})
export class JnThreeModule {}
