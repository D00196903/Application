import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRosterPageRoutingModule } from './add-roster-routing.module';

import { AddRosterPage } from './add-roster.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRosterPageRoutingModule
  ],
  declarations: [AddRosterPage]
})
export class AddRosterPageModule {}
