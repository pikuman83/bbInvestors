import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FireStoreService } from 'src/app/core/fire-store.service';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css']
})
export class ProjectsDetailsComponent implements OnInit {

  project: any; 

  constructor(private service: FireStoreService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.get('projects', id!).valueChanges().subscribe((project) => this.project = project);
  }

}
