import {Component, ViewChild} from '@angular/core';
import {Content, ModalController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  constructor(public modalCtrl: ModalController) {
    console.log(this.content)
  }

  ionViewWillEnter() { // THERE IT IS!!!
    this.content._elementRef.nativeElement.childNodes[1].classList.add("no-header")
  }

  notImplemented(){
    alert("not implemented");
  }

  newAttributesPage(){
    console.log("hola");
    let newAttributesModal = this.modalCtrl.create(NewAttributesPage);
    newAttributesModal.present();
  }
}
