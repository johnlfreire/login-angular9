import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private auth: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  sendEmail() {
    this.auth.sendEmailVerification();
    this._snackBar.open('Em breve, você recebera um link para validar seu e-mail!', '', {
      duration: 3000,  
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:['sucess'],
    });
   
    this.router.navigate(['/login']);
  }


}
