/**
 * Created by alexmarcos on 22/8/17.
 */
import { Component } from '@angular/core';
import {ModalController, NavParams, ViewController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import CONSTANT from "../../constants";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
import { Firebase } from '@ionic-native/firebase';

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
        private http:HttpClient,
        private firebase: Firebase
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
        let headers = new HttpHeaders({ 'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9' });
        let vm = this;
        //this.result['token'] = JSON.parse(localStorage['ionic_push_token'])['token'];
        this.firebase.getToken()
        .then(function (token) {
            vm.result['token']=token;
            let response = vm.http.post(CONSTANT.URL.URL_CONFIRM_LOGIN, JSON.stringify(vm.result), { headers: headers }).toPromise()
            vm.closeModal();
            let infoModal = vm.modalCtrl.create(InfoAttributesPages,{ type:'login'});
            infoModal.present();
        }) // save the token server-side and use it to push notifications to this device
        .catch(error => console.log('Error getting token', error));
        
        this.firebase.onTokenRefresh().subscribe(function(token){
            
        });
        /*
        this.firebase.onNotificationOpen().subscribe(function(msg){
            alert("onNotificationOpen");
            alert(msg);
        });
        */
        
    }


}
