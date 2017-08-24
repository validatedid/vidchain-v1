import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, NavParams, ViewController} from "ionic-angular";
import {ValidateService} from "../validate/validate.service";
import {ValidatePage} from "../validate/validate";
import moment from 'moment';

@Component({
  selector: 'page-info-attributtes',
  templateUrl: 'infoAttributes.html'
})
export class InfoAttributesPages implements OnInit,OnDestroy {
  private info;
  private attributedValidatedEmitter;
  public key;
  public index;
  public timeToValidate;
  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              private validateService : ValidateService) {
    this.info = params.get('info');
    this.key = params.get('key');
    this.index = params.get('index');

    if(!this.info.validated){
      this.timeToValidate= this.validateService.checkValidation(this.info.timeToValidate);
      if(this.timeToValidate != 'expired' ){
        this.checkValidationInterval();
      }
    }
  }
  ngOnInit(){
    this.attributedValidatedEmitter = this.validateService.attributedValidated.subscribe((val)=>{
      this.info = val;
    });
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  openModalValidate() {
    let profileModal = this.modalCtrl.create(ValidatePage, { info: this.info,key:this.key,index:this.index});
    profileModal.onDidDismiss((data)=>{
      console.log("hola");
      let items = JSON.parse(localStorage.getItem('attributes')) || {};
      this.info = items[this.key][this.index];
      this.checkValidationInterval();
    });
    profileModal.present();
  }

  formatDate(value){
    if(value){
      return moment(value).format("DD/MM/YYYY - HH:mm:ss");
    }
    return "";
  }
  checkValidationInterval(){
    let interval = 1000;
    let vm = this;
    setTimeout(function(){
      vm.timeToValidate = vm.validateService.checkValidation(vm.info.timeToValidate);
      if(vm.timeToValidate != 'expired'){
        vm.checkValidationInterval();
      }
    }, interval);
  }
  ngOnDestroy(){
    this.attributedValidatedEmitter.unsubscribe();

  }
}
