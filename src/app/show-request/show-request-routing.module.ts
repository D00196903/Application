import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowRequestPage } from './show-request.page';

const routes: Routes = [
  {
    path: '',
    component: ShowRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowRequestPageRoutingModule {}
