import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthGuard } from './auth/auth.guard';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'index', component: IndexComponent, canActivate: [AuthGuard] },
  {path: '**', redirectTo: '/register'}


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
