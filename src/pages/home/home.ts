import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, FabContainer, ModalController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";
import { FacebookAuth, Auth, User } from '@ionic/cloud-angular';


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
              public facebookAuth: FacebookAuth) {



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
  loginGoogle(){
    this.auth.login('google').then();
  }
  loginFacebook(){
    this.facebookAuth.login().then( val =>{
      console.log(val);
    }).catch(err =>{
      console.log(err);
    });

  }
}
