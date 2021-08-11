import { Component, OnInit, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'bbInvestors';
  siteLanguage: string = 'ES';
  languageList = ['ES','EN','FR'];

  ngOnInit() {
      this.siteLanguage = window.location.pathname.split('/')[1].toUpperCase();
      console.log(window.location.pathname, this.siteLanguage, navigator.language);
  }
}
