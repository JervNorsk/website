import {NgModule} from "@angular/core";
import {NgxThreeModule} from "ngx-three";
import {JnThGrid} from "./utils/grid/jn-th-grid.component";
import {JnThPrefabWavePoint} from "./prefabs/wave/jn-th-prefab-wave-point.component";

@NgModule({
    declarations: [
        JnThGrid,
        JnThPrefabWavePoint
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------

        // Lib
        // -------------------------------------------------------------------------------------------------------------
        NgxThreeModule

        // Framework
        // -------------------------------------------------------------------------------------------------------------
    ],
    exports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnThGrid,
        JnThPrefabWavePoint,

        // Lib
        // -------------------------------------------------------------------------------------------------------------
        NgxThreeModule

        // Framework
        // -------------------------------------------------------------------------------------------------------------
    ],
    providers: []
})
export class JnThModule {
}
