import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IosPageRoutingModule } from './ios-routing.module';

import { IosPage } from './ios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IosPageRoutingModule
  ],
  declarations: [IosPage]
})
export class IosPageModule {}
