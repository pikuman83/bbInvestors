import { Injectable} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserProfile } from './interfaces';
import { CredentialsPromptComponent } from './login/credentials-prompt/credentials-prompt.component';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**For the method auth.currentUser you have to use awaits and keep track of the states manually
   * the current method with the observer used with onAuthstateChanged is a better solution*/
  public user: UserProfile|any;

  /** As admin role is not assignable directly from the web in firebase and a server app node.js is required
   * which uses admin sdk to manage users, a work around is done, creating a user profile collection*/
  isAdmin = false;

  constructor(readonly auth: AngularFireAuth, 
    private _snackBar: MatSnackBar, 
    private fire: AngularFirestore, 
    private dialog: MatDialog,
    private router:Router) {
    this.auth.onAuthStateChanged(user => {
      if (user){
        const currentUser = this.fire.collection('users').doc(user.uid).valueChanges().subscribe((x)=>{
          if (x){
            this.user = x;
            this.user.role === 'admin'? this.isAdmin = true: this.isAdmin = false;
          }
          else{
            this.user = null;
            this.isAdmin = false;
          }
        currentUser.unsubscribe()
      })
      } else {
        this.user = null;
        this.isAdmin = false;
      }
    })
  }

  /** Returns true if user is logged in */
  public get authenticated(): boolean {
    return !!this.user;
  }

  async login(email:string, password: string){
   await this.auth.signInWithEmailAndPassword(email, password)
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
   * @returns create and update currentUser, its profile with displayname and role.
   */
  signUp(email: string, password: string, displayName: string = '', admin: boolean) {
    if (this.user && this.isAdmin){
      this.auth.createUserWithEmailAndPassword(email, password)
      .then((credential)=> {
        this.auth.signOut().then(()=> {
          const dialogRef = this.dialog.open(CredentialsPromptComponent,
            {width: '300px', disableClose:true, autoFocus:true}).afterClosed()
            .subscribe(async (credentials)=>{
               await this.login(credentials.email, credentials.secret).then((x) => {
                this.createUser(credential.user, admin, displayName).then(()=>{
                  credential.user!.updateProfile({ displayName })
               })
            })
            dialogRef.unsubscribe();  
          })
        })
      })
      .catch(error => {
        this._snackBar.open(error.message, 'Sign-up failed.');
    });
    } else {
      this._snackBar.open('You are not authorized to create a user', 'Sign-up failed.');
    }
  }

  // function to be called on new sign up
  private createUser(user: any, admin: boolean, name:  string) {
    const data: UserProfile = {
      uid: user.uid,
      displayName: name,
      email: user.email,
      role: admin? 'admin': ''
    }
    return this.fire.collection('users').doc(user.uid).set(data);
  }


  logOut() {
    this._snackBar.open(`See you soon ${this.user.displayName}`,'Briggite', {panelClass: 'happy'});
    this.auth.signOut().then(() => this.router.navigate(['/home']));
  }

}