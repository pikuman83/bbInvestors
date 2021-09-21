import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FireStoreService } from 'src/app/core/fire-store.service';
import { AuthService } from '../../shared/auth.service';
import { Projects } from '../../shared/interfaces';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectsComponent implements OnInit {

  tabIndex = 0;
  project!: Projects|null;
  pList =  <Projects[]>[];
  openPanel = false;
  tabs: [string] = ['ALL'];
  tabContent = <Projects[]>[];

  constructor(
    private service: FireStoreService, 
    private storage: AngularFireStorage, 
    public router: Router,
    private route: ActivatedRoute,
    public auth: AuthService) { }

  ngOnInit(): void {
    this.getCollection();
  }

  getCollection(): void{
    const LS = localStorage.getItem('projects');
    if (LS) localStorage.removeItem('projects');
    localStorage.setItem('projects', '');
    this.service.getAll('projects').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()
        }))
        // changes.map(x => this.idList.push(x.payload.doc.id))
      )
    ).subscribe(data => {
      localStorage.setItem('projects', JSON.stringify(data.map(x => x.id)));
      this.pList = data!;
      this.pList.map(x => x.ciudad).map(y => {
        if (!this.tabs.includes(y!)){
          this.tabs.push(y!);
        }
      });
      this.tabContent = this.pList;
      const city = this.route.snapshot.paramMap.get('city');
      const i = this.tabs.indexOf(city!);
      if(i) this.tabIndex = i;
    });
  }

  filterByCity(i: number){
    if(this.tabs[i]==='ALL') {
      this.tabContent = this.pList;  
      return this.tabContent;
    }
    this.tabContent = this.pList.filter(x => x.ciudad === this.tabs[i]);
    return this.tabContent;
  }
  
  addProject(article:any){
    this.service.create('projects',article).then(()=> {
      // set tab focus
    })
  }
  editProject(newObj: any): void {
    if (newObj && this.project) {
      this.service.update('projects', this.project.id!, newObj)
        .then(() => {
          this.project = {};
          // notify?
          }
        )
        .catch(err =>
          alert(err)
        );
    }
  }
  deleteDoc(id: string|undefined, project: any): void {
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
          // this.tabs.splice(this.tabs.indexOf(project.ciudad), 1) DELETE ONLY IF NO MORE CITY IS AVAILABLE OR IT WILL BE DONE AUTOMATICALLY
          // show confirmation?
        })
    .catch(err => 
      alert(err)
      );
    }
  }

}