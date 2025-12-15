import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  fullName = '';
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  register() {
    // 🔴 VALIDASI FORM
    if (!this.fullName || !this.username || !this.email || !this.password || !this.confirmPassword) {
      alert('Semua field wajib diisi!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }

    // 🔴 PANGGIL API REGISTER
    this.api.register({
      username: this.username.trim(),
      password: this.password,
      email: this.email.trim(),
      company_id: 1,
      factory_id: 1,
      is_active: 1
    }).subscribe({
      next: (res: any) => {
        alert(res?.message || 'Register berhasil');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Register error:', err);
        alert(err.error?.message || 'Register gagal');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
