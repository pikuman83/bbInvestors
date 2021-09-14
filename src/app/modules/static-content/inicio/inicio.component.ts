import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { FireStoreService } from 'src/app/core/fire-store.service';
import { News } from '../news/news.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  newsList =  <News[]>[];

  constructor(private service: FireStoreService) { }

  ngOnInit(): void {
    this.getAllNewsList();
  }

  getAllNewsList(): void{
    this.service.getAll('news').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
        this.newsList = data.slice(0, 3);
    });
  }
}
