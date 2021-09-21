import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  readonly loginForm!: FormGroup;
  hide = true; //used to show or hide password

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public type: string,) {
    this.loginForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(null, [Validators.required, Validators.email]),
      secret: new FormControl(null, Validators.required),
      admin: new FormControl(false)
    })
   }

  ngOnInit(): void {}

  async login(){
    await this.authService.login(this.loginForm.value.email, this.loginForm.value.secret).then(()=>{
      setTimeout(() => {
        if (this.authService.user) this._snackBar.open(`Welcome back ${this.authService.user.displayName? this.authService.user.displayName: ''}`, 
      'Briggite', {panelClass: 'happy'});
      }, 500);
      this.dialogRef.close()
    })
  }
  
  signUp(){
    this.authService.signUp(
      this.loginForm.value.email, 
      this.loginForm.value.secret, 
      this.loginForm.value.name, 
      this.loginForm.value.admin);
      this.dialogRef.close();
    // avoid closing it on error
  }

}
