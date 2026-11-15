import { Component } from '@angular/core';
@Component({selector:'app-root',standalone:false,templateUrl:'./app.component.html'})
export class App {
  menuOpen=false;
  version='1.0';
  closeMenu():void{this.menuOpen=false;}
  displayAbout():void{this.menuOpen=false;alert(`GearTrack Milestone 4 • Version ${this.version}\nAngular + Express + MySQL`);}
}
