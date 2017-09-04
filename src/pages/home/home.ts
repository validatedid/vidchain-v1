import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, FabContainer, ModalController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";
import { FacebookAuth, Auth, User } from '@ionic/cloud-angular';
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import CONSTANTS from "../../constants";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public auth: Auth,
              public user: User,
              public newAttributesService : NewAttributeService,
              public facebookAuth: FacebookAuth) {

          console.log(user);

  }

  ionViewWillEnter() { // THERE IT IS!!!
    this.content._elementRef.nativeElement.childNodes[1].classList.add("no-header")
  }

  notImplemented(fab: FabContainer){
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: 'not implemented',
      buttons: ['OK']
    });
    alert.present();
    fab.close();
  }

  newAttributesPage(fab: FabContainer,type){
    fab.close();
    let newAttributesModal = this.modalCtrl.create(NewAttributesPage,{type:type});
    newAttributesModal.present();
  }
  loginGoogle(fab){
    fab.close();
    this.auth.login('google').then(val =>{
      this.user.load().then(val =>{
        this.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.GOOGLE,this.user);
        this.auth.logout();
      })
    });
  }
  loginFacebook(fab){
    fab.close();

    this.auth.login('facebook').then( val =>{
      this.user.load().then(val =>{
        this.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.FACEBOOK,this.user);
        this.auth.logout();
      })
    }).catch(err =>{
      console.log(err);
    });
  }

  checkImageAvatar(){
    let attributes = this.newAttributesService.getListAttribute();
    if(attributes['photo']){
      if(attributes['photo'].length>0){
        let value = attributes['photo'][0].value;
        return 'url('+value+')';
      }
    }

    return '';
  }

}
