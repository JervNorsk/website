import {ThCamera, ThCanvas, ThGroup, ThScene} from "ngx-three";
import {Component, ComponentRef, ContentChild, ViewChild} from "@angular/core";

@Component({
    template: ''
})
export class JnThPrefab extends ThGroup {

    @ViewChild(ThGroup, {static: true})
    protected group?: ThGroup

    override ngOnInit() {
        super.ngOnInit();

        if(this.group) {
            this.group.objRef = this.objRef;
        }
    }
}
