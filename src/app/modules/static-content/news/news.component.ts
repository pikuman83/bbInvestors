import { Component, OnInit } from '@angular/core';

export interface News{
  id: string,
  cat: string;
  title: string;
  url: string;
  src: string;
  img: string;
  downloadUrl: string 
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

  public news!: News;
  newsList: News[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getAllNewsList();
  }

  getAllNewsList(){
    // bring list from store
  }
  addNews(e:News){
    this.newsList.push(e);
    document.getElementById('focus')?.focus();
    // window.location.hash = '#start';
    // add to store
  }
  editNews(newObj: News){
    const i = this.newsList.indexOf(this.news);
    if (~i) this.newsList[i] = newObj;
    // edit it in the store
  }
  deleteNews(id: string, i: number){
    this.newsList.splice(i, 1);
    // delete from the store
  }
}