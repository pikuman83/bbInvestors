
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { AuthService } from './modules/shared/auth.service';
import { LoginComponent } from './modules/shared/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  title = 'bbInvestors';
  showForm = false;
  showMenu = true;

  constructor(
    public service: GlobalService,
    @Inject(DOCUMENT) private _document: Document, private _renderer2: Renderer2,
    public dialog: MatDialog,
    public auth: AuthService,
    public router: Router
    ){const route = service.showMenu.subscribe((x) => {
        this.showMenu = x;
        if(x){route.unsubscribe();}
      })
    }

  ngOnInit() {
    this.setLang();
    this.writeScript();
  }

  ngOnDestroy():void{
    this.showForm = false;
    document.getElementById('popUp')!.classList.remove('popupForm');
  }

  writeScript(){
    let script = this._renderer2.createElement('script');
    script.type = "text/javascript";
    script.text = `{
      var myZadarmaCallmeWidget10387;
      var myZadarmaCallmeWidgetFn10387 = function() {
        myZadarmaCallmeWidget10387 = new ZadarmaCallmeWidget("myZadarmaCallmeWidget10387");
        myZadarmaCallmeWidget10387.create({"widgetId": "rNnfyspG7tuAf4824urn9vasFU8pzh7DdDe5ZfvgMcL2kCxH8xL5rAbP9Z5u2pGDmb8Rru8hz4Mhjs3u54aSNeykFm12ufZ2cb14c74454d4170824956ddfa828ffbf", "sipId":"267956", "domElement":"myZadarmaCallmeWidget10387" }, { "shape":"square", "language":"es", "width":"0", "dtmf":false, "font": "'Trebuchet MS','Helvetica CY',sans-serif", "color_call": "rgb(255, 255, 255)", "color_bg_call": "rgb(126, 211, 33)", "color_border_call": "rgb(191, 233, 144)", "color_connection": "rgb(255, 255, 255)", "color_bg_connection": "rgb(33, 211, 166)", "color_border_connection": "rgb(144, 233, 211)", "color_calling": "rgb(255, 255, 255)", "color_border_calling": "rgb(255, 218, 128)", "color_bg_calling": "rgb(255, 181, 0)", "color_ended": "rgb(255, 255, 255)", "color_bg_ended": "rgb(164,164,164)", "color_border_ended": "rgb(210, 210, 210)"});}

        if (window.addEventListener) {
          window.addEventListener('load', myZadarmaCallmeWidgetFn10387, false);
        } else if (window.attachEvent) {
          window.attachEvent('onload', myZadarmaCallmeWidgetFn10387);
        }
    }`;
    this._renderer2.appendChild(this._document.body, script);
  }
  onActivate(_event: any) {
    document.body.scrollTop = 0;
}
  setLang(){
    let lang = '';
    if (window.location.pathname.split('/')[1] === 'en') return lang = 'EN';
    if (window.location.pathname.split('/')[1] === 'es') return lang = 'ES';
    if (window.location.pathname.split('/')[1] === 'fr') return lang = 'FR';
    return lang = '';
  }

  openLogin(type: string){
    const dialogRef = this.dialog.open(LoginComponent,{width: '350px', disableClose:true, autoFocus:true, data:type});
  }

  openNav() {
    document.getElementById("mySidenav")!.style.width = "100%";
    document.getElementById("menu-icon")!.classList.add('hide');
  }
  
  closeNav() {
    document.getElementById("mySidenav")!.style.width = "0";
    document.getElementById("menu-icon")!.classList.remove('hide');
  }

  signOut(){
    this.auth.logOut();
  }

}