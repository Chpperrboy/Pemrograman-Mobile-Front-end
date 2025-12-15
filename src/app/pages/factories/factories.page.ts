import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-factories',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './factories.page.html',
  styleUrls: ['./factories.page.scss'],
})
export class FactoriesPage implements OnInit {

  factories: any[] = [];
  filteredFactories: any[] = [];
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
    this.loadFactories();
  }

  async loadFactories(): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Memuat pabrik...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.getFactories().subscribe({
      next: (res: any) => {
        if (!res) {
          this.factories = [];
        } else if (Array.isArray(res)) {
          this.factories = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.factories = res.data;
        } else {
          this.factories = [];
        }
        
        this.filteredFactories = [...this.factories];
        loader.dismiss();
      },
      error: async (err: any) => {
        console.error('Load factories error:', err);
        loader.dismiss();
        await this.showToast('Gagal memuat pabrik', 'danger');
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
    let filtered = [...this.factories];

    // Filter by search text
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(factory => 
        (factory.name && factory.name.toLowerCase().includes(search)) ||
        (factory.address && factory.address.toLowerCase().includes(search)) ||
        (factory.phone && factory.phone.includes(search))
      );
    }

    // Filter by status
    if (this.filterStatus && this.filterStatus !== '') {
      filtered = filtered.filter(factory => 
        factory.status && factory.status.toLowerCase().includes(this.filterStatus)
      );
    }

    this.filteredFactories = filtered;
    console.log('Filtered factories:', this.filteredFactories.length);
  }
  // --- AKHIR TAMBAHAN ---

  // Navigation methods
  goBack(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goAdd(): void {
    if (this.isViewOnly) return;
    this.router.navigateByUrl('/add-factory');
  }

  goEdit(id: number | string): void {
    if (this.isViewOnly) return;
    this.router.navigate(['/add-factory', id]); // <-- Pastikan ini benar
  }

  // Delete confirmation with clean UI
  async confirmDelete(item: any): Promise<void> {
    if (this.isViewOnly || !item?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus pabrik "<strong>${item.name}</strong>"?<br><br><small style="color: #ef4444;">Tindakan ini tidak dapat dibatalkan!</small>`,
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
            this.deleteFactory(item.id, item.name);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteFactory(id: number, name: string): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Menghapus pabrik...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.deleteFactory(id).subscribe({
      next: async () => {
        loader.dismiss();
        await this.showToast(`Pabrik "${name}" berhasil dihapus`, 'success');
        this.loadFactories();
      },
      error: async (err: any) => {
        console.error('Delete error:', err);
        loader.dismiss();
        await this.showToast('Gagal menghapus pabrik', 'danger');
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