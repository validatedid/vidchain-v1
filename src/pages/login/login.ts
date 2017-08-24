import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {AlertController} from "ionic-angular";
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public IP = "146.185.128.193/vidchain/";
  private URL_HOST = "http://"+this.IP;
  private URL_CONFIRM_LOGIN = this.URL_HOST + "confirm_login.php";
  constructor(private barcodeScanner: BarcodeScanner,
              private http:Http,
              private alertCtrl: AlertController) {

  }

  readQR(){
    let options = {
      showTorchButton : true,
      showFlipCameraButton : true
    };

    this.barcodeScanner.scan(options).then((barcodeData) => {
      if(!barcodeData.cancelled && barcodeData.text.indexOf('vidchain') != -1){
        this.URL_HOST = "http://"+this.IP;
        this.URL_CONFIRM_LOGIN = this.URL_HOST + "confirm_login.php";
        this.http.get(this.URL_CONFIRM_LOGIN+'?id='+barcodeData.text).map(res => res.json()).subscribe(data => {
          console.log(data);
          let message = "Do you want to send this Attributes: ";
          data.userinfo.forEach((val,index)=>{
            message +="<br/> - "+val;
          });
          let alert = this.alertCtrl.create({
            title: 'Login',
            message: message,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Send',
                handler: () => {
                  let headers = new Headers({ 'Content-Type': 'application/json',
                    'Accept': 'q=0.8;application/json;q=0.9' });
                  let options = new RequestOptions({ headers: headers });
                  let values = {
                    'name': 'Pepito',
                    'email': 'pepito@gmail.com',
                    'nif': null,
                    'phone': '666123123'
                  };

                  this.http.post(this.URL_CONFIRM_LOGIN, JSON.stringify(values), options).toPromise()
                      .then((val)=>{
                        console.log(val);
                        let alert = this.alertCtrl.create({
                          title: 'Login',
                          subTitle: 'Login Done',
                          buttons: ['Dismiss']
                        });
                        alert.present();
                      });
                }
              }
            ]
          });
          alert.present();
        });
      }
    }, (err) => {
      // An error occurred
    });


  }
}
