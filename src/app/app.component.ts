import { Component, OnInit, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'bbInvestors';
  siteLanguage = '';
  languageList = ['ES','EN','FR'];
  showForm = false;

  ngOnInit() {
      // this.siteLanguage = window.location.pathname.split('/')[1].toUpperCase();
      this.siteLanguage = (navigator.language !== 'en' && navigator.language !== 'es')? 'EN' : navigator.language.toUpperCase();
  }
}
