import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRosterPage } from './add-roster.page';

const routes: Routes = [
  {
    path: '',
    component: AddRosterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRosterPageRoutingModule {}
