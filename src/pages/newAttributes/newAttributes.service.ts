/**
 * Created by alexmarcos on 22/8/17.
 */
import {EventEmitter, Injectable} from '@angular/core';
import moment from 'moment';
import CONSTANTS from '../../constants';
import {AlertController} from "ionic-angular";
import {ValidateService} from "../validate/validate.service";


@Injectable()
export class NewAttributeService {

    public attributeAddEmitter : EventEmitter<any> = new EventEmitter();

    constructor(private alertCtrl: AlertController,
                private validateService: ValidateService){}

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

    public createSocialAttributes(social,data){
        let attr = CONSTANTS.SOCIAL_LOGIN_ATTRIBUTES[social];
        let listAttributes = this.getListAttribute();
        let alertsWaiting = [];
        for (let attribute of attr){
            let value = this.accessDataFromPropertyString(data,attribute.value);
            if(attribute.name === 'photo'){
                value = social === CONSTANTS.SOCIAL_LOGINS.GOOGLE? value + '&sz=200': "http://graph.facebook.com/" + value + "/picture?type=large";
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
                if(value !==  listAttributes[attribute.name][0].value){
                    let alert = this.alertCtrl.create({
                        title: 'Do you want overwrite the Attribute?',
                        message: 'Actual value : '+listAttributes[attribute.name][0].value+
                        '<br/>New Value: '+value,
                        buttons: [
                            {
                                text: 'No',
                                role: 'No',
                            },
                            {
                                text: 'Yes',
                                handler: () => {
                                    this.saveAttributeWithEthereum(object).then(object => {
                                        listAttributes[attribute.name][0] = object;
                                        this.saveAttributes(listAttributes);
                                    });

                                }
                            }
                        ]
                    });
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

        if(alertsWaiting.length>0){
            alertsWaiting[0].present();
            for(let i=0;i<alertsWaiting.length;i++){
                let ActualAlert = alertsWaiting[i];
                ActualAlert.onDidDismiss(() => {
                    if(alertsWaiting[i+1]){
                        alertsWaiting[i+1].present();
                    }
                    else{
                        this.alertCtrl.create({title: 'Sync Done', buttons: [{text: 'Ok'},]}).present();
                    }
                });
            }
        }
        else{
            this.alertCtrl.create({title: 'Sync Done', buttons: [{text: 'Ok'},]}).present();
        }


    }
    public saveAttributeWithEthereum(object){
        return new Promise((resolve, reject) => {
            this.validateService.saveValueEthereum(object.value)
                .then(res => {let body = res.json();return body || [];})
                .then(val =>{
                    object.urlEthereum = val.result;
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

    public searchAttribute(list,value){
        let res = -1;
        for(let i=0;i<list.length;i++){
            if(list[i].value === value){
                res = i;
            }
        }
        return res;
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