/**
 * Created by alexmarcos on 22/8/17.
 */
import {EventEmitter, Injectable} from '@angular/core';
import moment from 'moment';
import CONSTANTS from '../../constants';
import {LoadingController, ModalController} from "ionic-angular";
import {ValidateService} from "../validate/validate.service";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
import {ChangeAttributesPage} from "../changeAttributes/changeAttributes";


@Injectable()
export class NewAttributeService {

    public attributeAddEmitter : EventEmitter<any> = new EventEmitter();
    public loading;
    constructor(private validateService: ValidateService,
                public loadingCtrl: LoadingController,
                private modalCtrl: ModalController){}

    public createNewAttribute(obj){
        return {
            type : obj.type === 'email'?obj.type:obj.type === 'phone'?obj.type:'other',
            key : obj.key,
            value : obj.value,
            timeToValidate : obj.timetoValidate || 'never',
            validated : obj.validate || true,
            source : obj.source || 'user',
            createdAt : moment().unix()*1000
        }
    }

    public createSocialAttributes(social,data,cb=null){
        let attr = CONSTANTS.SOCIAL_LOGIN_ATTRIBUTES[social];
        let listAttributes = this.getListAttribute();
        let alertsWaiting = [];
        this.showLoading();
        for (let attribute of attr){
            let value = this.accessDataFromPropertyString(data,attribute.value);
            //special for foto.
            if(attribute.name === 'photo'){
                switch (social){
                    case CONSTANTS.SOCIAL_LOGINS.FACEBOOK:
                        value = "http://graph.facebook.com/" + value + "/picture?type=large";
                        break;
                    case CONSTANTS.SOCIAL_LOGINS.GOOGLE:
                        value = value + '&sz=200';
                        break;
                }

            }
            //special join data for DNI Attributes
            if(social === CONSTANTS.SOCIAL_LOGINS.DNI){
                switch (attribute.name){
                    case 'name':
                        value += ' '+data['Surname'];
                        break;
                    case 'Address':
                        value += ' '+data['City'];
                        break;
                }
            }
            let object = this.createNewAttribute({
                    'type': attribute.name,
                    'key': attribute.name,
                    'value':value,
                    'validated':true,
                    'source':social
                });

            if(!listAttributes[attribute.name]){
                listAttributes[attribute.name] = [];
            }
            if(attribute.unique && listAttributes[attribute.name].length>0){
                if(value !==  listAttributes[attribute.name][0].value || social !== listAttributes[attribute.name][0].source){

                    let alert = this.modalCtrl.create(ChangeAttributesPage,{newValues:object,oldValues:listAttributes[attribute.name][0],callback: () =>{
                        this.saveAttributeWithEthereum(object).then(object => {
                            listAttributes[attribute.name][0] = object;
                            this.saveAttributes(listAttributes);
                        });
                    }});

                    alertsWaiting.push(alert);
                }
            }
            else{
                let index = this.searchAttribute(listAttributes[attribute.name],value);
                if(index > -1){
                    this.saveAttributeWithEthereum(object).then(object => {
                        listAttributes[attribute.name][index] = object;
                        this.saveAttributes(listAttributes);
                    });
                }
                else{
                    this.saveAttributeWithEthereum(object).then(object => {
                        listAttributes[attribute.name].push(object);
                        this.saveAttributes(listAttributes);
                    });
                }

            }
        }
        let infoModal = this.modalCtrl.create(InfoAttributesPages,{text:social.toLowerCase()+' attributes'});
        if(alertsWaiting.length>0){
            alertsWaiting[0].present();
            for(let i=0;i<alertsWaiting.length;i++){
                let ActualAlert = alertsWaiting[i];
                ActualAlert.onDidDismiss(() => {
                    if(alertsWaiting[i+1]){
                        alertsWaiting[i+1].present();
                    }
                    else{
                        if(cb){
                            cb();
                        }
                        this.hideLoading();
                        infoModal.present();
                        // this.alertCtrl.create({title: 'Sync Done', buttons: [{text: 'Ok'},]}).present();
                    }
                });
            }
        }
        else{
            if(cb){
                cb();
            }
            this.hideLoading();
            infoModal.present();
            // this.alertCtrl.create({title: 'Sync Done', buttons: [{text: 'Ok'},]}).present();
        }


    }
    public saveAttributeWithEthereum(object){
        return new Promise((resolve, reject) => {
            this.validateService.saveValueEthereum(object.value)
                .then(res => {let body = res.json();return body || [];})
                .then(val =>{
                    object.urlEthereum = CONSTANTS.URL.URL_SHOW_ETHEREUM + val.tx;
                    resolve(object)
                })
                .catch(err =>{
                    resolve(object);
                })

        });

    }
    public getListAttribute(){
        let listAttributes = JSON.parse(localStorage.getItem('attributes'));

        if(!listAttributes){
            listAttributes = {}
        }
        return listAttributes;
    }
    public saveAttributes(listAttributes){
        localStorage.setItem('attributes',JSON.stringify(listAttributes));
        this.attributeAddEmitter.emit("all");
    }
    createNewEducation(msg){
        this.showLoading();
        let obj = this.createNewAttribute({
            'key':'education',
            'value':msg.raw.additionalData.payload.attribute,
            'validated': true,
            'source': msg.raw.additionalData.payload.requester.name
        });
        let listValues = this.getListAttribute();
        let index = this.searchAttribute(listValues['education'],obj.value);
        let infoModal = this.modalCtrl.create(InfoAttributesPages,{text: 'Education , '+obj.value+' '});
        if(index > -1){
            if(listValues['education'][index].source === obj.source){
                infoModal.present();
                this.hideLoading();
            }
            else{
                this.saveAttributeWithEthereum(obj).then(val=>{
                    listValues['education'].push(val);
                    this.saveAttributes(listValues);
                    infoModal.present();
                    this.hideLoading();
                })
            }
        }
        else{
            this.saveAttributeWithEthereum(obj).then(val=>{
                listValues['education'].push(val);
                this.saveAttributes(listValues);
                infoModal.present();
                this.hideLoading();
            })
        }
    }
    public searchAttribute(list,value){
        let res = -1;
        for(let i=0;i<list.length;i++){
            if(list[i].value === value){
                res = i;
            }
        }
        return res;
    }
    public showLoading(text = 'Please wait...'){
        this.loading = this.loadingCtrl.create({
            content: text
        });
        console.log(this.loading);
        this.loading.present()
    }
    public changeTextLoading(text){
        if(this.loading){
            this.loading.setContent(text);
        }
    }
    public hideLoading(){
        this.loading.dismiss();
    }
    private accessDataFromPropertyString(data,property){
        let res;
        let propertySplit = property.split('.');
        for(let p of propertySplit){
            res = data[p];
            data = res;
        }
        return res;
    }
}