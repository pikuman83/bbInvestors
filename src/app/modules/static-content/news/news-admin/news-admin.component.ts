import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-news-admin',
  templateUrl: './news-admin.component.html',
  styleUrls: ['./news-admin.component.css']
})
export class NewsAdminComponent implements OnInit {
  
  newsForm = this.fb.group({
    cat: [''],
    title: ['', Validators.required],
    url: ['', Validators.required],
    src: [''],
    img: [null, Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('Contact component initialised');
  }

  ngOnDestroy():void {
    console.log('Contact component destroyed');
  }

  createNews(form:FormGroup) {
    console.log(form.value)
  }

}
