import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {

  companies: any[] = [];
  filteredCompanies: any[] = [];
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
    this.loadCompanies();
  }

  async loadCompanies(): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Memuat perusahaan...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.getCompanies().subscribe({
      next: (res: any) => {
        if (!res) {
          this.companies = [];
        } else if (Array.isArray(res)) {
          this.companies = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.companies = res.data;
        } else {
          this.companies = [];
        }
        
        this.filteredCompanies = [...this.companies];
        loader.dismiss();
      },
      error: async (err: any) => {
        console.error('Load companies error:', err);
        loader.dismiss();
        await this.showToast('Gagal memuat perusahaan', 'danger');
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
    let filtered = [...this.companies];

    // Filter by search text
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(company => 
        (company.name && company.name.toLowerCase().includes(search)) ||
        (company.address && company.address.toLowerCase().includes(search)) ||
        (company.phone && company.phone.includes(search))
      );
    }

    // Filter by status
    if (this.filterStatus && this.filterStatus !== '') {
      filtered = filtered.filter(company => 
        company.status && company.status.toLowerCase().includes(this.filterStatus)
      );
    }

    this.filteredCompanies = filtered;
    console.log('Filtered companies:', this.filteredCompanies.length);
  }
  // --- AKHIR TAMBAHAN ---

  // Navigation methods
  goBack(): void {
    this.router.navigateByUrl('/dashboard');
  }

  goAdd(): void {
    if (this.isViewOnly) return;
    this.router.navigateByUrl('/add-company');
  }

  goEdit(id: number | string): void {
    if (this.isViewOnly) return;
    // Use the add-company route with id to reuse the AddCompanyPage for editing
    this.router.navigate(['/add-company', id]);
  }

  // Delete confirmation with clean UI
  async confirmDelete(item: any): Promise<void> {
    if (this.isViewOnly || !item?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus perusahaan "<strong>${item.name}</strong>"?<br><br><small style="color: #ef4444;">Tindakan ini tidak dapat dibatalkan!</small>`,
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
            this.deleteCompany(item.id, item.name);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCompany(id: number, name: string): Promise<void> {
    const loader = await this.loadingCtrl.create({ 
      message: 'Menghapus perusahaan...',
      spinner: 'crescent'
    });
    await loader.present();

    this.api.deleteCompany(id).subscribe({
      next: async () => {
        loader.dismiss();
        await this.showToast(`Perusahaan "${name}" berhasil dihapus`, 'success');
        this.loadCompanies();
      },
      error: async (err: any) => {
        console.error('Delete error:', err);
        loader.dismiss();
        await this.showToast('Gagal menghapus perusahaan', 'danger');
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