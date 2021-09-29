import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DynamicRoutingModule } from './dynamic-routing.module';
import { ProjectsComponent } from './projects/projects.component';
import { SharedModule } from "../shared/shared.module";
import { ProjectsAdminComponent } from './projects/projects-admin/projects-admin.component';
import { ProjectsDetailsComponent } from './projects/projects-details/projects-details.component';
import { PrivateAreaComponent } from './private-area/private-area.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsAdminComponent,
    ProjectsDetailsComponent,
    PrivateAreaComponent
  ],
  imports: [
    SharedModule,
    DynamicRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicModule { }
