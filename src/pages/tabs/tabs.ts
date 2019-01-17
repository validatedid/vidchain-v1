/**
 * Created by alexmarcos on 8/8/17.
 */
import { Component } from '@angular/core';

import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {ListPage} from "../list/list";
import {SettingsPage} from "../settings/settings";

@Component({
    selector: 'tabs-custom',
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = LoginPage;
    tab2Root = ListPage;
    tab3Root = SettingsPage;

    constructor(public navCtrl: NavController) {

    }
}