import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FireStoreService } from 'src/app/core/fire-store.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @Output() closeEvent:EventEmitter<any> = new EventEmitter();
  contactForm = this.fb.group({
    asunto: ['Quiero invertir'],
    name: ['', Validators.required],
    movil: ['', Validators.minLength(9)],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(5)]],
    terms: [false, [Validators.requiredTrue]],
    time: [new Date()]
  });

  showHeader = false;

  constructor(
    private fb: FormBuilder, 
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private service: FireStoreService) {}

  ngOnInit(): void {
    this.showHeader = !!this.route.snapshot.paramMap.get('param');
  }

  onSubmit(form:FormGroup) {
    if (!form.value.terms){
      this._snackBar.open(`Must accept terms and conditions`,'BBInvestors');
      return
    }
    else{
      if (this.contactForm.valid){
        const msg = {
          to: form.value.email,
          from: 'Briggite<wahab_anjum@hotmail.com>',
          bcc: 'wahab_anjum@hotmail.com',
          message: {
            subject: `${form.value.asunto} con BB for Investors`,
            html: `<strong>Hello ${form.value.name}!!</strong> Thank you very much for contacting, 
            we have received your message and will get back to you as soon as possible. <br>
            Message details: ${form.value.message}<br>${form.value.movil}`,
          }
        };
        try {
          this.service.create('contacts', msg).then(()=>{
            this._snackBar.open(`Thank you for contacting us, we will come back to you as soon as possible`,'BBInvestors', {panelClass: 'happy'});
            this.closeEvent.emit()
          })
        } catch (error: any) {
          this._snackBar.open(error.message,'BBInvestors');
        }
      }
    }
  }

}
