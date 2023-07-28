import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'integrations',
        children: [
          {
            path: 'pcg',
            children: [
              {
                path: 'streaming',
                loadChildren: () => import('@jervnorsk/pcg-streaming-extension').then(it => it.PcgSeApiModule)
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class JnWebsiteIntegrationPcgSeRoutingModule {
}
