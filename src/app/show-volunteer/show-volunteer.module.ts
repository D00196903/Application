import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowVolunteerPageRoutingModule } from './show-volunteer-routing.module';

import { ShowVolunteerPage } from './show-volunteer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowVolunteerPageRoutingModule
  ],
  declarations: [ShowVolunteerPage]
})
export class ShowVolunteerPageModule {}
