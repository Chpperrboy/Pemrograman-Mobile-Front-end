import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  locations: any[] = [];
  filteredLocations: any[] = [];
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
    this.loadLocations();
  }

  async loadLocations(): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Memuat lokasi...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.getLocations().subscribe({
      next: (res: any) => {
        if (!res) {
          this.locations = [];
        } else if (Array.isArray(res)) {
          this.locations = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.locations = res.data;
        } else {
          this.locations = [];
        }
        
        this.filteredLocations = [...this.locations];
        loader.dismiss();
      },
      error: async (err: any) => {
        console.error('Load locations error:', err);
        loader.dismiss();
        await this.showToast('Gagal memuat lokasi', 'danger');
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
    let filtered = [...this.locations];

    // Filter by search text
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(location => 
        (location.name && location.name.toLowerCase().includes(search)) ||
        (location.code && location.code.toLowerCase().includes(search))
      );
    }

    // Filter by status
    if (this.filterStatus && this.filterStatus !== '') {
      filtered = filtered.filter(location => 
        location.status && location.status.toLowerCase().includes(this.filterStatus)
      );
    }

    this.filteredLocations = filtered;
    console.log('Filtered locations:', this.filteredLocations.length);
  }
  // --- AKHIR TAMBAHAN ---

  // Navigation methods
  goBack(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goAdd(): void {
    if (this.isViewOnly) return;
    this.router.navigateByUrl('/add-location');
  }

  goEdit(id: number | string): void {
    if (this.isViewOnly) return;
    this.router.navigate(['/add-location', id]); // <-- Pastikan ini benar
  }

  // Delete confirmation with clean UI
  async confirmDelete(item: any): Promise<void> {
    if (this.isViewOnly || !item?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus lokasi "<strong>${item.name}</strong>"?<br><br><small style="color: #ef4444;">Tindakan ini tidak dapat dibatalkan!</small>`,
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
            this.deleteLocation(item.id, item.name);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteLocation(id: number, name: string): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Menghapus lokasi...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.deleteLocation(id).subscribe({
      next: async () => {
        loader.dismiss();
        await this.showToast(`Lokasi "${name}" berhasil dihapus`, 'success');
        this.loadLocations();
      },
      error: async (err: any) => {
        console.error('Delete error:', err);
        loader.dismiss();
        await this.showToast('Gagal menghapus lokasi', 'danger');
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