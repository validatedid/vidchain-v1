/**
 * Created by alexmarcos on 22/8/17.
 */
import {Component, OnDestroy} from '@angular/core';
import {NavParams, ToastController, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidateService} from "./validate.service";
import moment from 'moment';

@Component({
    selector: 'validate-page',
    templateUrl: 'validate.html'
})
export class ValidatePage implements OnDestroy{

    public info;
    public key;
    public index;
    public showInvalidCode = false;
    public timeToValidate;
    public timeOutValidation;
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
        this.timeOutValidation = setTimeout(function(){
            vm.timeToValidate = vm.validateService.checkValidation(vm.info.timeToValidate);
            if(vm.timeToValidate != 'expired'){
                vm.checkValidationInterval();
            }
            else{
                let toast = vm.toastCtrl.create({
                    message: 'Attribute '+vm.info.value+' was expired, try again',
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
                // vm.closeModal();
            }
        }, interval);
    }

    saveValidateValue(){
        let list = JSON.parse(localStorage.getItem('attributes'));
        list[this.key][this.index].validated = true;
        localStorage.setItem('attributes',JSON.stringify(list));
        this.validateService.attributedValidated.emit(list[this.key][this.index]);
    }
    refreshTimeToValidator(){
        let list = JSON.parse(localStorage.getItem('attributes'));
        if(this.info.key === 'phone'){
            this.validateService.sendSmsCode(this.info.value)
                .then(res => {let body = res.json();return body || [];})
                .then((val)=>{
                console.log(val);
                list[this.key][this.index].timeToValidate = moment(new Date()).add(5, 'minutes').unix();
                list[this.key][this.index].idValidate = val['entity']['id'];
                this.info.timeToValidate = list[this.key][this.index].timeToValidate;
                this.info.idValidate = list[this.key][this.index].idValidate;
                this.info=list[this.key][this.index];
                localStorage.setItem('attributes',JSON.stringify(list));
            }).catch(val=>{
                console.log(val);
                alert('error sending sms');
            });
        }
        else{
            //todo hay que poner lo de los emails
            list[this.key][this.index].timeToValidate = moment(new Date()).add(5, 'minutes').unix();
            this.info.timeToValidate = list[this.key][this.index].timeToValidate;
            this.info=list[this.key][this.index];
            localStorage.setItem('attributes',JSON.stringify(list));
        }

    }


    validateValue(){
        this.validateService.validateSmsCode(this.formGroup.value.code,this.info.idValidate)
            .then(res => {let body = res.json();return body || [];})
            .then(val =>{
            if(val['entity']['status'] === 'verified'){
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
        }).catch(val =>{
            this.showInvalidCode = true;
        })

    }

    closeModal(){
        this.viewCtrl.dismiss();
    }
    ngOnDestroy(){
        clearTimeout( this.timeOutValidation);
    }
}