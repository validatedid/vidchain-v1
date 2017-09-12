import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import CONSTANTS from "../../constants";
declare var cordova: any;

@Component({
  selector: 'page-dni-login',
  templateUrl: 'dniLogin.html'
})
export class DniLoginPage implements OnInit{

  private formGroup : FormGroup;
  public showButton = true;
  public textLoading;
  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private newAttributesService : NewAttributeService) {
  }

  ngOnInit(){
    this.formGroup = this.formBuilder.group({
      code: ['',[Validators.required,Validators.minLength(6)]],
    });

  }
  closeModal(){
    if (typeof cordova !== 'undefined') {
      cordova.plugins.DniScanner.resetUsingNFC();
    }
    this.viewCtrl.dismiss();
  }

  getDataDni(){
    let vm = this;
    if (typeof cordova !== 'undefined') {
      // vm.newAttributesService.showLoading("");
      this.showButton = false;
      vm.textLoading = "Waiting to receive DNIe data, don't separate the DNIe please";
      cordova.plugins.DniScanner.scanDNI(this.formGroup.value.code,function (val) {
        console.log(val);
        try{
          let dniValues = JSON.parse(val);
          setTimeout(() =>{
            vm.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.DNI,dniValues,function () {
              vm.showButton = true;
              vm.closeModal();
            });
          });
        }
        catch(e){
          vm.resetInitPage();
          alert(val);
        }
      },function (error) {
        vm.showButton = true;
        alert(error);
        vm.resetInitPage();
        console.log(error);
      })
    }
    else{
      vm.showButton = false;
      console.log("Cordova isn't loaded",this.formGroup);
    }
  }

  resetInitPage = function () {
    this.formGroup.reset()
    this.textLoading = "";
  }
}
