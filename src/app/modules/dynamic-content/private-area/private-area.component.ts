import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FireStoreService } from 'src/app/core/fire-store.service';
import { AuthService } from '../../shared/auth.service';
import { Projects, rateList } from '../../shared/interfaces';

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
    this.getCollection()
  }

  getLang(){
    if (window.location.pathname.split('/')[1] === 'en') return 'EN';
    if (window.location.pathname.split('/')[1] === 'fr') return 'FR';
    return 'ES';
  }

  getCollection(): void{
    this.auth.auth.currentUser.then((user) => {
      this.service.getPrivateData(user!.uid).snapshotChanges().pipe(
        map(changes => changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()
          })))).subscribe(data => {
            if (data && data.length){
              for (let d of data){
                this.service.getRateList(d.id).snapshotChanges().pipe(
                  map(changes => changes.map(c => ({id: c.payload.doc.id, ...c.payload.doc.data()
                })
              ))
            ).subscribe((x: rateList[])=> {d.rate = x[0].rate;})
          };
        this.pList = data!;
        }
      })
    })
  }

}