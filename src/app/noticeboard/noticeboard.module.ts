import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoticeboardPageRoutingModule } from './noticeboard-routing.module';

import { NoticeboardPage } from './noticeboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoticeboardPageRoutingModule
  ],
  declarations: [NoticeboardPage]
})
export class NoticeboardPageModule {}
