import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JnStreamingSceneMain} from "./scenes/main/jn-streaming-scene-main.component";
import {JnStreamingSceneGameLozTok} from "./scenes/games/loz/tok/jn-streaming-scene-game-loz-tok.component";

const routes: Routes = [
    {
        path: 'scenes',
        children: [
            {
                path: 'main',
                component: JnStreamingSceneMain
            },
            {
                path: 'games',
                children: [
                    {
                        path: 'loz',
                        children: [
                            {
                                path: 'tok',
                                component: JnStreamingSceneGameLozTok,
                                // children: [
                                //     {
                                //         path: "shaders",
                                //         redirectTo: ''
                                //     }
                                // ]
                            }
                        ]
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
export class JnStreamingAppRoutingModule {
}
