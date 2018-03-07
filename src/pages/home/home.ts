import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, FabContainer, ModalController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";
//import { FacebookAuth, Auth, User } from '@ionic/cloud-angular';
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import CONSTANTS from "../../constants";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
import {DniLoginPage} from "../dniLogin/dniLogin";
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private facebook: Facebook,
              private googlePlus: GooglePlus,
              // public auth: Auth,
              // public user: User,
              public newAttributesService : NewAttributeService
              ) {

          // console.log(user);
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
    let vm = this;
    this.googlePlus.login({
      'webClientId': '938949312980-f79pafv92qqtr45i7f72orhv8ig0kq3v.apps.googleusercontent.com',
      'offline': true
    }).then(function (profile){
      if(profile){
        vm.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.GOOGLE,profile);
        this.googlePlus.logout();
      }
    }).catch(err => console.error(err));

    /***** USO DE FIREBASE (levanta la APP en al web) *****/
    /*
    let vm = this;
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        vm.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.GOOGLE,result);
      }).catch(function(error) {
        alert(error.message);
      });
    });
    */
  }

  loginDni(fab){
    fab.close();
    let dniPageModal = this.modalCtrl.create(DniLoginPage);
    dniPageModal.present();

  }

  loginFacebook(fab){
    fab.close();
    let vm = this;
    try{
      /* ****** USO DE LA API (levanta la APP del movil)*****/
      this.facebook.login(['public_profile', 'email']).then( (response) => {
      this.facebook.api("/me?fields=name,gender,picture.type(large),email,birthday",['public_profile', 'email']) 
      .then(function(profile) {
        if(profile){
          vm.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.FACEBOOK,profile);
          vm.facebook.logout();
        }
      });
    }).catch((error) => {
      alert("ERROR 1: " + JSON.stringify(error));
      console.log(error) 
    });
    }catch(e)
    {
      alert("ERROR 2: " + e);
    }


    /* ****** USO DE FIREBASE *****/
    /*
    let vm = this;
    let provider = new firebase.auth.FacebookAuthProvider();
    //provider.addScope('user_birthday');
    //Operación con PopUp no soportada
    //firebase.auth().signInWithPopup(provider).then(function(result) {
    firebase.auth().signInWithRedirect(provider).then(function() {
      firebase.auth().getRedirectResult().then(function(result) {
        vm.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.FACEBOOK,result);
      }).catch(function(error) {
        alert(error.message);
      });
    });
    */
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
