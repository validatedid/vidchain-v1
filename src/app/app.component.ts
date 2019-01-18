import {Component, OnDestroy, ViewChild} from '@angular/core';
import { ModalController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import Constants from "../constants";
// import {Push, PushToken} from '@ionic/cloud-angular';
import {NewAttributeService} from "../pages/newAttributes/newAttributes.service";
import {ChangeAttributesPage} from "../pages/changeAttributes/changeAttributes";
import { Firebase } from '@ionic-native/firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy{
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pushNotificationSubscribe;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              // public push: Push,
              public firebase: Firebase,
              public newAttributeService : NewAttributeService,
              public modalCtrl: ModalController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];





  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {

        // this.push.register().then((t: PushToken) => {
        //   return this.push.saveToken(t);
        // }).then((t: PushToken) => {
        //   console.log('Token saved:', t.token);
        // });

      //   this.pushNotificationSubscribe = this.push.rx.notification()
      //       .subscribe((msg) => {
      //         let alert = this.modalCtrl.create(ChangeAttributesPage,{
      //           title: 'Education Title',
      //           message: 'The ' +msg.raw.additionalData.payload.requester.name+' want to send to you a '+
      //           msg.raw.additionalData.payload.attribute+' education, do you want to save this education?',
      //           image : msg.raw.additionalData.payload.requester.image,
      //           callback: () =>{
      //             this.newAttributeService.createNewEducation(msg);
      //         }});
      //         alert.present();
      //       });
      //
      }

      this.firebase.onTokenRefresh().subscribe(function(token){
      });
      let vm = this;
      this.firebase.onNotificationOpen().subscribe(function(notification){
          try{
              let body = JSON.parse(notification.body);
              let modal = vm.modalCtrl.create(ChangeAttributesPage,{
                title: notification.title,
                message: body.message,
                image : body.payload.requester.image,
                callback: () =>{
                  switch (body.payload.requester.id){
                    case "2":
                      vm.newAttributeService.createNewEducation(body.payload);
                      break;
                    case "3":
                      vm.newAttributeService.createNewProfession(body.payload);
                      break;
                  }
                }
              });
              modal.present();
          }catch(e){alert(e)}
      });

    });
    //check if exist default attributes
    let attributes = JSON.parse(localStorage.getItem('attributes'));
    if(!attributes){
      attributes = {};
    }
    for(let groupAttr of Constants.AVAILABLES_EMPTY_GROUPS){
      if(!attributes[groupAttr]){
        attributes[groupAttr]=[];
      }
    }
    localStorage.setItem('attributes',JSON.stringify(attributes));

    // Initialize settings
    let settings = JSON.parse(localStorage.getItem('settings'));

    if(!settings){
      settings = {}

      let defaultSettings = Object.keys(Constants.DEFAULT_SETTINGS);
    
      if(defaultSettings){
        for(let settingsElement of defaultSettings){
          if(!settings[settingsElement]){
            settings[settingsElement] = Constants.DEFAULT_SETTINGS[settingsElement];
          }
        }
      
        localStorage.setItem('settings',JSON.stringify(settings));
      }
    }
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  ngOnDestroy(){
    this.pushNotificationSubscribe.unsubscribe();
  }
}
