import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowVolunteerPage } from './show-volunteer.page';

const routes: Routes = [
  {
    path: '',
    component: ShowVolunteerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowVolunteerPageRoutingModule {}
