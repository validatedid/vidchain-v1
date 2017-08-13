import { Component } from '@angular/core';
import {ModalController} from "ionic-angular";
import {InfoAttributesPages} from "../infoAttributes/infoAttributes";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  constructor(public modalCtrl: ModalController) {

  }
  items = [
    'Pokémon Yellow',
    'Super Metroid',
    'Mega Man X',
    'The Legend of Zelda',
    'Pac-Man',
    'Super Mario World',
    'Street Fighter II',
    'Half Life',
    'Final Fantasy VII',
    'Star Fox',
    'Tetris',
    'Donkey Kong III',
    'GoldenEye 007',
    'Doom',
    'Fallout',
    'GTA',
    'Halo'
  ];

  openModal(val) {
    let profileModal = this.modalCtrl.create(InfoAttributesPages, { info: val });
    profileModal.present();
  }
}
