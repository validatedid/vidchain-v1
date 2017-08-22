import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {ValidateService} from "../validate/validate.service";

@Component({
  selector: 'page-info-attributtes',
  templateUrl: 'infoAttributes.html'
})
export class InfoAttributesPages {
  private info;
  public timeToValidate;
  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              private validateService : ValidateService) {
    this.info = params.get('info');
    if(!this.info.validated){
      this.timeToValidate= this.validateService.checkValidation(this.info.timeToValidate);
      if(this.timeToValidate != 'expired' ){
        this.checkValidationInterval();
      }
    }
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }

  checkValidationInterval(){
    let interval = 1000;
    let vm = this;
    setInterval(function(){
      vm.timeToValidate = vm.validateService.checkValidation(vm.info.timeToValidate);
      if(vm.timeToValidate != 'expired'){
        vm.checkValidationInterval();
      }
    }, interval);

  }
}
