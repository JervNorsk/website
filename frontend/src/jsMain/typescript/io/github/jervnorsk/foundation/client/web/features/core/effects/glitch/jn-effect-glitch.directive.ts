import {Component, Directive, ElementRef, HostBinding, ViewEncapsulation} from "@angular/core";

@Directive({
    selector: '[jn-effect-glitch]'
})
export class JnEffectGlitch {

    @HostBinding('class')
    elementClass = 'jn-effect-glitch';
}
