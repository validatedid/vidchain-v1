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
  public type;
  public index;
  public timeToValidate;
  constructor(public params: NavParams,
              public viewCtrl: ViewController,) {
    this.type = params.get('type');

  }
  ngOnInit(){


  }
  closeModal(){
    this.viewCtrl.dismiss();
  }


}
