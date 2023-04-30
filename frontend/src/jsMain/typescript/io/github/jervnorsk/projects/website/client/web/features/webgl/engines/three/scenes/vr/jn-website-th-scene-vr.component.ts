import {ChangeDetectionStrategy, Component} from '@angular/core';
import {
    JnThScene
} from "../../../../../../../../../../foundation/client/web/features/webgl/engines/three/scenes/jn-th-scene.component";

@Component({
    selector: 'jn-website-th-scene-vr',
    templateUrl: './jn-website-th-scene-vr.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JnWebsiteThSceneVR extends JnThScene {

    protected readonly Math = Math;
}
