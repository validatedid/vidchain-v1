/**
 * Created by alexmarcos on 22/8/17.
 */
import { Component } from '@angular/core';
import {AlertController, ModalController, NavParams, ViewController} from "ionic-angular";
import {NewAttributesPage} from "../newAttributes/newAttributes";
import {Http, RequestOptions, Headers} from '@angular/http';
import CONSTANT from "../../constants";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
@Component({
    selector: 'change-attributes',
    templateUrl: 'changeAttributes.html'
})

export class ChangeAttributesPage {

    public newValues;
    public oldValues;
    public callback;
    public title;
    constructor(
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
        public params: NavParams,
        private http:Http
    ) {
        this.newValues = this.params.get('newValues');
        this.oldValues = this.params.get('oldValues');
        this.callback = this.params.get('callback');
        this.title = this.params.get('title') || "Do you want overwrite the Attribute?";
        console.log(this.newValues);
        console.log(this.oldValues);
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