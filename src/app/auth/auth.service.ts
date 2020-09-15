import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import{User} from '../models/user'
import { Observable, of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;

  constructor(public afAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore,) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
          // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    )
  }
  async login(email: string, password: string) {
    try { 
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(
      email,
      password
    ); 

      this.updateUserData(credential.user);
      return credential.user;
    } catch (error) {
      return Promise.reject(new Error('A senha é inválida ou o usuário não possui uma senha!'))
    }

    
    //this.router.navigate(['index']);
  }
  async register(email: string, password: string) {
    var result = await this.afAuth.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    this.sendEmailVerification();
  }
  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
  }
  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
  async loginWithGoogle() {
    try { 
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  } catch (error) {
    return Promise.reject(new Error('Ocorreu um problema efetuar o acesso!'))
  }
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    }

    return userRef.set(data, { merge: true })

  }

}
