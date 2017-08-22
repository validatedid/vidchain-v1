import { Component ,OnInit , OnDestroy} from '@angular/core';
import {ModalController} from "ionic-angular";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import {ValidateService} from "../validate/validate.service";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage implements OnInit,OnDestroy{

  private newAttributesEmitter;
  private attributedValidatedEmitter;
  constructor(public modalCtrl: ModalController,
              private validateService: ValidateService,
              private newAttributesService: NewAttributeService,) {
  }

  ngOnInit(){
    this.newAttributesEmitter = this.newAttributesService.attributeAddEmitter.subscribe((val)=>{
      this.items = JSON.parse(localStorage.getItem('attributes')) || {};
    })
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
    console.log(key);
    this.items[key].splice(i, 1);
    localStorage.setItem('attributes',JSON.stringify(this.items));
  }
  ngOnDestroy(){
    this.newAttributesEmitter.unsubscribe();
    this.attributedValidatedEmitter.unsubscribe();
  }


}
