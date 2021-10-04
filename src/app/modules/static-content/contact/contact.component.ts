import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm = this.fb.group({
    asunto: ['Quiero invertir'],
    name: ['', Validators.required],
    movil: ['', Validators.minLength(9)],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(5)]],
    terms: [false, [Validators.requiredTrue]]
  });

  showHeader = false;
  constructor(
    private fb: FormBuilder, 
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showHeader = !!this.route.snapshot.paramMap.get('param');
  }

  onSubmit(form:FormGroup) {
    if (!form.value.terms){
      this._snackBar.open(`${$localize}:@@snackbar Must accept terms and conditions`,'BBInvestors');
    }
    // send emails
    console.log(form.value)
  }

}
