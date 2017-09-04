/**
 * Created by alexmarcos on 22/8/17.
 */
import {Component, OnDestroy} from '@angular/core';
import {LoadingController, ModalController, NavParams, ToastController, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidateService} from "./validate.service";
import moment from 'moment';
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";

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
    public loading;
    constructor(public params: NavParams,
                public viewCtrl: ViewController,
                private formBuilder: FormBuilder,
                private validateService : ValidateService,
                private newAttributeService : NewAttributeService,
                private toastCtrl: ToastController,
                private modalCtrl: ModalController,
                public loadingCtrl: LoadingController) {

        this.info = params.get('info');
        this.key = params.get('key');
        this.index = params.get('index');

        this.formGroup = this.formBuilder.group({
            code: ['',Validators.required],
        });
        this.timeToValidate= this.validateService.checkValidation(this.info.timeToValidate);
        if(this.timeToValidate === 'expired' ||  this.timeToValidate === 'never'){
            this.refreshTimeToValidator();
        }
        if(this.timeToValidate !== 'expired'){
            this.checkValidationInterval();
        }

    }

    checkValidationInterval(){
        let interval = 1000;
        let vm = this;
        this.timeOutValidation = setTimeout(function(){
            vm.timeToValidate = vm.validateService.checkValidation(vm.info.timeToValidate);
            if(vm.timeToValidate != 'expired'){
                vm.checkValidationInterval();
            }
            else if('expired'){
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

    saveValidateValue(urlEthereum = null){
        let list = JSON.parse(localStorage.getItem('attributes'));
        list[this.key][this.index].validated = true;
        if(urlEthereum){
            list[this.key][this.index].urlEthereum = urlEthereum;
        }
        localStorage.setItem('attributes',JSON.stringify(list));
        this.validateService.attributedValidated.emit(list[this.key][this.index]);
    }
    refreshTimeToValidator(){
        this.showLoading();
        if(this.info.key === 'phone'){
            this.validateService.sendSmsCode(this.info.value)
                .then(res => {let body = res.json();return body || [];})
                .then((val)=>{
                console.log(val);
                this.refreshTimeAndId(val['entity']['id']);
                this.newAttributeService.attributeAddEmitter.emit(this.info);
                this.toastCtrl.create({
                    message: 'SMS was sent, see your inbox :'+this.info.value,
                    duration: 3000,
                    position: 'top'
                }).present();
            }).catch(val=>{
                console.log(val);
                this.loading.dismiss();
                alert('error sending sms');
            });
        }
        else{
            this.validateService.sendEmailCode(this.info.value)
                .then(res => {let body = res.json();return body || [];})
                .then((val)=>{
                if(val.result){
                    this.emailWasSendedToast(val);
                }
                else{
                    this.loading.dismiss();
                    alert('error sending email');
                }
            }).catch(val=>{
                if(val.status === 0){
                    this.emailWasSendedToast(val);
                }
                else{
                    console.log(val);
                    this.loading.dismiss();
                    alert('error sending email');
                }
            });

        }

    }

    emailWasSendedToast(val){
        this.refreshTimeAndId(val.request_id);
        this.newAttributeService.attributeAddEmitter.emit(this.info);
        this.toastCtrl.create({
            message: 'Email with code was sent, see your inbox :'+this.info.value,
            duration: 3000,
            position: 'top'
        }).present()
    }
    refreshTimeAndId(id){
        let list = JSON.parse(localStorage.getItem('attributes'));
        list[this.key][this.index].timeToValidate = moment(new Date()).add(5, 'minutes').unix();
        list[this.key][this.index].idValidate = id ;
        this.info.timeToValidate = list[this.key][this.index].timeToValidate;
        this.info.idValidate = list[this.key][this.index].idValidate;
        this.info=list[this.key][this.index];
        localStorage.setItem('attributes',JSON.stringify(list));
        this.loading.dismiss();

        this.checkValidationInterval();
    }

    resendCode(){
        this.refreshTimeToValidator()
    }
    validateValue(){
        this.showLoading();
        if(this.info.key === 'email'){
            this.validateService.validateEmailCode(this.formGroup.value.code,this.info.idValidate)
                .then(res => {let body = res.json();return body || [];})
                .then(val =>{
                    this.loading.dismiss();
                    if(val['result'] === 'verified'){
                        this.showToastValidate();
                    }
                    else{
                        this.showInvalidCode = true;
                    }
                }).catch(val =>{
                    this.loading.dismiss();
                    this.showInvalidCode = true;
                })
        }
        else{
            this.validateService.validateSmsCode(this.formGroup.value.code,this.info.idValidate)
                .then(res => {let body = res.json();return body || [];})
                .then(val =>{
                    this.loading.dismiss();
                    if(val['entity']['status'] === 'verified'){
                       this.showToastValidate();
                    }
                    else{
                        this.showInvalidCode = true;
                    }
                }).catch(val =>{
                    this.loading.dismiss();
                    this.showInvalidCode = true;
                })
        }


    }

    showToastValidate(){
        let infoModal = this.modalCtrl.create(InfoAttributesPages,{type:this.info.key});
        this.validateService.saveValueEthereum(this.info.value)
            .then(res => {let body = res.json();return body || [];})
            .then(val =>{
                console.log(val);
                this.saveValidateValue(val.result);
                infoModal.present();
                this.closeModal();
            })
            .catch(err =>{
                this.saveValidateValue();
                infoModal.present();
                this.closeModal();
            })
    }
    closeModal(){
        this.viewCtrl.dismiss();
    }
    showLoading(){
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present()
    }
    ngOnDestroy(){
        clearTimeout( this.timeOutValidation);
    }
}