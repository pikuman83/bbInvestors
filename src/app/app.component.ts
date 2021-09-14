import { Component, OnInit } from '@angular/core';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'bbInvestors';
  showForm = false;

  constructor(public service: GlobalService){}

  ngOnInit() {
    this.setLang();
  }

  setLang(){
    let lang = '';
    if (window.location.pathname.split('/')[1] === 'en') return lang = 'EN';
    if (window.location.pathname.split('/')[1] === 'es') return lang = 'ES';
    if (window.location.pathname.split('/')[1] === 'fr') return lang = 'FR';
    return lang = '';
  }

  openNav() {
    document.getElementById("mySidenav")!.style.width = "100%";
  }
  
  closeNav() {
    document.getElementById("mySidenav")!.style.width = "0";
  }

}