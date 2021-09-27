import { Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(public service: GlobalService,
    public dialog: MatDialog,
    public auth: AuthService
    ){}

  ngOnInit() {this.setLang();}

  ngOnDestroy():void{
    this.showForm = false;
    document.getElementById('popUp')!.classList.remove('popupForm');
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