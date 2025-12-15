import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username = '';
  password = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    const data = {
      username: this.username,
      password: this.password,
    };

    this.api.login(data).subscribe({
      next: (res: any) => {
        console.log('LOGIN BERHASIL:', res);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        console.error('LOGIN ERROR:', err);
        alert(err.error?.message || 'Login gagal dari server');
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}