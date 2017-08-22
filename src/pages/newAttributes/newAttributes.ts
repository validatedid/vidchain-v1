/**
 * Created by alexmarcos on 22/8/17.
 */
import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NewAttributeService} from "./newAttributes.service";
import moment from 'moment';

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
        private newAttributedService : NewAttributeService
    ) {
        this.formGroup = this.formBuilder.group({
            typeAttribute: ['email'],
            email: ['',Validators.email],
            phone: [''],
            key: [''],
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
            if(this.formGroup.value.key !== '' && this.formGroup.value.value !=='' ){
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
                createdAt:moment(new Date())
            };
        };
        checkFn['phone'] = ()=>{
            return {
                type : this.formGroup.value.typeAttribute,
                key : this.formGroup.value.typeAttribute,
                value : this.formGroup.value.phone,
                timeToValidate : moment(new Date()).add(5, 'minutes').unix(),
                validated : false,
                createdAt:moment(new Date())
            };
        };
        checkFn['other'] = () =>{
            return {
                type : this.formGroup.value.typeAttribute,
                key : this.formGroup.value.key,
                value : this.formGroup.value.value,
                validated : true,
                createdAt:moment(new Date())
            };
        };

        let listAttributes = JSON.parse(localStorage.getItem('attributes'));
        if(!listAttributes){
            listAttributes = {}
        }
        let value = checkFn[this.formGroup.value.typeAttribute]();
        if(!listAttributes[this.formGroup.value.typeAttribute]){
            listAttributes[this.formGroup.value.typeAttribute] = []
        }

        // condition of one phone
        if(this.formGroup.value.typeAttribute === 'phone'){
            listAttributes[this.formGroup.value.typeAttribute][0] = value;
        }
        else{
            listAttributes[this.formGroup.value.typeAttribute].push(value);
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