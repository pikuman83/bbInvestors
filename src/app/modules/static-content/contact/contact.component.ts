import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log('Contact component initialised');
  }
  ngOnDestroy():void {
    console.log('Contact component destroyed');
  }

  onSubmit(form:FormGroup) {
    // send emails
    console.log(form)
  }

}
