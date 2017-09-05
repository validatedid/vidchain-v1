import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, NavParams, ViewController} from "ionic-angular";
import {ValidateService} from "../validate/validate.service";
import {ValidatePage} from "../validate/validate";
import moment from 'moment';

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
