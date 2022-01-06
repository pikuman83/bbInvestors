import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { concatMap, map, take} from 'rxjs/operators';
import { FireStoreService } from 'src/app/modules/shared/services/fire-store.service';
import { AuthService } from '../../shared/services/auth.service';
import { Projects } from '../../shared/interfaces';
import { combineLatest, Observable} from 'rxjs';

@Component({
  selector: 'app-private-area',
  templateUrl: './private-area.component.html',
  styleUrls: ['./private-area.component.css']
})

export class PrivateAreaComponent implements OnInit {
  
  pList: Projects[] = [];

  constructor (
    public router: Router,
    private service: FireStoreService,
    public auth: AuthService) {}

  ngOnInit(): void {
    this.getCollection();
  }

/**
 * getPrivateData(uid) query the projects collection by user and bring only the project(s)
 * associated to that user.
 * then we obtain the id from its payload and query the rate of the project which has been saved 
 * separately for extra security (special read, write rules on the backend).
 * To flat all the queries together, subscribe them only once and execute them in a single iteration, 
 * rxjs operators are used. concatMap, mergemap or switchMap all provide access to the inner map,
 * combineLatest combine all the observables in the stream to subscribe them once and all together,
 * the obs are defined in the right manner to make calculations before being merged.
 * (as per now the app allows only single rate per project and not per user)
 * protected route (see app-routing)
 */

  async getCollection(): Promise<void> {
    await this.auth.auth.currentUser.then(user => {
      if (user) {
        this.getProjects(user!.uid)
      }
      else {
        this.pList = [{id: 'hello'}] //temporary for test
        // alert('Private zone, you are not authorized to access this area');
        // this.router.navigateByUrl('/projects')
      }
    })
  }

  getProjects(uid: string){
    this.service.getPrivateData(uid).snapshotChanges(['added']).pipe(take(1),
      map(payload => payload.map(c => 
        this.getRate(c, uid))), 
      concatMap(multipleObs => combineLatest(multipleObs)))
    .subscribe((data: Projects[]) => {
      return this.pList = data!;
    },
    (err: Error) => {
      alert(err.message);
      this.router.navigateByUrl('/projects')
    })
  }
  
  getRate(c: any, uid: string): Observable<Projects> {
    const id = c.payload.doc.id;
    const data = c.payload.doc.data();   
    return this.service.getRateList(id, uid)
    .valueChanges()
    .pipe(take(1), map((x: any) => {
      data.rate = x[0].rate;
      return {id, ...data}
    }))
  }

  // In the below method, as the use of mergeMap was dificult to apply on the begining as id and dataValue
  // has to be extracted from the map of the payload and only once the map was returned,
  // the inner observable has to be executed to work with the mergeMap.... to solve this, mergeMap with 
  // combineLatest has been used at the end to obtain the result.

  getLang(){
    if (window.location.pathname.split('/')[1] === 'en') return 'EN';
    if (window.location.pathname.split('/')[1] === 'fr') return 'FR';
    return 'ES';
  }

}