import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  showMenu1 = new Subject<boolean>();
  showMenu: boolean = true;

  constructor() {this.showMenu1.subscribe(x => this.showMenu = x) }
  
}
