import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {JnStack} from "./components/utils/stack/jn-stack.component";
import {JnText} from "./components/utils/text/jn-text.component";
import {JnEffectGlitch} from "./effects/glitch/jn-effect-glitch.directive";
import {JnCoreRoutingModule} from "./jn-core-routing.module";
import {JnErrorNotImplemented} from "./components/errors/jn-error-not-implemented.component";
import {JnError} from "./components/errors/jn-error.component";
import {JnErrorNotFound} from "./components/errors/jn-error-not-found.component";
import {NgbAccordionBody} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [
        JnEffectGlitch,
        JnError,
        JnErrorNotFound,
        JnErrorNotImplemented,
        JnStack,
        JnText,
    ],
    imports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnCoreRoutingModule,

        // Lib
        // -------------------------------------------------------------------------------------------------------------

        // Framework
        // -------------------------------------------------------------------------------------------------------------
        CommonModule,
    ],
    exports: [
        // Module
        // -------------------------------------------------------------------------------------------------------------
        JnEffectGlitch,
        JnError,
        JnErrorNotFound,
        JnErrorNotImplemented,
        JnStack,
        JnText,

        // Lib
        // -------------------------------------------------------------------------------------------------------------

        // Framework
        // -------------------------------------------------------------------------------------------------------------
        CommonModule,
        HttpClientModule,
    ],
    providers: []
})
export class JnCoreModule {
}
