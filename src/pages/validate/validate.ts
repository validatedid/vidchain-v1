/**
 * Created by alexmarcos on 22/8/17.
 */
import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";


@Component({
    selector: 'validate-page',
    templateUrl: 'validate.html'
})
export class ValidatePage {

    constructor(public params: NavParams,
                public viewCtrl: ViewController) {
    }

    closeModal(){
        this.viewCtrl.dismiss();
    }

}