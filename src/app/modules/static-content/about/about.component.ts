import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
    console.log('about init')
  }
  ngOnDestroy():void {
    console.log('about destroyed');
  }

}
