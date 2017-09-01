/**
 * Created by alexmarcos on 22/8/17.
 */

/**
 * Created by alexmarcos on 22/8/17.
 */
import {EventEmitter, Injectable} from '@angular/core';
import moment from 'moment';
import {Http, RequestOptions, Headers} from '@angular/http';
import CONSTANT from '../../constants';

@Injectable()
export class ValidateService {
    private interval = 1000;
    public attributedValidated : EventEmitter<any> = new EventEmitter();
    constructor( private http:Http){

    }
    checkValidation(timeToFinish){
        let diffTime = timeToFinish - moment(new Date()).unix();
        let duration= moment.duration(diffTime*1000, 'milliseconds');
        if(diffTime > 0){
            duration = moment.duration(<any>duration - this.interval, 'milliseconds');
            return (duration.minutes()<10?'0':'') + duration.minutes() + ":" + (duration.seconds()<10?'0':'')+duration.seconds();

        }
        else{
            return 'expired'
        }
    }
    sendSmsCode(numTelefono){
        //todo falta hacer
        let headers = new Headers({ 'Authorization': 'Bearer 31924a56d96665904ccfff7291f7d7ad2bf9cfb9',
            'Accept': 'q=0.8;application/json;q=0.9' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            "sms": {
                "from": "VIDChain",
                "to": numTelefono,
                "text": "Your activation code is %token%"
            },
            "tokenLength": 6
        };
        return this.http.post('https://api.instasent.com/verify/', JSON.stringify(data), options).toPromise()
    }
    validateSmsCode(value, id){
        //todo falta hacer
        let headers = new Headers({ 'Authorization': 'Bearer 31924a56d96665904ccfff7291f7d7ad2bf9cfb9',
            'Accept': 'q=0.8;application/json;q=0.9' });
        let options = new RequestOptions({ headers: headers });

        return this.http.get('https://api.instasent.com/verify/'+id+'?token='+value,options).toPromise()
    }

    sendEmailCode(email){
        //todo falta hacer
        let headers = new Headers({'Accept': 'q=0.8;application/json;q=0.9' });
        let data = {
            "email": email,
        };
        return this.http.post(CONSTANT.URL.URL_CONFIRM_EMAIL, JSON.stringify(data),headers).toPromise()
    }

    validateEmailCode(value,id){
        let headers = new Headers({'Accept': 'q=0.8;application/json;q=0.9' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(CONSTANT.URL.URL_CONFIRM_EMAIL+"?verification_code="+value+"&request_id="+id,options).toPromise()
    }
}
