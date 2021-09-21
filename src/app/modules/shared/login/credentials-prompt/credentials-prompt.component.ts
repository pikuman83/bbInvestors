import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-credentials-prompt',
  templateUrl: './credentials-prompt.component.html',
  styleUrls: ['./credentials-prompt.component.css']
})
export class CredentialsPromptComponent implements OnInit {

  readonly form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CredentialsPromptComponent>) {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      secret: new FormControl(null, Validators.required)
    })
  }

  ngOnInit(): void {}

  close(){
    this.dialogRef.close({email: this.form.value.email, secret: this.form.value.secret})
  }

}  