import {Component, ViewChild} from '@angular/core';
import {Content} from "ionic-angular";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  constructor() {
    console.log(this.content)
  }

  ionViewWillEnter() { // THERE IT IS!!!
    this.content._elementRef.nativeElement.childNodes[1].classList.add("no-header")
  }
}
