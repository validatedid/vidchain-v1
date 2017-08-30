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
    public type;
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

        let validator = type==='email'?Validators.email:'';
        this.formGroup = this.formBuilder.group({
            type: [type],
            key: [type ==='email'?type:type=='phone'?type:name],
            value: ['',validator]

        });


    }

    checkSubmit(){

        if(this.formGroup.value.key !== '' && this.formGroup.value.value !=='' && this.formGroup.valid){
            return false
        }
        return true;

    }

    addFormatAttribute(){


        let listAttributes = this.newAttributedService.getListAttribute();

        let value = this.newAttributedService.createNewAttribute(this.formGroup.value);

        if(!listAttributes[value.key]){
            listAttributes[value.key] = []
        }

        // condition of one phone
        if(value.key === 'phone'){
            listAttributes[value.key][0] = value;
        }
        else{
            listAttributes[value.key].push(value);
        }

        if(value.key === 'phone' || value.key === 'email'){
            let profileModal = this.modalCtrl.create(ValidatePage, { info: value,key:value.key,index:listAttributes[this.formGroup.value.type].length-1});
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