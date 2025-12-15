import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.page.html',
  styleUrls: ['./add-asset.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class AddAssetPage implements OnInit {

  asset: any = {
    departement_id: 1,
    asset_category_id: 1,
    code: '',
    name: '',
    serial_number: '',
    brand_name: '',
    purchase_date: new Date().toISOString(),
    price: null,
    current_location_id: 1,
    current_condition: '',
    is_active: 1,
    created_by: 1,
    photo_filename: ''
  };

  id: any = null;
  isSubmitted = false;
  saving = false;
  
  // Format untuk input date HTML5
  purchaseDateFormatted: string = '';
  purchaseTime: string = '12:00';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    
    // Set default date format
    this.updateDateFormatted();

    if (this.id) {
      this.loadAsset();
    }
  }

  /**
   * Update format tanggal untuk input HTML5 (YYYY-MM-DD)
   */
  updateDateFormatted() {
    if (this.asset.purchase_date) {
      const date = new Date(this.asset.purchase_date);
      this.purchaseDateFormatted = date.toISOString().split('T')[0];
      
      // Extract time
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.purchaseTime = `${hours}:${minutes}`;
    }
  }

  /**
   * Handle perubahan tanggal
   */
  onDateChange(dateString: string) {
    if (dateString) {
      // Combine date and time
      const [hours, minutes] = this.purchaseTime.split(':');
      const date = new Date(dateString);
      date.setHours(parseInt(hours), parseInt(minutes));
      this.asset.purchase_date = date.toISOString();
    }
  }

  /**
   * Load asset data untuk edit
   */
  loadAsset() {
    this.api.getAssets().subscribe((res: any) => {
      const assets = Array.isArray(res) ? res : (res?.data || []);
      const found = assets.find((x: any) => x.id == this.id);
      if (found) {
        this.asset = { ...found };
        // Update format tanggal
        if (this.asset.purchase_date) {
          this.asset.purchase_date = new Date(this.asset.purchase_date).toISOString();
          this.updateDateFormatted();
        }
      }
    });
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validasi ukuran file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.presentAlert('Error', 'Ukuran file maksimal 5MB');
        return;
      }

      // Validasi tipe file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.presentAlert('Error', 'Format file harus JPG atau PNG');
        return;
      }

      this.asset.photo_filename = file.name;
      
      // Optional: Upload file ke server atau convert ke base64
      // this.uploadFile(file);
    }
  }

  /**
   * Kembali ke halaman sebelumnya
   */
  goBack() {
    this.router.navigate(['/assets']);
  }

  /**
   * Save asset (create or update)
   */
  async save() {
    this.isSubmitted = true;

    // Validasi
    if (!this.asset.code || !this.asset.name || !this.asset.price) {
      await this.presentAlert('Validasi', 'Harap isi semua field yang wajib (*)');
      return;
    }

    // Validasi harga
    if (this.asset.price <= 0) {
      await this.presentAlert('Validasi', 'Harga harus lebih dari 0');
      return;
    }

    // Show loading
    const loading = await this.loadingCtrl.create({
      message: 'Menyimpan data...',
      spinner: 'crescent'
    });
    await loading.present();

    this.saving = true;

    // Prepare data
    const dataToSave = {
      ...this.asset,
      price: Number(this.asset.price),
      purchase_date: this.asset.purchase_date.split('T')[0] // Format: YYYY-MM-DD
    };

    if (this.id) {
      // Update existing asset
      this.api.updateAsset(this.id, dataToSave).subscribe({
        next: async () => {
          await loading.dismiss();
          this.saving = false;
          await this.presentAlert('Sukses', 'Asset berhasil diupdate! ✅');
          this.router.navigateByUrl('/assets');
        },
        error: async (err) => {
          await loading.dismiss();
          this.saving = false;
          console.error('Error updating asset:', err);
          await this.presentAlert('Error', 'Gagal update asset. Silakan coba lagi. ❌');
        }
      });
    } else {
      // Create new asset
      this.api.addAsset(dataToSave).subscribe({
        next: async () => {
          await loading.dismiss();
          this.saving = false;
          await this.presentAlert('Sukses', 'Asset berhasil ditambahkan! ✅');
          this.router.navigateByUrl('/assets');
        },
        error: async (err) => {
          await loading.dismiss();
          this.saving = false;
          console.error('Error adding asset:', err);
          await this.presentAlert('Error', 'Gagal menambah asset. Silakan coba lagi. ❌');
        }
      });
    }
  }

  /**
   * Show alert dialog
   */
  private async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }
}