import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
import {ValidatePage} from "../pages/validate/validate";
import {SendAttributesPage} from "../pages/sendAttributes/sendAttributes";
import {ValidateService} from "../pages/validate/validate.service";
import {HttpModule} from "@angular/http";
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import {DniLoginPage} from "../pages/dniLogin/dniLogin";
// import { Facebook } from '@ionic-native/facebook';
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '2fad95ab'
  },
  'auth': {
    'facebook': {
      'scope': ['user_about_me','email','public_profile','user_birthday','user_hometown']
    }
  },
  'push': {
    'sender_id': '636222461475',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434',
        'forceShow': false,
        'sound': true,
        'vibrate' : true
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    ListPage,
    InfoAttributesPages,
    NewAttributesPage,
    ValidatePage,
    SendAttributesPage,
    DniLoginPage,
    CapitalizePipe,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {

    }),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    ListPage,
    InfoAttributesPages,
    NewAttributesPage,
    ValidatePage,
    SendAttributesPage,
    DniLoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    // Facebook,
    NewAttributeService,
    ValidateService,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
