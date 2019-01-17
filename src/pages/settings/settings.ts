import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

import Constants from "../../constants";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    public ledgers : Array<Object>;
    private settings;
    public selectedLedger;

    constructor(public navCtrl: NavController){
        // Load settings from localStorage
        this.settings = JSON.parse(localStorage.getItem('appSettings'));        

        // Populate html with options and selected option
        this.ledgers = Constants.LEDGERS;
        this.selectedLedger = this.settings.LEDGER;
    }

    saveSetting(setting: string, value: Object){

        this.settings[setting.toUpperCase()] = value;

        localStorage.setItem('appSettings', JSON.stringify(this.settings));
    }
      
}