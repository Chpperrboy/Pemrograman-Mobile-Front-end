import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {

  assets: any[] = [];
  filteredAssets: any[] = [];
  isViewOnly = false;
  searchText: string = '';
  filterCategory: string = '';

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
    this.loadAssets();
  }

  async loadAssets(): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Memuat asset...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.getAssets().subscribe({
      next: (res: any) => {
        if (!res) {
          this.assets = [];
        } else if (Array.isArray(res)) {
          this.assets = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.assets = res.data;
        } else {
          this.assets = [];
        }
        
        this.filteredAssets = [...this.assets];
        loader.dismiss();
      },
      error: async (err: any) => {
        console.error('Load assets error:', err);
        loader.dismiss();
        await this.showToast('Gagal memuat asset', 'danger');
      }
    });
  }

  // --- METHOD YANG DITAMBAHKAN ---
  onSearch(): void {
    console.log('Search text:', this.searchText);
    this.applyFilters();
  }

  onFilterChange(): void {
    console.log('Filter category:', this.filterCategory);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.assets];

    // Filter by search text
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(asset => 
        (asset.name && asset.name.toLowerCase().includes(search)) ||
        (asset.code && asset.code.toLowerCase().includes(search)) ||
        (asset.brand && asset.brand.toLowerCase().includes(search))
      );
    }

    // Filter by category
    if (this.filterCategory && this.filterCategory !== '') {
      filtered = filtered.filter(asset => 
        asset.code && asset.code.toUpperCase().includes(this.filterCategory)
      );
    }

    this.filteredAssets = filtered;
    console.log('Filtered assets:', this.filteredAssets.length);
  }
  // --- AKHIR TAMBAHAN ---

  // Get icon based on asset category
  getAssetIcon(code: string): string {
    if (!code) return 'cube-outline';
    
    const c = code.toUpperCase();
    if (c.includes('COMP') || c.includes('PC')) return 'laptop-outline';
    if (c.includes('PHONE') || c.includes('HP')) return 'phone-portrait-outline';
    if (c.includes('PRINT')) return 'print-outline';
    if (c.includes('VEHICLE') || c.includes('CAR')) return 'car-outline';
    if (c.includes('FURNITURE')) return 'bed-outline';
    if (c.includes('ELECTRONIC')) return 'flash-outline';
    
    return 'cube-outline';
  }

  // Check condition status
  isConditionGood(condition: string): boolean {
    if (!condition) return false;
    const c = condition.toLowerCase();
    return c === 'baik' || c === 'good' || c === 'excellent';
  }

  isConditionBad(condition: string): boolean {
    if (!condition) return false;
    const c = condition.toLowerCase();
    return c === 'rusak' || c === 'bad' || c === 'broken' || c === 'damaged';
  }

  isConditionWarning(condition: string): boolean {
    if (!condition) return false;
    const c = condition.toLowerCase();
    return c.includes('perbaikan') || c === 'cukup' || c === 'fair' || c.includes('repair');
  }

  // Navigation methods
  goBack(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goAdd(): void {
    if (this.isViewOnly) return;
    this.router.navigateByUrl('/add-asset');
  }

  goEdit(id: number | string): void {
    if (this.isViewOnly) return;
    // Reuse AddAssetPage for editing by navigating to its route with id
    this.router.navigate(['/add-asset', id]);
  }

  // Delete confirmation with clean UI
  async confirmDelete(item: any): Promise<void> {
    if (this.isViewOnly || !item?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus asset "<strong>${item.name}</strong>"?<br><br><small style="color: #ef4444;">Tindakan ini tidak dapat dibatalkan!</small>`,
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
            this.deleteAsset(item.id, item.name);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteAsset(id: number, name: string): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Menghapus asset...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.deleteAsset(id).subscribe({
      next: async () => {
        loader.dismiss();
        await this.showToast(`Asset "${name}" berhasil dihapus`, 'success');
        this.loadAssets();
      },
      error: async (err: any) => {
        console.error('Delete error:', err);
        loader.dismiss();
        await this.showToast('Gagal menghapus asset', 'danger');
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