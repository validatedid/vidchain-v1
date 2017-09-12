/**
 * Created by alexmarcos on 22/8/17.
 */
import { Component } from '@angular/core';
import {ModalController, NavParams, ViewController} from "ionic-angular";
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
    constructor(
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
        public params: NavParams,
    ) {
        this.newValues = this.params.get('newValues');
        this.oldValues = this.params.get('oldValues');
        this.callback = this.params.get('callback');
        this.message = this.params.get('message') || "Do you want overwrite the Attribute?";
        this.title = this.params.get('title') || "Change Value?";
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