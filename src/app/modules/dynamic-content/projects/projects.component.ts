import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FireStoreService } from 'src/app/core/fire-store.service';
import { AuthService } from '../../shared/auth.service';
import { Projects, rateList } from '../../shared/interfaces';

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
  // isAdmin = false;

  constructor(
    private service: FireStoreService, 
    private storage: AngularFireStorage, 
    public router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public auth: AuthService,
    private fire: AngularFirestore) {}

  ngOnInit(): void {
    this.auth.auth.onAuthStateChanged((user) => {
      if (user){
        this.fire.collection('users').doc(user.uid).valueChanges().subscribe((x:any)=>
          this.getCollection(!!x.role));
      }
      else{
        this.getCollection(false)
      }
    })
  }

  getLang(){
    if (window.location.pathname.split('/')[1] === 'en') return 'EN';
    if (window.location.pathname.split('/')[1] === 'fr') return 'FR';
    return 'ES';
  }

  getCollection(role: boolean): void{
    try {
      if (role) {
        this.service.getProjectsAdmin().snapshotChanges().pipe(
          map(changes => changes.map(c => 
            ({id: c.payload.doc.id, ...c.payload.doc.data()}))))
          .subscribe(data => {
            for (let proj of data){
              this.service.getRateList(proj.id).valueChanges().subscribe((x: rateList[]) => {proj.rate = x[0].rate})
            }
            this.processData(data);
            });
      }
      else {
        this.service.getAll('projects').snapshotChanges().pipe(
          map(changes => changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()}))))
          .subscribe(data => {this.processData(data)});
      }
    } catch (error) {
      console.log('error caught', error);
      this.router.navigate(['/home'])
    }
  }

  processData(data: Projects[]){
    this.emptyLocalStorage();
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
  }

  emptyLocalStorage(){
    const LS = localStorage.getItem('projects');
    if (LS) localStorage.removeItem('projects');
    localStorage.setItem('projects', '');
  }

  getRate(id: string){
    this.service.getRateList(id).valueChanges().subscribe((x: any) => {console.log('rate in getrate',x.rate);return x.rate})
  }
  
  filterByCity(i: number){
    if(this.tabs[i]==='ALL') {
      this.tabContent = this.pList;  
      return this.tabContent;
    }
    this.tabContent = this.pList.filter(x => x.ciudad === this.tabs[i]);
    return this.tabContent;
  }
  
  addProject(project:Projects){
    const rate = project.rate;
    project.rate = 0;
    this.service.create('projects',project).then((x: any)=> {
      const rateList: rateList = {
        pid: x.id,
        rate: rate,
        user: this.auth.user.uid
      }
      this.service.create('rateList', rateList).then(()=> {
        this._snackBar.open('Published succefully','BBInvestors', {panelClass: 'happy'});
      })
    })
  }
  
  /**
   * @param currentProject = selected project from the loop on the template
   * gets and save ratelist collection's id for later use in editing
   * patch values brought safely from ratelist to the current project
   */
  rateRef!: string;
  sendEdit(currentProject: Projects){
    if (this.auth.authenticated && this.auth.isAdmin){
      this.service.getRateList(currentProject.id!).snapshotChanges().pipe(
        map(changes => changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()
        })))).subscribe((x: rateList[])=> {
        currentProject.rate = x[0].rate;
        this.rateRef = x[0].id!;
        this.project = currentProject; //changes on this.projects are linked with onChanges of admin component.
      })
    }
  }
  editProject(newObj: Projects): void {
    if (newObj && this.project) {
      const data: any = {
        rate: newObj.rate!,
        user: newObj.user!
      }
      this.service.updateRateList(this.rateRef, data).then(() => {
        newObj.rate = 0;
        this.service.update('projects', this.project!.id!, newObj)
        .then(() => {
          this.rateRef = '';
          this.tabs = ['ALL'];
          this.pList.map(x => x.ciudad).map(y => {
            if (!this.tabs.includes(y!)){
              this.tabs.push(y!);
            }
          });
          this._snackBar.open('Updated succefully','BBInvestors', {panelClass: 'happy'});
        })
      })
      .catch(err =>this._snackBar.open(err,'BBInvestors'));
    }
  }
  deleteDoc(id: string|undefined, project: any): void {
    if (id) {
      if (this.auth.authenticated && this.auth.isAdmin){
        if(confirm('Seguro que quiere eliminar este proyecto?')){
          this.service.delete('projects', id)
          .then(() => {
            this.storage.refFromURL(project.fotoAntes).delete().subscribe(()=>
            this.storage.refFromURL(project.fotoDsps).delete().subscribe(()=>
            this.storage.refFromURL(project.fotoFinal).delete().subscribe(()=>{
              if(project.fotosObra.length){
                project.fotosObra.forEach((url:any) => {
                  this.storage.refFromURL(url).delete();
                });
              }
            })
          ));
          this.service.getRateList(id!).snapshotChanges().pipe(
            map(changes => changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()}))
            )).subscribe((x: rateList[])=> {
              const rateRef = x[0].id; 
              this.service.delete('rateList', rateRef!).then(()=>{
                this.tabs = ['ALL'];
                this.pList.map(x => x.ciudad).map(y => {
                  if (!this.tabs.includes(y!)){
                    this.tabs.push(y!);
                  }
                });
              this._snackBar.open('Deleted succefully','BBInvestors');
              })
            })
        })
      .catch(err => 
        this._snackBar.open(err,'BBInvestors'));}
      }
    }
  }

}