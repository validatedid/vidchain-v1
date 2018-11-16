/**
 * Created by alexmarcos on 22/8/17.
 */
import {Component, OnDestroy} from '@angular/core';
import {ModalController, NavParams, ToastController, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidateService} from "./validate.service";
import moment from 'moment';
import {NewAttributeService} from "../newAttributes/newAttributes.service";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";
import CONSTANTS from '../../constants';

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
                private newAttributeService : NewAttributeService,
                private toastCtrl: ToastController,
                private modalCtrl: ModalController) {

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

    //saveValidateValue(urlEthereum = null){
    saveValidateValue(urlBlockChain = null){
        let list = JSON.parse(localStorage.getItem('attributes'));
        list[this.key][this.index].validated = true;
        /*if(urlEthereum){
            list[this.key][this.index].urlEthereum = urlEthereum;
        }*/
        if(urlBlockChain){
            list[this.key][this.index].urlBlockChain = urlBlockChain;
        }
        localStorage.setItem('attributes',JSON.stringify(list));
        this.validateService.attributedValidated.emit(list[this.key][this.index]);
    }
    refreshTimeToValidator(){
        this.newAttributeService.showLoading();
        if(this.info.key === 'phone'){
            this.validateService.sendSmsCode(this.info.value)
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
                this.newAttributeService.hideLoading();
                alert('error sending sms');
            });
        }
        else{
            this.validateService.sendEmailCode(this.info.value)
                .then((val)=>{
                if(val['result']){
                    this.emailWasSendedToast(val);
                }
                else{
                    this.newAttributeService.hideLoading();
                    alert('error sending email');
                }
            }).catch(val=>{
                if(val.status === 0){
                    this.emailWasSendedToast(val);
                }
                else{
                    console.log(val);
                    this.newAttributeService.hideLoading();
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
        this.newAttributeService.hideLoading();

        this.checkValidationInterval();
    }

    resendCode(){
        this.refreshTimeToValidator()
    }
    validateValue(){
        this.newAttributeService.showLoading();
        if(this.info.key === 'email'){
            this.validateService.validateEmailCode(this.formGroup.value.code,this.info.idValidate)
                .then(val =>{
                    this.newAttributeService.hideLoading();
                    if(val['result'] === 'verified'){
                        this.showToastValidate();
                    }
                    else{
                        this.showInvalidCode = true;
                    }
                }).catch(val =>{
                    this.newAttributeService.hideLoading();
                    this.showInvalidCode = true;
                })
        }
        else{
            this.validateService.validateSmsCode(this.formGroup.value.code,this.info.idValidate)
                .then(val =>{
                    this.newAttributeService.hideLoading();
                    if(val['entity']['status'] === 'verified'){
                       this.showToastValidate();
                    }
                    else{
                        this.showInvalidCode = true;
                    }
                }).catch(val =>{
                    this.newAttributeService.hideLoading();
                    this.showInvalidCode = true;
                })
        }


    }

    showToastValidate(){
        let infoModal = this.modalCtrl.create(InfoAttributesPages,{text:this.info.key==='phone'?'Phone':'Email address'});
        this.validateService.saveValueEthereum(this.info.value)
            .then(val =>{
                console.log(val);
                //this.saveValidateValue(CONSTANTS.URL.URL_SHOW_ETHEREUM + val['tx']);
                this.saveValidateValue(val['ExplorerURL']);
                infoModal.present();
                this.closeModal();
            })
            .catch(err =>{
                this.saveValidateValue();
                infoModal.present();
                this.closeModal();
            });
    }
    closeModal(){
        this.viewCtrl.dismiss();
    }

    ngOnDestroy(){
        clearTimeout( this.timeOutValidation);
    }
}
