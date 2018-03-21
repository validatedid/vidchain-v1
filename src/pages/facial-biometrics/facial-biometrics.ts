import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import CONSTANTS from "../../constants";
import {ValidateService} from "../validate/validate.service";

/**
 * Generated class for the FacialBiometricsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-facial-biometrics',
  templateUrl: 'facial-biometrics.html',
})
export class FacialBiometricsPage {
  
  public base64Image="assets/img/empty_profile.png";
  public dnieBase64Image="assets/img/empty_profile.png";
  public dniValues;
  public capturedImage=false;
  public textValidating='Validating biometrics profile...'

  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController, 
              public navParams: NavParams, 
              private camera: Camera, 
              private newAttributesService : NewAttributeService,
              private validateService : ValidateService) {
    try{
      this.dniValues = this.navParams.get("dniValues");
      if(this.dniValues.PhotoB64){
        this.dnieBase64Image='data:image/jpeg;base64,' + this.dniValues.PhotoB64;
      }else{
        this.dnieBase64Image='assets/img/empty_profile.png';
      }
    }catch(e){
      alert("Error constructor" + e);
    }
  }
  

  closeModal(){
    this.viewCtrl.dismiss();
  }

  takePhoto(){
      const options: CameraOptions = {
        quality: 25,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        //allowEdit: true,
        correctOrientation: true,
        cameraDirection: 1
      }

      this.camera.getPicture(options).then((imageData) => {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.capturedImage=true;
      }, (err) => {
        alert("Error: "+err);
      });
  }

  validateBiometrics(){
      let vm = this;
      if(vm.capturedImage){
        document.getElementById('btnValidateFaces').style.display='none';
        document.getElementById('txtValidating').style.display='block';
        vm.validateService.validateBiometrics(this.dniValues.PhotoB64, this.base64Image.substring((this.base64Image.indexOf(","))+1))
        .then(val =>{
          document.getElementById('btnValidateFaces').style.display='block';
          document.getElementById('txtValidating').style.display='none';
          if(val['result']==true){
            setTimeout(() =>{
              vm.newAttributesService.createSocialAttributes(CONSTANTS.SOCIAL_LOGINS.DNI, vm.dniValues, function () {
                vm.viewCtrl.dismiss();
              });
            });
          }else{
            alert("The profiles do not match");
          }
        }).catch(val =>{
          alert("Error to check profile: " + val);
          document.getElementById('btnValidateFaces').style.display='block';
          document.getElementById('txtValidating').style.display='none';
        });    
    }
  }
}
