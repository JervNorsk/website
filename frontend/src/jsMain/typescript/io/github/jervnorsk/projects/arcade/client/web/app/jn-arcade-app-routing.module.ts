import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { JnArcadeApp } from './jn-arcade-app.component';
import {JnArcadeGamePong} from "../games/pong/jn-arcade-game-pong.component";

const routes: Routes = [
    {
        path: '',
        component: JnArcadeApp,
        children: [
            {
                path: 'games',
                children: [
                    {
                        path: 'pong',
                        component: JnArcadeGamePong
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JnArcadeAppRoutingModule {
}
