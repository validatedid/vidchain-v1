/**
 * Created by alexmarcos on 22/8/17.
 */
import {EventEmitter, Injectable} from '@angular/core';
import moment from 'moment';
import CONSTANTS from '../../constants';
import {AlertController} from "ionic-angular";


@Injectable()
export class NewAttributeService {

    public attributeAddEmitter : EventEmitter<any> = new EventEmitter();

    constructor(private alertCtrl: AlertController){}

    public createNewAttribute(obj){
        return {
            type : obj.type === 'email'?obj.type:obj.type === 'phone'?obj.type:'other',
            key : obj.key,
            value : obj.value,
            timeToValidate : obj.timetoValidate || 'expired',
            validated : obj.validate || true,
            source : obj.source || 'manual',
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
                                    listAttributes[attribute.name][0] = object
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
                    listAttributes[attribute.name][index] = object;
                }
                else{
                    listAttributes[attribute.name].push(object);
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
                        this.saveAttributes(listAttributes);
                        this.alertCtrl.create({title: 'Sync Done', buttons: [{text: 'Ok'},]}).present();
                    }
                });
            }
        }
        else{
            this.saveAttributes(listAttributes);
            this.alertCtrl.create({title: 'Sync Done', buttons: [{text: 'Ok'},]}).present();
        }


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
    private searchAttribute(list,value){
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
        let i=0;
        for(let p of propertySplit){
            res = data[p];
            data = res;
        }
        return res;
    }
}