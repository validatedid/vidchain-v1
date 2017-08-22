/**
 * Created by alexmarcos on 22/8/17.
 */
import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";
@Component({
    selector: 'new-attributes',
    templateUrl: 'newAttributes.html'
})
export class NewAttributesPage {
    constructor(
        public viewCtrl: ViewController
    ) {

    }


    closeModal(){
        this.viewCtrl.dismiss();
    }
}