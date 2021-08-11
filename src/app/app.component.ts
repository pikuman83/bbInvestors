import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'bbInvestors';
  siteLanguage: string = 'ES';
  siteLocale: string = '';
  languageList = ['ES','EN','FR'];
  
  ngOnInit() {
    setTimeout(() => {
      this.siteLocale = window.location.pathname.split('/')[1];  
    }, );
    
    // this.siteLanguage = this.languageList.find(f => f.code === this.siteLocale).label;
    console.log(this.siteLocale.toUpperCase());
  }
}
