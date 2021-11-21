import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { concatMap, map} from 'rxjs/operators';
import { FireStoreService } from 'src/app/modules/shared/services/fire-store.service';
import { AuthService } from '../../shared/services/auth.service';
import { Projects } from '../../shared/interfaces';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-private-area',
  templateUrl: './private-area.component.html',
  styleUrls: ['./private-area.component.css']
})
export class PrivateAreaComponent implements OnInit {
  
  pList =  <Projects[]>[];

  constructor(
    public router: Router,
    private service: FireStoreService,
    public auth: AuthService) {}

  ngOnInit(): void {
    this.getCollection();
  }

  getLang(){
    if (window.location.pathname.split('/')[1] === 'en') return 'EN';
    if (window.location.pathname.split('/')[1] === 'fr') return 'FR';
    return 'ES';
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
 */
  getCollection(): void{
    this.auth.auth.currentUser.then((user) => {
      this.service.getPrivateData(user!.uid).snapshotChanges(['added']).pipe(
        map(payload => payload.map(c => {
          // console.log('1');
          const id = c.payload.doc.id;
          const data = c.payload.doc.data();          
          return this.service.getRateList(id, user!.uid).valueChanges().pipe(map((x: any) => {
            data.rate = x[0].rate;
            // console.log('2', data.rate)
            return {id, ...data}
          }))})), concatMap(x => combineLatest(x)))
      .subscribe((data: any) => {
        // console.log('3', data)
        this.pList = data!;
      })
    })
  }

  // In the above method, as the use of mergeMap was dificult to apply on the begining as id and dataValue
  // has to be extracted from the map of the payload and only once the map was returned
  // the inner observable has to be executed to work with the mergeMap.... to solve this, mergeMap with 
  // combineLatest has been used at the end to obtain the result.

}
  // First intent without RXJS Operators, it was not the fastest way to get the data, as 
  // the streams were being iterate several times.
  // getCollection(): void{
  //   this.auth.auth.user.subscribe((x: any) =>  {
  //     console.log('1');
  //     this.service.getPrivateData(x.uid).snapshotChanges().pipe(
  //       map(changes => changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()}))))
  //         .subscribe(data => {
  //           console.log('2 subsciption1');
  //           if (data && data.length){
  //             for (let d of data){
  //               console.log('3');
  //               this.service.getRateList(d.id).valueChanges().subscribe((x: rateList[])=> {
  //                 console.log('4 subscription4', x);
  //               d.rate = x[0].rate;
  //             })
  //           };
  //         this.pList = data!;
  //       }
  //     })
  //   })
  // }