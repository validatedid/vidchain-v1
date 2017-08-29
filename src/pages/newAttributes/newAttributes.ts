/**
 * Created by alexmarcos on 22/8/17.
 */
import { Component } from '@angular/core';
import {ModalController, NavParams, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NewAttributeService} from "./newAttributes.service";
import moment from 'moment';
import {ValidatePage} from "../validate/validate";
import {ValidateService} from "../validate/validate.service";

@Component({
    selector: 'new-attributes',
    templateUrl: 'newAttributes.html'
})

export class NewAttributesPage {
    private formGroup : FormGroup;
    public typeAttribute;
    constructor(
        public viewCtrl: ViewController,
        private formBuilder: FormBuilder,
        private newAttributedService : NewAttributeService,
        private validateService : ValidateService,
        public modalCtrl: ModalController,
        public params: NavParams
    ) {
        let type = params.get('type') || 'other';
        let name = params.get('key') || '';
        this.formGroup = this.formBuilder.group({
            typeAttribute: [type],
            email: ['',Validators.email],
            phone: [''],
            key: [name],
            value: ['']

        });

    }

    checkSubmit(){
        let checkFn = {};
        checkFn['email'] = ()=>{
            if(this.formGroup.value.email !== '' && this.formGroup.valid){
                return false
            }
            return true;
        };
        checkFn['phone'] = ()=>{
            if(this.formGroup.value.phone !== ''){
                return false
            }
            return true;
        };
        checkFn['other'] = () =>{
            if(this.formGroup.value.key !== '' && this.formGroup.value.value !=='' && (this.formGroup.value.key !== 'email' && this.formGroup.value.key !== 'phone')){
                return false
            }
            return true;
        };
        return checkFn[this.formGroup.value.typeAttribute]();
    }

    addFormatAttribute(){
        let checkFn = {};
        checkFn['email'] = ()=>{
            return {
                type : this.formGroup.value.typeAttribute,
                key : this.formGroup.value.typeAttribute,
                value : this.formGroup.value.email,
                timeToValidate : moment(new Date()).add(5, 'minutes').unix(),
                validated : false,
                source : 'manual',
                createdAt:moment(new Date()).unix()
            };
        };
        checkFn['phone'] = ()=>{
            return {
                type : this.formGroup.value.typeAttribute,
                key : this.formGroup.value.typeAttribute,
                value : this.formGroup.value.phone,
                timeToValidate : moment(new Date()).add(5, 'minutes').unix(),
                validated : false,
                source : 'manual',
                createdAt:moment(new Date()).unix()
            };
        };
        checkFn['other'] = () =>{
            return {
                type : this.formGroup.value.key,
                key : this.formGroup.value.key,
                value : this.formGroup.value.value,
                validated : true,
                source : 'manual',
                createdAt:moment(new Date()).unix()
            };
        };

        let listAttributes = JSON.parse(localStorage.getItem('attributes'));
        if(!listAttributes){
            listAttributes = {}
        }
        let value = checkFn[this.formGroup.value.typeAttribute]();

        if(!listAttributes[value.type]){
            listAttributes[value.type] = []
        }

        // condition of one phone
        if(value.type === 'phone'){
            listAttributes[value.type][0] = value;
        }
        else{
            listAttributes[value.type].push(value);
        }

        if(value.type === 'phone' || value.type === 'email'){
            this.validateService.sendValidator();
            let profileModal = this.modalCtrl.create(ValidatePage, { info: value,key:value.key,index:listAttributes[this.formGroup.value.typeAttribute].length-1});
            profileModal.present();
        }

        localStorage.setItem('attributes',JSON.stringify(listAttributes));
        return value;
    }

    addNewAttribute(){
        this.newAttributedService.attributeAddEmitter.emit(this.addFormatAttribute());
        this.closeModal();
    }


    closeModal(){
        this.viewCtrl.dismiss();
    }
}