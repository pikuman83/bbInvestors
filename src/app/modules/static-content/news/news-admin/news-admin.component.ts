import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { News } from '../news.component';

@Component({
  selector: 'app-news-admin',
  templateUrl: './news-admin.component.html',
  styleUrls: ['./news-admin.component.css']
})
export class NewsAdminComponent implements OnInit, OnChanges {
  
  @Input() edit: News = {};
  @Input() openPanel = false;
  
  @Output() addEvent:EventEmitter<News> = new EventEmitter();
  @Output() editEvent:EventEmitter<News> = new EventEmitter();
  @Output() focusEvent:EventEmitter<any> = new EventEmitter();
  @Output() panelEvent:EventEmitter<any> = new EventEmitter();
  
  newsForm = this.fb.group({
    cat: [''],
    title: ['', Validators.required],
    url: ['', Validators.required],
    src: [''],
    img: ['', Validators.required],
    downloadUrl: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    if (this.edit) {
      this.newsForm.patchValue({...this.edit});
    };
  }
  
  afterExpandFocus(){
    document.getElementById('firstField')?.focus();
  }

  createNews(form:FormGroup) {
    if (this.edit&&this.edit.id) {
      this.editEvent.emit(form.value);
      this.edit = {};
    }
    else{
      this.addEvent.emit(form.value);
    }
    this.newsForm.reset();
    this.focusEvent.emit();
  }
}