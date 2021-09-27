import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  constructor(public service: GlobalService) {this.service.showMenu1.next(false)}

  ngOnInit(): void {console.log('landing init')}
  ngOnDestroy():void {
    console.log('landing destroyed');
  }
}
