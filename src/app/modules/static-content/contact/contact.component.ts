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
    movil: [''],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });
  
  @Input() popup=true;
  // this will be used to add css classes for
  // heading
  // button color and size
  // total width
  // background and animations
  // show the top title and close bar

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log('Contact component initialised');
  }
  ngOnDestroy():void {
    console.log('Contact component destroyed');
  }

  close(e: Event){
    console.log(e.target)
  }
  onSubmit(form:FormGroup) {
    // send emails
    console.log(form)
  }

}
