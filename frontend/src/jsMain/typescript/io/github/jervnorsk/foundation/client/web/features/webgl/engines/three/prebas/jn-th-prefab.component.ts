import {ThCamera, ThCanvas, ThGroup, ThScene} from "ngx-three";
import {Component, ComponentRef, ContentChild, ViewChild} from "@angular/core";
import {JnThComponent} from "../common/jn-th-component";

@Component({
    template: ''
})
export abstract class JnThPrefabComponent extends ThGroup implements JnThComponent {

    @ViewChild(ThGroup, {static: true})
    protected group?: ThGroup

    override ngOnInit() {
        super.ngOnInit();

        if(this.group) {
            this.group.objRef = this.objRef;
        }

        this.thOnInitDOM();
    }

    ngAfterViewInit(): void {
        this.thOnInitPrefab();
    }

    thOnInitDOM() {}

    abstract thOnInitPrefab(): void;
}
