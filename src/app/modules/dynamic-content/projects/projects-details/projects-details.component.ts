import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FireStoreService } from 'src/app/core/fire-store.service';
import { AuthService } from 'src/app/modules/shared/auth.service';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css']
})
export class ProjectsDetailsComponent implements OnInit, OnDestroy {

  project: any;
  id!: string|null;

  constructor(
    private service: FireStoreService, 
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.service.get('projects', this.id!).valueChanges().subscribe((project) => this.project = project);
    this.auth.auth.onAuthStateChanged(() => { this.router.navigate(['/projects'])})
    console.log('proj details init')
  }
  ngOnDestroy():void {
    console.log('proj details destroyed');
  }
  getLang(){
    if (window.location.pathname.split('/')[1] === 'en') return 'EN';
    if (window.location.pathname.split('/')[1] === 'fr') return 'FR';
    return 'ES';
  }

  projectsLoaded(){
    const proj = localStorage.getItem('projects');
    if (proj && proj.length) return true;
    return false;
  }

  /**
    * The following 2 functions brings id list from local storage, by other function, it is controlled that 
    * if projects are not loaded in local storage or they doesn't exist, previous and next buttons will 
    * be hidden* router.navigate only should work, but it was not working so, it is used only to change 
    * the url and the init function is repeated manually.
    * if last index, it moves to the first and vicevresa
  */

  next(): void{
    const x: string[] = JSON.parse(localStorage.getItem('projects')!);
    const index = x.indexOf(this.id!);
    if (x){
      if (index !== x.length - 1){
        this.router.navigate([`/projects/project-details/${x[index+1]}`]);
        this.service.get('projects', x[index+1]).valueChanges().subscribe((project: any) => {
          this.project = project;
          this.id = x[index+1];
          document.getElementById('focusTrapper')?.scrollIntoView();
        });
      }
      else{
        this.router.navigate([`/projects/project-details/${x[0]}`]);
        this.service.get('projects', x[0]).valueChanges().subscribe((project: any) => {
          this.project = project;
          this.id = x[0];
          document.getElementById('focusTrapper')?.scrollIntoView();
        });
      }
    }
  }

  previous(): void{
    const x: string[] = JSON.parse(localStorage.getItem('projects')!);
    const index = x.indexOf(this.id!);
    if (x){
      if (index !== 0){
        const newId = x[index - 1];
        this.router.navigate([`/projects/project-details/${newId}`]);
        this.service.get('projects', newId).valueChanges().subscribe((project: any) => {
          this.project = project;
          this.id = newId;
          document.getElementById('focusTrapper')?.scrollIntoView();
        });
      }
      else{
        const newId = x[x.length - 1];
        this.router.navigate([`/projects/project-details/${newId}`]);
        this.service.get('projects', newId).valueChanges().subscribe((project: any) => {
          this.project = project;
          this.id = newId;
          document.getElementById('focusTrapper')?.scrollIntoView();
        });
      }
    }
  }
}
