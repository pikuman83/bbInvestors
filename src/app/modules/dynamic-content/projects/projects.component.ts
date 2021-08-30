import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FireStoreService } from 'src/app/core/fire-store.service';

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
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectsComponent implements OnInit {

  tabIndex = 0;
  news!: any|null;
  newsList =  <any[]>[];
  openPanel = false;
  tabs: [string] = ['ALL'];
  tabContent = <any[]>[];

  constructor(
    private service: FireStoreService, 
    private storage: AngularFireStorage, 
    public router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllNewsList();
  }

  getAllNewsList(): void{
    this.service.getAll('projects').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.newsList = data!;
      this.newsList.map(x => x.ciudad).map(y => {
        if (!this.tabs.includes(y)){
          this.tabs.push(y);
        }
      });
      this.tabContent = this.newsList;
      const city = this.route.snapshot.paramMap.get('city');
      const i = this.tabs.indexOf(city!);
      if(i) this.tabIndex = i;
    });
  }

  filterByCity(i: number){
    if(this.tabs[i]==='ALL') {
      this.tabContent = this.newsList;  
      return this.tabContent;
    }
    this.tabContent = this.newsList.filter(x => x.ciudad === this.tabs[i]);
    return this.tabContent;
  }
  
  addProject(article:any){
    // this.newsList?.push(article);
    this.service.create('projects',article).then(()=> {
      // set tab focus
    })
  }
  editNews(newObj: any): void {
    if (newObj && this.news) {
      this.service.update('projects', this.news.id!, newObj)
        .then(() => {
          this.news = {};
          // turn form fields error state to valid.
          // notify?
          }
        )
        .catch(err => // notify?
          console.error(err)
        );
    }
  }
  deleteNews(id: string|undefined, project: any): void {
    if (id) {
      this.service.delete('projects', id)
        .then(() => {
          this.storage.refFromURL(project.fotoAntes).delete();
          this.storage.refFromURL(project.fotoDsps).delete();
          this.storage.refFromURL(project.fotoFinal).delete();
          if(project.fotosObra.length){
            project.fotosObra.forEach((url:any) => {
              this.storage.refFromURL(url).delete();
            });
          }
          this.tabs.splice(this.tabs.indexOf(project.ciudad), 1)
          // show confirmation?
          // refresh cities tabs array
        })
    .catch(err => 
      // show error?
      console.error(err)
      );
    }
  }

}