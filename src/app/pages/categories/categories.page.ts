import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories: any[] = [];
  filteredCategories: any[] = [];
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
    this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Memuat kategori...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.getCategories().subscribe({
      next: (res: any) => {
        if (!res) {
          this.categories = [];
        } else if (Array.isArray(res)) {
          this.categories = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.categories = res.data;
        } else {
          this.categories = [];
        }
        
        this.filteredCategories = [...this.categories];
        loader.dismiss();
      },
      error: async (err: any) => {
        console.error('Load categories error:', err);
        loader.dismiss();
        await this.showToast('Gagal memuat kategori', 'danger');
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
    let filtered = [...this.categories];

    // Filter by search text
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(category => 
        (category.name && category.name.toLowerCase().includes(search)) ||
        (category.code && category.code.toLowerCase().includes(search))
      );
    }

    // Filter by status
    if (this.filterStatus && this.filterStatus !== '') {
      filtered = filtered.filter(category => 
        category.status && category.status.toLowerCase().includes(this.filterStatus)
      );
    }

    this.filteredCategories = filtered;
    console.log('Filtered categories:', this.filteredCategories.length);
  }
  // --- AKHIR TAMBAHAN ---

  // Navigation methods
  goBack(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goAdd(): void {
    if (this.isViewOnly) return;
    this.router.navigateByUrl('/add-category');
  }

  goEdit(id: number | string): void {
    if (this.isViewOnly) return;
    this.router.navigate(['/add-category', id]); // <-- Pastikan ini benar
  }

  // Delete confirmation with clean UI
  async confirmDelete(item: any): Promise<void> {
    if (this.isViewOnly || !item?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus kategori "<strong>${item.name}</strong>"?<br><br><small style="color: #ef4444;">Tindakan ini tidak dapat dibatalkan!</small>`,
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
            this.deleteCategory(item.id, item.name);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCategory(id: number, name: string): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Menghapus kategori...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.deleteCategory(id).subscribe({
      next: async () => {
        loader.dismiss();
        await this.showToast(`Kategori "${name}" berhasil dihapus`, 'success');
        this.loadCategories();
      },
      error: async (err: any) => {
        console.error('Delete error:', err);
        loader.dismiss();
        await this.showToast('Gagal menghapus kategori', 'danger');
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