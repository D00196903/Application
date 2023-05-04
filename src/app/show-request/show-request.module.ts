import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowRequestPageRoutingModule } from './show-request-routing.module';

import { ShowRequestPage } from './show-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowRequestPageRoutingModule
  ],
  declarations: [ShowRequestPage]
})
export class ShowRequestPageModule {}
