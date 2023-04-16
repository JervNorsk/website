import {NgModule} from "@angular/core";
import {NgxThreeModule} from "ngx-three";
import {ThSceneEnvironment} from "./scenes/environment/th-scene-environment.component";
import {ThPrefabGrid} from "./prefabs/grid/th-prefab-grid.component";

@NgModule({
    declarations: [
        ThSceneEnvironment,
        ThPrefabGrid
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
