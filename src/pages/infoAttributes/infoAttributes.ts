import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
@Component({
  selector: 'page-info-attributtes',
  templateUrl: 'infoAttributes.html'
})
export class InfoAttributesPages implements OnInit{
  public text;
  public type;
  public timeToValidate;
  constructor(public params: NavParams,
              public viewCtrl: ViewController,) {
    this.text = params.get('text');
    this.type = params.get('type') || 'attributes';

  }
  ngOnInit(){


  }
  closeModal(){
    this.viewCtrl.dismiss();
  }


}
