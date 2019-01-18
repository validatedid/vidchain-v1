

/**
 * Created by alexmarcos on 22/8/17.
 */
import {EventEmitter, Injectable} from '@angular/core';
import moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as shajs from 'sha.js'
import CONSTANT from '../../constants';

@Injectable()
export class ValidateService {
    private interval = 1000;
    public attributedValidated : EventEmitter<any> = new EventEmitter();

    constructor( private http:HttpClient){
    }

    checkValidation(timeToFinish){
        let diffTime = timeToFinish - moment(new Date()).unix();
        let duration= moment.duration(diffTime*1000, 'milliseconds');
        if(diffTime > 0){
            duration = moment.duration(<any>duration - this.interval, 'milliseconds');
            return (duration.minutes() < 10 ? '0' : '') + duration.minutes() + ":" + (duration.seconds() < 10 ? '0' : '') + duration.seconds();

        }
        else{
            return 'expired'
        }
    }
    sendSmsCode(numTelefono){
        //todo falta hacer
        let headers = new HttpHeaders({ 'Authorization': 'Bearer 31924a56d96665904ccfff7291f7d7ad2bf9cfb9',
            'Accept': 'q=0.8;application/json;q=0.9' });
        let data = {
            "sms": {
                "from": "ViDChain",
                "to": numTelefono,
                "text": "Your activation code is %token%"
            },
            "tokenLength": 6
        };
        return this.http.post('https://api.instasent.com/verify/', JSON.stringify(data), {headers:headers}).toPromise()
    }
    validateSmsCode(value, id){
        //todo falta hacer
        let headers = new HttpHeaders({ 'Authorization': 'Bearer 31924a56d96665904ccfff7291f7d7ad2bf9cfb9',
            'Accept': 'q=0.8;application/json;q=0.9' });

        return this.http.get('https://api.instasent.com/verify/'+id+'?token='+value,{headers:headers}).toPromise()
    }

    sendEmailCode(email){
        //todo falta hacer
        let headers = new HttpHeaders({'Accept': 'q=0.8;application/json;q=0.9','Content-Type': 'application/json' });
        let data = {
            "email": email,
        };

        return this.http.post(CONSTANT.URL.URL_CONFIRM_EMAIL, JSON.stringify(data),{headers:headers}).toPromise()
    }

    validateEmailCode(value,id){
        let headers = new HttpHeaders({'Accept': 'q=0.8;application/json;q=0.9','Content-Type': 'application/json' });
        return this.http.get(CONSTANT.URL.URL_CONFIRM_EMAIL+"?verification_code="+value+"&request_id="+id,{headers:headers}).toPromise()
    }

    saveValueEthereum(value){       
        let headers = new HttpHeaders({'Content-Type': 'application/json' });
        let settings = JSON.parse(localStorage.getItem('settings')) || CONSTANT.DEFAULT_SETTINGS;
        let data = {
           "destination": settings['LEDGER'].DESTINATION,
           "network": settings['LEDGER'].TESTNET,
           "sha256": shajs('sha256').update(JSON.stringify(value)).digest('hex')
        };
        
       return this.http.post(CONSTANT.URL.URL_VIDCHAIN_API, JSON.stringify(data), {headers: headers}).toPromise();        
    }

    validateBiometrics(dniePhoto, selfie){
        //todo falta hacer
        let headers = new HttpHeaders({'Accept': 'q=0.8;application/json;q=0.9','Content-Type': 'application/json' });
        let data = {"image_1": dniePhoto,"image_2": selfie};

        return this.http.post(CONSTANT.URL.URL_VALIDATED_BIOMETRICS, JSON.stringify(data),{headers:headers}).toPromise();
    }
}
