import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit{

  constructor() { }

  ngOnInit(): void {}

  scrollToElement(el: HTMLDivElement): void {
    el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
  }

}
