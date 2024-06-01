import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isErrorLogin: boolean = false;

  authService = inject(AuthService);
  router = inject(Router);

  handleLogin() {
    console.log('login', this.email, this.password);
    const isLogin = this.authService.login(this.email, this.password);
    if (isLogin) {
      this.isErrorLogin = false;
      this.router.navigate(['/employee']);
    } else {
      this.isErrorLogin = true;
    }
  }
}
