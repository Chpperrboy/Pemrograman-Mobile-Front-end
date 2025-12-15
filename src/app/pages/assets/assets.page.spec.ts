import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {

  assets: any[] = [];
  filteredAssets: any[] = [];

  isViewOnly = false;
  searchText = '';
  filterCategory = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    // MODE VIEW ONLY
    this.route.queryParams.subscribe(params => {
      this.isViewOnly = params['view'] === 'true';
    });

    this.loadAssets();
  }

  /* =====================
     LOAD DATA
     ===================== */
  async loadAssets() {
    const loader = await this.loadingCtrl.create({
      message: 'Memuat aset...'
    });
    await loader.present();

    this.api.getAssets().subscribe({
      next: (res: any) => {
        if (!res) this.assets = [];
        else if (Array.isArray(res)) this.assets = res;
        else if (res.data && Array.isArray(res.data)) this.assets = res.data;
        else this.assets = [];

        this.filteredAssets = [...this.assets];
        loader.dismiss();
      },
      error: async () => {
        loader.dismiss();
        this.showToast('Gagal memuat aset', 'danger');
      }
    });
  }

  /* =====================
     FILTER & SEARCH
     ===================== */
  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let data = [...this.assets];

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      data = data.filter(item =>
        item.name?.toLowerCase().includes(q) ||
        item.code?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q)
      );
    }

    if (this.filterCategory) {
      data = data.filter(item =>
        item.code?.toUpperCase().includes(this.filterCategory)
      );
    }

    this.filteredAssets = data;
  }

  /* =====================
     NAVIGATION
     ===================== */
  goBack(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goAdd(): void {
    if (this.isViewOnly) return;
    this.router.navigateByUrl('/add-asset');
  }

  goEdit(id: any): void {
    if (this.isViewOnly) return;
    this.router.navigate(['/add-asset', id]);
  }

  /* =====================
     DELETE
     ===================== */
  async confirmDelete(item: any) {
    if (this.isViewOnly) return;

    const alert = await this.alertCtrl.create({
      header: 'Hapus Asset',
      message: `Yakin ingin menghapus asset ${item.name}`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          cssClass: 'danger',
          handler: () => this.deleteAsset(item.id, item.name)
        }
      ]
    });

    await alert.present();
  }

  async deleteAsset(id: number, name: string) {
    const loader = await this.loadingCtrl.create({
      message: 'Menghapus aset...'
    });
    await loader.present();

    this.api.deleteAsset(id).subscribe({
      next: async () => {
        loader.dismiss();
        this.showToast(`Asset "${name}" berhasil dihapus`, 'success');
        this.loadAssets();
      },
      error: async () => {
        loader.dismiss();
        this.showToast('Gagal menghapus aset', 'danger');
      }
    });
  }

  /* =====================
     TOAST
     ===================== */
  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
