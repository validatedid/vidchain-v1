import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacialBiometricsPage } from './facial-biometrics';

@NgModule({
  declarations: [
    FacialBiometricsPage,
  ],
  imports: [
    IonicPageModule.forChild(FacialBiometricsPage),
  ],
})
export class FacialBiometricsPageModule {}
