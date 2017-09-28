import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, FabContainer, ModalController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";
import { FacebookAuth, Auth, User } from '@ionic/cloud-angular';
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import CONSTANTS from "../../constants";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
import {DniLoginPage} from "../dniLogin/dniLogin";



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
              // public fb : Facebook
              public facebookAuth: FacebookAuth,
              ) {

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

  loginDni(fab){
    fab.close();
    let dniPageModal = this.modalCtrl.create(DniLoginPage);
    dniPageModal.present();

  }
  // loginFacebook(fab){
  //   fab.close();
  //   let vm = this;

  //   this.fb.login(['user_about_me','email','public_profile','user_birthday','user_hometown'])
  //       .then((res) => {
  //           console.log('Logged into Facebook!', res);
  //            this.fb.api("/me?fields=name,gender,email,birthday",['user_about_me','email','public_profile','user_birthday','user_hometown'])
  //             .then(function(profile) {
  //               vm.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.FACEBOOK,profile);
  //               vm.fb.logout();
  //             });
  //         })
  //       .catch(e => console.log('Error logging into Facebook', e));
  // }

  loginFacebook(fab){
    fab.close();

    try{
      this.facebookAuth.logout();
      this.auth.logout();
    }
    catch (ex){}

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
        let prefix = attributes['photo'][0].source === CONSTANTS.SOCIAL_LOGINS.DNI? 'data:image/jpeg;base64,' : '';
        let value = prefix+attributes['photo'][0].value;
        return 'url('+value+')';
      }
    }
    return '';
  }
  openTab(){
    let newAttributesModal = this.modalCtrl.create(InfoAttributesPages,{type:'Email'});

  }
}
