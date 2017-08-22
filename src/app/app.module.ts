import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { InfoAttributesPages } from '../pages/infoAttributes/infoAttributes';
import { ListPage } from '../pages/list/list';
import { NewAttributesPage } from "../pages/newAttributes/newAttributes";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {NewAttributeService} from "../pages/newAttributes/newAttributes.service";
import {CapitalizePipe} from "../pipes/CapitalizePipe";
import {KeysPipe} from "../pipes/KeysPipe";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    ListPage,
    InfoAttributesPages,
    NewAttributesPage,
    CapitalizePipe,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      platforms: {
        android: {
          tabsPlacement: 'top'
        },
        ios: {
          tabsPlacement: 'top'
        },
        windows: {
          tabsPlacement: 'top'
        }
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    ListPage,
    InfoAttributesPages,
    NewAttributesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    NewAttributeService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
