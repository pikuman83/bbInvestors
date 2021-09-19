import { Injectable} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { default as firebase } from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';

export type User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** User object snapshot */
  public user: User|any;
  /**Right way to get user */
    // public get user(): User { 
    //   return this.auth.currentUser; 
    // }

  constructor(readonly auth: AngularFireAuth, private _snackBar: MatSnackBar) {
    this.auth.onAuthStateChanged(user => this.user = user)
  }

  /** Returns true if user is logged in */
  public get authenticated(): boolean {
    return !!this.user;
  }

  login(email:string, password: string){
    // this.auth.authState.subscribe((x)=> {x?.getIdTokenResult()}) //probably you can set and get claims like this.
    this.auth.signInWithEmailAndPassword(email, password)
    .catch((error) => {
      if (error.code === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        this._snackBar.open(error.message, 'Login failed.');
      }
    });
  }

  /**
   * Registers a new user by email and confirmPasswordReset
   * @param email the email to register with
   * @param password the secret password
   * @param name (optional) the user name
   * @returns the authenticated User object
   */
  signUp(email: string, password: string, displayName: string = 'Investor') {
    this.auth.createUserWithEmailAndPassword(email, password)
    .then((credential)=> {
      this.auth.credential.subscribe(x=> x?.user?.updateProfile)
      credential.user!.updateProfile({ displayName } as User)
        .then( () => {credential.user;}) // Returns the updated User object
    })
    .catch(error => {
      this._snackBar.open(error.message, 'Sign-up failed.');
    });
  }

  logOut() {
    this.auth.signOut().then(() => {
      this._snackBar.open('See you soon','Briggite', {panelClass: 'happy'});
    });
  }

}