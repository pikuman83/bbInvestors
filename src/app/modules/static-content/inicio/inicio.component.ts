import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { FireStoreService } from 'src/app/core/fire-store.service';
import { News } from '../../shared/interfaces';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {

  newsList =  <News[]>[];

  constructor(private service: FireStoreService) { }

  ngOnInit(): void {
    this.getNews();
    console.log('inicio init')
  }
  ngOnDestroy():void {
    console.log('inicio destroyed');
  }

  getNews(): void{
    this.service.getNewsPartial().valueChanges().subscribe(news => this.newsList = news)
  }
  
}
