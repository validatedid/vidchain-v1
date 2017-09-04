import {Component, OnDestroy, ViewChild} from '@angular/core';
import {AlertController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import Constants from "../constants";
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
import {NewAttributeService} from "../pages/newAttributes/newAttributes.service";

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
              public push: Push,
              public newAttributeService : NewAttributeService,
              private alertCtrl: AlertController) {
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

        this.push.register().then((t: PushToken) => {
          return this.push.saveToken(t);
        }).then((t: PushToken) => {
          console.log('Token saved:', t.token);
        });

        this.pushNotificationSubscribe = this.push.rx.notification()
            .subscribe((msg) => {
              // alert(msg.title + ': ' + msg.text);
              let alert = this.alertCtrl.create({
                title: 'Education Title',
                message: 'The ' +msg.raw.additionalData.payload.requester.name+' want to send to you a '+
                msg.raw.additionalData.payload.attribute+' education, do you want to save this education?',
                buttons: [
                  {
                    text: 'No',
                    role: 'No',
                  },
                  {
                    text: 'Yes',
                    handler: () => {
                      this.generateNewEducation(msg);
                    }
                  }
                ]
              });
              alert.present();
            });

      }

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
  }

  generateNewEducation(msg){
    let obj = this.newAttributeService.createNewAttribute({
      'key':'education',
      'value':msg.raw.additionalData.payload.attribute,
      'validated': true,
      'source': msg.raw.additionalData.payload.requester.name
    });
    let listValues = this.newAttributeService.getListAttribute();
    let index = this.newAttributeService.searchAttribute(listValues['education'],obj.value);
    if(index > -1){
      if(listValues['education'][index].source === obj.source){
        this.alertCtrl.create({title: 'You already have this education', buttons: [{text: 'Ok'},]}).present();
      }
      else{
        this.newAttributeService.saveAttributeWithEthereum(obj).then(val=>{
          listValues['education'].push(val);
          this.newAttributeService.saveAttributes(listValues);
          this.alertCtrl.create({title: 'Education Sync Done', buttons: [{text: 'Ok'},]}).present();
        })
      }
    }
    else{
      this.newAttributeService.saveAttributeWithEthereum(obj).then(val=>{
        listValues['education'].push(val);
        this.newAttributeService.saveAttributes(listValues);
        this.alertCtrl.create({title: 'Education Sync Done', buttons: [{text: 'Ok'},]}).present();
      })
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
