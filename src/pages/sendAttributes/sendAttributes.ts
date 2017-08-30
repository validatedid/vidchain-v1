/**
 * Created by alexmarcos on 22/8/17.
 */
import { Component } from '@angular/core';
import {AlertController, ModalController, NavParams, ViewController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";
import {Http, RequestOptions, Headers} from '@angular/http';
import CONSTANT from "../../constants";
@Component({
    selector: 'send-attributes',
    templateUrl: 'sendAttributes.html'
})

export class SendAttributesPage {

    public attrToSend;
    public result = {};
    public attributesSaved;
    constructor(
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
        public params: NavParams,
        private http:Http,
        private alertCtrl: AlertController
    ) {
        this.attrToSend = params.get('attrToSend') ;
        // this.attrToSend = params.get('url') ;
        this.refreshAttr();
        this.checkInit();
    }
    checkInit(){
        for(let attr of this.attrToSend.userinfo){
            this.addAttributeToResult(attr);
        }
    }
    checkSubmit(){
        let result = false;
        for(let attr of this.attrToSend.userinfo){
            if(!this.result[attr]){
                return true;
            }
        }
        console.log(result);
        return result;
    }
    newAttribute(value){
        let type = "other";
        if(value === 'phone' || value === 'email'){
            type = value
        }
        let newAttributesModal = this.modalCtrl.create(NewAttributesPage,{type:type,key:value});
        newAttributesModal.onDidDismiss(data => {

            this.refreshAttr();
            this.addAttributeToResult(value);
        });
        newAttributesModal.present();
    }
    checkEmptyAttr(attr){
        if(!this.attributesSaved[attr]){
            this.attributesSaved[attr] = [];
        }
        return this.attributesSaved[attr].length === 0;
    }
    closeModal(){
        this.viewCtrl.dismiss();
    }
    addAttributeToResult(attr){
        if(this.attributesSaved[attr]){
            if(this.attributesSaved[attr].length>0){
                this.result[attr] = this.attributesSaved[attr][0].value;
            }
        }
    }
    refreshAttr(){
        this.attributesSaved = JSON.parse(localStorage.getItem('attributes'));
    }

    sendAttributes(){
        let headers = new Headers({ 'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9' });
        let options = new RequestOptions({ headers: headers });
        let vm = this;
        this.result['token'] = JSON.parse(localStorage['ionic_push_token'])['token'];
        this.http.post(CONSTANT.URL.URL_CONFIRM_LOGIN, JSON.stringify(this.result), options).toPromise()
            .then((val)=>{
                console.log(val);
                let alert = this.alertCtrl.create({
                    title: 'Login',
                    subTitle: 'Login Done',
                    buttons: [{
                        text : 'Accept',
                        handler: () => {
                            vm.closeModal();
                        }
                    }]
                });
                alert.present();
            });
    }
}