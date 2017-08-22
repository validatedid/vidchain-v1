/**
 * Created by alexmarcos on 22/8/17.
 */

/**
 * Created by alexmarcos on 22/8/17.
 */
import {EventEmitter, Injectable} from '@angular/core';
import moment from 'moment';

@Injectable()
export class ValidateService {
    private interval = 1000;

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


}
