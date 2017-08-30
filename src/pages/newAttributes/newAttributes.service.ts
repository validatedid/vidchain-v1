/**
 * Created by alexmarcos on 22/8/17.
 */
import {EventEmitter, Injectable} from '@angular/core';
import moment from 'moment';


@Injectable()
export class NewAttributeService {

    public attributeAddEmitter : EventEmitter<any> = new EventEmitter();


    public createNewAttribute(obj){
        return {
            type : obj.type,
            key : obj.key,
            value : obj.value,
            timeToValidate : obj.timetoValidate || 'expired',
            validate : obj.validate || true,
            source : obj.source || 'manual',
            createdAt : moment().unix()*1000
        }
    }
}