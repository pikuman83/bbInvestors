import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  showMenu = new BehaviorSubject<boolean>(true);
  // showMenu: boolean = true;

  constructor() {}
  
}
