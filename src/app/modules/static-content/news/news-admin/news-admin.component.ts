import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-news-admin',
  templateUrl: './news-admin.component.html',
  styleUrls: ['./news-admin.component.css']
})
export class NewsAdminComponent implements OnInit {
  
  newsForm = this.fb.group({
    img: ['', Validators.required],
    cat: [''],
    title: ['', Validators.required],
    url: ['', Validators.required],
    src: ['']
  });
  // const id = Math.random().toString(36).substring(2);
  @Input() popup=true;

  constructor(private fb: FormBuilder) {
    // firestore: AngularFirestore
    // console.log(firestore.collection('news').valueChanges)
   }

  ngOnInit(): void {
    console.log('Contact component initialised');
  }
  ngOnDestroy():void {
    console.log('Contact component destroyed');
  }

  close(e: Event){
    console.log(e.target)
  }
  onSubmit(form:FormGroup) {
    // send emails
    console.log(form)
  }

}
