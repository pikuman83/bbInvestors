// Clean up on error or not submission or run a periodic scan for cleaning

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  constructor(private storage: AngularFireStorage) { }

  ngOnInit(): void {}

  @Output() fileEvent:EventEmitter<any> = new EventEmitter();
  @Input() fileName = '';

  @Input() pName = '';
  @Input() URL = '';
  @Input() title!: string;

  uploadPercent!: Observable<number|undefined>;
  downloadURL!: Observable<string>;

  uploadFile(event: any) {
    const file = event.target.files[0];
    this.fileName = file.name;

    if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/svg' ){
      alert('Invalid file types, Please select an image');
      return;
    }

    const filePath = this.title === 'Imagen'? 
      `News/${Date.now().toString()}`:
      `Projects/${this.pName}/${Date.now().toString()}`;
    const fileRef = this.storage.ref(`${filePath}/${file.name}`);
    const task = this.storage.upload(`${filePath}/${file.name}`, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      fileRef.getDownloadURL().subscribe((x) => {
        this.URL = x;
        this.fileEvent.emit({'img':file.name, URL: x});
      })
    })).subscribe();
  }

  deleteImg(){
    this.storage.refFromURL(this.URL).delete();
      this.fileName = '';
      this.URL = '';
      this.fileEvent.emit({'img':'', URL: ''});
  }
}