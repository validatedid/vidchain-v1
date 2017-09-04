import { Component ,OnInit , OnDestroy} from '@angular/core';
import {AlertController, ModalController} from "ionic-angular";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import {ValidateService} from "../validate/validate.service";
import Constants from "../../constants";
import moment from 'moment';
import {ValidatePage} from "../validate/validate";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage implements OnInit,OnDestroy{

  private newAttributesEmitter;
  private attributedValidatedEmitter;
  public listOpened={
    group:-1,
    item:-1
  };
  public availablesEmptyGroups : Array<string>;
  constructor(public modalCtrl: ModalController,
              private validateService: ValidateService,
              private newAttributesService: NewAttributeService,
              public alertCtrl: AlertController,
              private iab: InAppBrowser) {

    this.availablesEmptyGroups = Constants.AVAILABLES_EMPTY_GROUPS;
  }

  ngOnInit(){
    this.newAttributesEmitter = this.newAttributesService.attributeAddEmitter.subscribe((val)=>{
      this.items = JSON.parse(localStorage.getItem('attributes')) || {};
    });
    this.attributedValidatedEmitter = this.validateService.attributedValidated.subscribe((val)=>{
      this.items = JSON.parse(localStorage.getItem('attributes')) || {};
    });
  }

  items = JSON.parse(localStorage.getItem('attributes')) || {};

  openModal(val,key,index) {
    let profileModal = this.modalCtrl.create(InfoAttributesPages, { info: val,key:key,index:index});

    profileModal.present();
  }
  removeItem(key,i){
    this.items[key].splice(i, 1);
    localStorage.setItem('attributes',JSON.stringify(this.items));
  }
  checkShowDivider(group){
    let indexPosibleGroup =this.availablesEmptyGroups.indexOf(group);
    return (this.items[group].length > 0 || indexPosibleGroup > -1);
  }
  alertValidate(){
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: 'this attribute is not validate',
      buttons: ['OK']
    });
    alert.present();
  }

  openList(i,i2){
    if(this.listOpened.group == i && this.listOpened.item == i2){
      i=-1;i2=-1;
    }
    this.listOpened={
      group:i,
      item:i2
    };
  }
  formatDate(value){
    if(value){
      return moment(value).format("DD/MM/YYYY - HH:mm:ss");
    }
    return "";
  }
  openModalValidate(item,index) {
    let profileModal = this.modalCtrl.create(ValidatePage, { info: item,key:item.key,index:index});
    profileModal.onDidDismiss((data)=>{
      this.items = JSON.parse(localStorage.getItem('attributes')) || {};
    });
    profileModal.present();
  }
  openInAppBrowser(url){
    let browser = this.iab.create(url, '_blank', 'location=no');
    browser.show();
  }
  ngOnDestroy(){
    this.newAttributesEmitter.unsubscribe();
    this.attributedValidatedEmitter.unsubscribe();
  }


}
