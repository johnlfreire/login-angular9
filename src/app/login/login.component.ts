import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }
  onSubmit() {

    this.auth.login(
     
      this.loginForm.get('username').value,
      this.loginForm.get('password').value
    ).then(error =>  this.openSnackBar('error.message')).catch(error =>{  
      this.openSnackBar(error.message)});   
  }

  loginGoogle() {
    this.auth.loginWithGoogle().then(()=>  this.router.navigate(['/index']));
  }
  
  openSnackBar(error) {
    this._snackBar.open(error, '', {
      duration: 3000,  
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:['error'],
    });
}

}