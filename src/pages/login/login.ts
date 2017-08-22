import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(private barcodeScanner: BarcodeScanner) {

  }

  readQR(){
    let options = {
      resultDisplayDuration : 4000,
      showTorchButton : true,
      showFlipCameraButton : true
    };

    this.barcodeScanner.scan(options).then((barcodeData) => {
      // Success! Barcode data is here
    }, (err) => {
      // An error occurred
    });
  }
}
