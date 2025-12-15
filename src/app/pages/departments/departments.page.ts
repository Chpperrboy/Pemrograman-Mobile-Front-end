import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './departments.page.html',
  styleUrls: ['./departments.page.scss'],
})
export class DepartmentsPage implements OnInit {

  departments: any[] = [];
  filteredDepartments: any[] = [];
  isViewOnly = false;
  searchText: string = '';
  filterStatus: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isViewOnly = params['view'] === 'true';
    });
    this.loadDepartments();
  }

  async loadDepartments(): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Memuat departemen...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.getDepartments().subscribe({
      next: (res: any) => {
        if (!res) {
          this.departments = [];
        } else if (Array.isArray(res)) {
          this.departments = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.departments = res.data;
        } else {
          this.departments = [];
        }
        
        this.filteredDepartments = [...this.departments];
        loader.dismiss();
      },
      error: async (err: any) => {
        console.error('Load departments error:', err);
        loader.dismiss();
        await this.showToast('Gagal memuat departemen', 'danger');
      }
    });
  }

  // --- METHOD YANG DITAMBAHKAN ---
  onSearch(): void {
    console.log('Search text:', this.searchText);
    this.applyFilters();
  }

  onFilterChange(): void {
    console.log('Filter status:', this.filterStatus);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.departments];

    // Filter by search text
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(department => 
        (department.name && department.name.toLowerCase().includes(search)) ||
        (department.location && department.location.toLowerCase().includes(search)) ||
        (department.phone && department.phone.includes(search))
      );
    }

    // Filter by status
    if (this.filterStatus && this.filterStatus !== '') {
      filtered = filtered.filter(department => 
        department.status && department.status.toLowerCase().includes(this.filterStatus)
      );
    }

    this.filteredDepartments = filtered;
    console.log('Filtered departments:', this.filteredDepartments.length);
  }
  // --- AKHIR TAMBAHAN ---

  // Navigation methods
  goBack(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goAdd(): void {
    if (this.isViewOnly) return;
    this.router.navigateByUrl('/add-department');
  }

  goEdit(id: number | string): void {
    if (this.isViewOnly) return;
    this.router.navigate(['/add-department', id]); // <-- Pastikan ini benar
  }

  // Delete confirmation with clean UI
  async confirmDelete(item: any): Promise<void> {
    if (this.isViewOnly || !item?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus departemen "<strong>${item.name}</strong>"?<br><br><small style="color: #ef4444;">Tindakan ini tidak dapat dibatalkan!</small>`,
      cssClass: 'custom-delete-alert',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Ya, Hapus',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.deleteDepartment(item.id, item.name);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteDepartment(id: number, name: string): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Menghapus departemen...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.deleteDepartment(id).subscribe({
      next: async () => {
        loader.dismiss();
        await this.showToast(`Departemen "${name}" berhasil dihapus`, 'success');
        this.loadDepartments();
      },
      error: async (err: any) => {
        console.error('Delete error:', err);
        loader.dismiss();
        await this.showToast('Gagal menghapus departemen', 'danger');
      }
    });
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      buttons: [{
        icon: 'close',
        role: 'cancel'
      }]
    });
    await toast.present();
  }
}