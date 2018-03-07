import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import CONSTANT from "../../constants";
import {SendAttributesPage} from "../sendAttributes/sendAttributes";
import {ModalController} from "ionic-angular";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private URL_CONFIRM_LOGIN = CONSTANT.URL.URL_CONFIRM_LOGIN;
  constructor(private barcodeScanner: BarcodeScanner,
              public modalCtrl: ModalController,
              private http:HttpClient) {

  }

  readQR(){
    let options = {
      showTorchButton : true,
      showFlipCameraButton : true
    };
    
    this.barcodeScanner.scan(options).then((barcodeData) => {
      if(!barcodeData.cancelled && barcodeData.text.indexOf('vidchain') != -1){
        this.URL_CONFIRM_LOGIN = CONSTANT.URL.URL_CONFIRM_LOGIN;
        this.http.get(this.URL_CONFIRM_LOGIN+'?id='+barcodeData.text).subscribe(data => {
          let sendAttributesModal = this.modalCtrl.create(SendAttributesPage,{attrToSend:data});
          sendAttributesModal.present();
        });
      }
    }, (err) => {
      // An error occurred
    });
    
  }

}
