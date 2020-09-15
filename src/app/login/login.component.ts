import { Component, OnInit } from '@angular/core';
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
  fieldTextType = true;
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
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
    ).then(() =>  this.router.navigate(['/index'])).catch(error =>{  
      this.openSnackBar(error.message)});   
  }

  loginGoogle() {
    this.auth.loginWithGoogle().then(()=>  this.router.navigate(['/index'])).catch(error =>{  
      this.openSnackBar(error.message)});   
  }
  
  openSnackBar(error) {
    this._snackBar.open(error, '', {
      duration: 3000,  
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:['error'],
    });
}
toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}

}