import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";


@Component({
  selector: 'page-info-attributtes',
  templateUrl: 'infoAttributes.html'
})
export class InfoAttributesPages {
  private info;

  constructor(public params: NavParams,
              public viewCtrl: ViewController) {
    this.info = params.get('info');
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
}
