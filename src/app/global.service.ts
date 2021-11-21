import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  showMenu = new Subject<boolean>();

  constructor() {}
  
}
