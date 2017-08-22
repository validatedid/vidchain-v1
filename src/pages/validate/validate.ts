/**
 * Created by alexmarcos on 22/8/17.
 */
import {Component} from '@angular/core';
import {NavParams, ToastController, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidateService} from "./validate.service";
import moment from 'moment';

@Component({
    selector: 'validate-page',
    templateUrl: 'validate.html'
})
export class ValidatePage {

    public info;
    public key;
    public index;
    public showInvalidCode = false;
    public timeToValidate;
    private formGroup : FormGroup;
    constructor(public params: NavParams,
                public viewCtrl: ViewController,
                private formBuilder: FormBuilder,
                private validateService : ValidateService,
                private toastCtrl: ToastController) {
        this.info = params.get('info');
        this.key = params.get('key');
        this.index = params.get('index');

        this.formGroup = this.formBuilder.group({
            code: ['',Validators.required],
        });
        this.timeToValidate= this.validateService.checkValidation(this.info.timeToValidate);
        if(this.timeToValidate === 'expired' ){
            this.refreshTimeToValidator();
        }
        this.checkValidationInterval();
    }

    checkValidationInterval(){
        let interval = 1000;
        let vm = this;
        setInterval(function(){
            vm.timeToValidate = vm.validateService.checkValidation(vm.info.timeToValidate);
            if(vm.timeToValidate != 'expired'){
                vm.checkValidationInterval();
            }
            else{
                let toast = this.toastCtrl.create({
                    message: 'Attribute '+this.info.value+' was expired, try again',
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
                this.closeModal();
            }
        }, interval);
    }

    saveValidateValue(){
        console.log(this.info,this.key,this.index);
        let list = JSON.parse(localStorage.getItem('attributes'));
        list[this.key][this.index].validated = true;
        localStorage.setItem('attributes',JSON.stringify(list));
        this.validateService.attributedValidated.emit(list[this.key][this.index]);
    }
    refreshTimeToValidator(){
        console.log(this.info,this.key,this.index);
        let list = JSON.parse(localStorage.getItem('attributes'));
        list[this.key][this.index].timeToValidate = moment(new Date()).add(5, 'minutes').unix();
        this.info=list[this.key][this.index];
        localStorage.setItem('attributes',JSON.stringify(list));
    }
    validateValue(){
        console.log(this.formGroup.value);
        if(+this.formGroup.value.code === 6666){
            let toast = this.toastCtrl.create({
                message: 'Attribute '+this.info.value+' was validated',
                duration: 3000,
                position: 'top'
            });
            this.saveValidateValue();
            toast.present();
            this.closeModal();

        }
        else{
            this.showInvalidCode = true;
        }
    }

    closeModal(){
        this.viewCtrl.dismiss();
    }

}