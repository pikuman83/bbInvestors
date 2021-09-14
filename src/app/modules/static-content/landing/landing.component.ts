import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(public service: GlobalService) { service.showMenu = false }

  ngOnInit(): void {}
  ngOnDestroy(): void{console.log('landing destroyed')}
  
}
