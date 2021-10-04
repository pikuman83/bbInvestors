import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit,OnDestroy {

  contactForm = this.fb.group({
    asunto: ['Quiero invertir'],
    name: ['', Validators.required],
    movil: ['', Validators.minLength(9)],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(5)]],
    terms: [false, [Validators.requiredTrue]]
  });

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log('Contact component initialised');
  }
  ngOnDestroy():void {
    console.log('Contact component destroyed');
  }

  onSubmit(form:FormGroup) {
    if (!form.value.terms){
      this._snackBar.open(`${$localize}:@@snackbar Must accept the terms and conditions`,'BBInvestors');
    }
    // send emails
    console.log(form.value)
  }

}
