// Open panel on edit click
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { FireStoreService } from 'src/app/core/fire-store.service';
import { AuthService } from '../../shared/auth.service';

export interface News{
  id?: string;
  cat?: string;
  title?: string;
  url?: string;
  src?: string;
  img?: string;
  downloadUrl?: string 
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

  news!: News|null;
  newsList =  <News[]>[];
  openPanel = false;

  constructor(private service: FireStoreService, 
    private storage: AngularFireStorage, 
    public auth: AuthService) { }

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
      this.newsList = data;
    });
  }

  // #template
  addNews(article:News){
    this.newsList?.push(article);
    this.service.create('news',article).then(()=> {
      // window.location.hash = '#start';
    })
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
          // notify?
        })
        .catch(err => console.log(err));
    }
  }
  deleteNews(id: string|undefined, url: string|undefined, i: number): void {
    if (id) {
      // this.newsList?.splice(i, 0);
      this.service.delete('news',id)
        .then(() => {
          this.storage.refFromURL(url!).delete();
          // show confirmation?
        })
    .catch(err => 
      // show error?
      console.error(err)
      );
    }
  }

  // scroll():  void{
  //   document.getElementById('news-section')?.scrollIntoView();
  //   document.getElementById('scroll-icon')?.classList.add('hide-scroll');
  // }

}