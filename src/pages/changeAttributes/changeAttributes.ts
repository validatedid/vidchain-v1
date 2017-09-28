/**
 * Created by alexmarcos on 22/8/17.
 */
import { Component } from '@angular/core';
import {ModalController, NavParams, ViewController} from "ionic-angular";
import CONSTANTS from "../../constants";
@Component({
    selector: 'change-attributes',
    templateUrl: 'changeAttributes.html'
})

export class ChangeAttributesPage {

    public newValues;
    public oldValues;
    public callback;
    public title;
    public message;
    public image;
    constructor(
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
        public params: NavParams,
    ) {
        this.newValues = this.params.get('newValues');
        this.oldValues = this.params.get('oldValues');
        this.callback = this.params.get('callback');
        this.image = this.params.get('image');
        this.message = this.params.get('message') || "Do you want overwrite the Attribute?";
        this.title = this.params.get('title') || "Change Value?";
    }
    checkImage(attr){

        let prefix = attr.source === CONSTANTS.SOCIAL_LOGINS.DNI ? 'data:image/jpeg;base64,' : '';
        let value = prefix+attr.value;
        return value;
    }

    changeValue(){
        if(this.callback){
            this.callback();
        }
        this.closeModal();
    }
    closeModal(){
        this.viewCtrl.dismiss();
    }

}