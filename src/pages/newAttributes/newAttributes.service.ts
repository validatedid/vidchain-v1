/**
 * Created by alexmarcos on 22/8/17.
 */
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class NewAttributeService {

    public attributeAddEmitter : EventEmitter<any> = new EventEmitter();


}