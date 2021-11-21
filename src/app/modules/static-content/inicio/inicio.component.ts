import { Component, OnInit } from '@angular/core';
import { FireStoreService } from 'src/app/modules/shared/services/fire-store.service';
import { News } from '../../shared/interfaces';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  newsList =  <News[]>[];

  constructor(private service: FireStoreService) { }

  ngOnInit(): void {
    this.getNews();
  }

  getNews(): void{
    this.service.getNewsPartial().valueChanges().subscribe(news => this.newsList = news)
  }
  
}
