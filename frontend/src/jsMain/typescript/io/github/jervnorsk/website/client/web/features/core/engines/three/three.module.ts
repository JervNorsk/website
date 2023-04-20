import {NgModule} from "@angular/core";
import {NgxThreeModule} from "ngx-three";
import {ThSceneEnvironment} from "./scenes/environment/th-scene-environment.component";
import {ThPrefabGrid} from "./prefabs/grid/th-prefab-grid.component";
import {ThPrefabWave} from "./prefabs/wave/th-prefab-wave.component";

@NgModule({
    declarations: [
        ThSceneEnvironment,
        ThPrefabGrid,
        ThPrefabWave
    ],
    imports: [
        NgxThreeModule
    ],
    exports: [
        NgxThreeModule,
        ThSceneEnvironment
    ],
    providers: []
})
export class ThreeModule {

}
