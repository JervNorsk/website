import {NgModule} from "@angular/core";
import {NgxThreeModule} from "ngx-three";
import {ThPrefabGrid} from "./prefabs/grid/th-prefab-grid.component";
import {ThPrefabWave} from "./prefabs/wave/th-prefab-wave.component";
import {ThPrefabPanoramaVR} from "./prefabs/panorama/th-prefab-panorama-vr.component";

@NgModule({
    declarations: [
        ThPrefabGrid,
        ThPrefabWave,
        ThPrefabPanoramaVR
    ],
    imports: [
        NgxThreeModule
    ],
    exports: [
        NgxThreeModule,
        ThPrefabGrid,
        ThPrefabWave,
        ThPrefabPanoramaVR,
    ],
    providers: []
})
export class JnThreeModule {}
