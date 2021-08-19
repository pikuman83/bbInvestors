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
  uploadPercent!: Observable<number|undefined>;

  uploadFile(event: any) {
    const file = event.target.files[0];
    
    if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/svg' ){
      alert('Invalid file types, Please select an image');
      return;
    }

    const task = this.storage.upload(`News/${file.name}`, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(() => {
      this.fileName = file.name;
      this.fileEvent.emit(file.name);
    })).subscribe();
  }

  deleteImg(){
    this.storage.ref(`News/${this.fileName}`).delete();
      this.fileName = '';
      this.fileEvent.emit('');
  }
}