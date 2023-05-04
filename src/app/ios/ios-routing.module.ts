import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IosPage } from './ios.page';

const routes: Routes = [
  {
    path: '',
    component: IosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IosPageRoutingModule {}
