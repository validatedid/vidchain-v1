import {Component, OnInit} from '@angular/core';
import {NavParams, ViewController, ModalController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import CONSTANTS from "../../constants";
import { FacialBiometricsPage } from "../facial-biometrics/facial-biometrics";
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
              private newAttributesService : NewAttributeService,
              public modalCtrl: ModalController) {
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
          let jsonDNIeValues = JSON.parse(val);
          setTimeout(() =>{
              let facialBiometricsPage = vm.modalCtrl.create(FacialBiometricsPage,{dniValues:jsonDNIeValues});
              facialBiometricsPage.present();
              vm.viewCtrl.dismiss();
              
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
    this.formGroup.reset();
    this.textLoading = "";
  }
}
