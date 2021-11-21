import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { FireStoreService } from 'src/app/modules/shared/services/fire-store.service';
import { AuthService } from '../../shared/services/auth.service';
import { News } from '../../shared/interfaces';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

  news!: News|null;
  newsList =  <News[]>[];
  openPanel = false;
  isAdmin = false;

  constructor(private service: FireStoreService, 
    private storage: AngularFireStorage, 
    public auth: AuthService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.auth.isAdmin.subscribe(x => this.isAdmin = x)
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
      this.newsList = data;
    });
  }

  addNews(article:News){
    this.newsList?.push(article);
    this.service.create('news',article).catch((err: any) => this._snackBar.open(err, 'BBInvestors'))
    //.then(window.location.hash = '#start';
  }
  editNews(newObj: News): void {
    if (newObj && this.news) {
      this.service.update('news',this.news.id!, newObj)
        .then(() => {
          this.newsList = this.newsList?.map(x =>  {
            if (x.id === newObj.id) {
              x = newObj;
              return x;
            }
            return x
          })
          this.news = {};
          this._snackBar.open('Updated succefully','BBInvestors', {panelClass: 'happy'});
        })
        .catch(err => this._snackBar.open(err,'BBInvestors'));
    }
  }
  deleteNews(id: string|undefined, url: string|undefined, i: number): void {
    if (id) {
      if (confirm('Seguro que quiere eliminar este artículo?')){
        this.service.delete('news',id)
        .then(() => {
          this.storage.refFromURL(url!).delete();
          this._snackBar.open('Deleted succefully','BBInvestors');
        })
      .catch(err => this._snackBar.open(err, 'BBInvestors'));
      }
    }
  }

  scroll():  void{
    document.getElementById('news-admin')?.scrollIntoView();
  }

}