import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  totalAssets = 0;
  totalCompanies = 0;
  totalFactories = 0;
  totalDepartments = 0;
  totalLocations = 0;
  totalCategories = 0;

  recentActivities = [
    { action: 'Aset baru ditambahkan', time: '2 jam lalu', type: 'create' },
    { action: 'Update data pabrik', time: '5 jam lalu', type: 'update' },
    { action: 'Departemen baru dibuat', time: '1 hari lalu', type: 'create' },
  ];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.api.getAssets().subscribe((res: any) => {
      this.totalAssets = res.data ? res.data.length : res.length;
    });

    this.api.getCompanies().subscribe((res: any) => {
      this.totalCompanies = res.data ? res.data.length : res.length;
    });

    this.api.getFactories().subscribe((res: any) => {
      this.totalFactories = res.data ? res.data.length : res.length;
    });

    this.api.getDepartments().subscribe((res: any) => {
      this.totalDepartments = res.data ? res.data.length : res.length;
    });

    this.api.getLocations().subscribe((res: any) => {
      this.totalLocations = res.data ? res.data.length : res.length;
    });

    this.api.getCategories().subscribe((res: any) => {
      this.totalCategories = res.data ? res.data.length : res.length;
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}