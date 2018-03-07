import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable, Injector } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';

// import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import {DniLoginPage} from "../pages/dniLogin/dniLogin";
import {ChangeAttributesPage} from "../pages/changeAttributes/changeAttributes";
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook'
import { GooglePlus } from '@ionic-native/google-plus';
import { Firebase } from '@ionic-native/firebase';

import { Pro } from '@ionic/pro';


Pro.init('be81b42c', {
  appVersion: '0.0.1'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

firebase.initializeApp({
  apiKey: "AIzaSyArZO4J9BfAbopPv8AHJOKCCgGehfo-JyE",
  authDomain: "vidchainapp-6854f.firebaseapp.com",
  databaseURL: "https://vidchainapp-6854f.firebaseio.com",
  projectId: "vidchainapp-6854f",
  storageBucket: "vidchainapp-6854f.appspot.com",
  messagingSenderId: "938949312980"
});

// const cloudSettings: CloudSettings = {
//   'core': {
//     'app_id': '2fad95ab'
//   },
//   'auth': {
//     'facebook': {
//       'scope': ['user_about_me','email','public_profile','user_birthday','user_hometown']
//     }
//   },
//   'push': {
//     'sender_id': '636222461475',
//     'pluginConfig': {
//       'ios': {
//         'badge': true,
//         'sound': true
//       },
//       'android': {
//         'iconColor': '#343434',
//         'forceShow': false,
//         'sound': true,
//         'vibrate' : true
//       }
//     }
//   }
// };

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
    ChangeAttributesPage,
    CapitalizePipe,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {

    }),
    // CloudModule.forRoot(cloudSettings)
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
    DniLoginPage,
    ChangeAttributesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    NewAttributeService,
    ValidateService,
    Facebook,
    GooglePlus,
    Firebase,
    InAppBrowser,
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }]
  ]
})
export class AppModule {}
