import {NgModule} from "@angular/core";
import {NgxThreeModule} from "ngx-three";
import {ThPrefabGrid} from "./prefabs/grid/th-prefab-grid.component";
import {ThPrefabWave} from "./prefabs/wave/th-prefab-wave.component";

@NgModule({
    declarations: [
        ThPrefabGrid,
        ThPrefabWave
    ],
    imports: [
        NgxThreeModule
    ],
    exports: [
        NgxThreeModule,
        ThPrefabGrid,
        ThPrefabWave
    ],
    providers: []
})
export class JnThreeModule {}
