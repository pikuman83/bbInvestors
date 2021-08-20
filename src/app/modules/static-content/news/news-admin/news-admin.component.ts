import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { News } from '../news.component';

@Component({
  selector: 'app-news-admin',
  templateUrl: './news-admin.component.html',
  styleUrls: ['./news-admin.component.css']
})
export class NewsAdminComponent implements OnInit {
  
  @Input() news!: News;
  @Output() addEvent:EventEmitter<News> = new EventEmitter();
  @Output() editEvent:EventEmitter<News> = new EventEmitter();
  
  newsForm = this.fb.group({
    id: [''],
    cat: [''],
    title: ['', Validators.required],
    url: ['', Validators.required],
    src: [''],
    img: ['', Validators.required],
    downloadUrl: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('1',this.newsForm);

    if (this.news) {
      console.log('edit received in child', this.news)
      this.newsForm.patchValue({...this.news});
      console.log('Form Value', this.newsForm.value)
    }; 
  }


  createNews(form:FormGroup) {
    // emit = > add or edit request {form}
    // if this.news? emit edit
    // reset
    if (this.news) {
      form.value.id = Date.now();
      this.editEvent.emit(form.value);  
    }
    else{
      form.value.id = Date.now();
      this.addEvent.emit(form.value);
    }
    // accordion.close();
    // first element on page.focus()
  }
}