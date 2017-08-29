import { Component ,OnInit , OnDestroy} from '@angular/core';
import {AlertController, ModalController} from "ionic-angular";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import {ValidateService} from "../validate/validate.service";
import Constants from "../../constants";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage implements OnInit,OnDestroy{

  private newAttributesEmitter;
  private attributedValidatedEmitter;
  public availablesEmptyGroups : Array<string>;
  constructor(public modalCtrl: ModalController,
              private validateService: ValidateService,
              private newAttributesService: NewAttributeService,
              public alertCtrl: AlertController) {

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
  ngOnDestroy(){
    this.newAttributesEmitter.unsubscribe();
    this.attributedValidatedEmitter.unsubscribe();
  }


}
