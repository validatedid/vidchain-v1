/**
 * Created by alexmarcos on 22/8/17.
 */
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
    transform(value, args:string[]) : any {
        let keys = [];
        for (let key in value) {
            // corrupt order for name first
            if(key === 'name'){
                keys.unshift(key)
            }
            else{
                keys.push(key);
            }

        }

        return keys;
    }
}