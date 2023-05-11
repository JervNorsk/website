import {Component, Input, ViewEncapsulation} from "@angular/core";

@Component({
    selector: 'jn-stack',
    templateUrl: './jn-stack.component.html',
})
export class JnStack {

    @Input()
    content?: any
    get stackStyle(): string {
        return `--jn-stack-number: ${this.stackNumberArray.length}`
    }
    @Input()
    stackNumber?: number;
    get stackNumberArray(): number[] {
        // return Array(this.stackNumber || 1).fill(0).map((it, index) => index);
        return Array(1).fill(0).map((it, index) => index);
    }
    stackSpanStyle(index: number): string {
        return `--jn-index: ${index}`
    }
    hotfix: number;

    constructor() {
        this.hotfix = ((min, max) => Math.floor(Math.random() * (max - min)) + min)
        (1, 3)
    }
}
