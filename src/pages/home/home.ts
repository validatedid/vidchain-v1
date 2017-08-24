import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, FabContainer, ModalController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
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
}
