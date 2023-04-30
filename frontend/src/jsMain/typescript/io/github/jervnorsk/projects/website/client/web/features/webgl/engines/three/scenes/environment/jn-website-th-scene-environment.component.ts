import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    JnThScene
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";

@Component({
    selector: 'jn-website-th-scene-environment',
    templateUrl: './jn-website-th-scene-environment.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneEnvironment extends JnThScene {

    protected readonly Math = Math;
}
