import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FireStoreService } from 'src/app/modules/shared/services/fire-store.service';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css']
})
export class ProjectsDetailsComponent implements OnInit {

  project: any;
  id!: string|null;

  constructor(
    private service: FireStoreService, 
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    // Must make sure a private project is not shown if not admin or owner, it is controlled from the backend
    // but front end should handle the situation and derivate
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id){
      this.service.get('projects', this.id!).valueChanges().subscribe((project) => {
        if (project) this.project = project;
        else alert('No data to visualize, please contact Briggite to obtain your personalized quotation')
      })
    }
  }

  // the original language menu should be transferred to a service and provide the chosen language info globally
  getLang(){
    if (window.location.pathname.split('/')[1] === 'en') return 'EN';
    if (window.location.pathname.split('/')[1] === 'fr') return 'FR';
    return 'ES';
  }

  projectsLoaded(){
    const proj: string[] = JSON.parse(localStorage.getItem('projects')!);
    if (proj && proj.length>1) return true;
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
        this.router.navigateByUrl(`/projects/project-details/${x[index+1]}`);
        this.service.get('projects', x[index+1]).valueChanges().subscribe((project: any) => {
          this.project = project;
          this.id = x[index+1];
          document.getElementById('focusTrapper')?.scrollIntoView();
        });
      }
      else{
        this.router.navigateByUrl(`/projects/project-details/${x[0]}`);
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
        this.router.navigateByUrl(`/projects/project-details/${newId}`);
        this.service.get('projects', newId).valueChanges().subscribe((project: any) => {
          this.project = project;
          this.id = newId;
          document.getElementById('focusTrapper')?.scrollIntoView();
        });
      }
      else{
        const newId = x[x.length - 1];
        this.router.navigateByUrl(`/projects/project-details/${newId}`);
        this.service.get('projects', newId).valueChanges().subscribe((project: any) => {
          this.project = project;
          this.id = newId;
          document.getElementById('focusTrapper')?.scrollIntoView();
        });
      }
    }
  }
}
