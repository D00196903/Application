import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticeboardPage } from './noticeboard.page';

const routes: Routes = [
  {
    path: '',
    component: NoticeboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticeboardPageRoutingModule {}
