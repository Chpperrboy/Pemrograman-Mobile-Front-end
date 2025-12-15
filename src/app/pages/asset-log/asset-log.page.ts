import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-asset-log',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './asset-log.page.html',
  styleUrls: ['./asset-log.page.scss']
})
export class AssetLogPage implements OnInit {
  assetId: any;
  logs: any[] = [];
  filteredLogs: any[] = [];
  uniqueAssets: any[] = [];
  
  // All master data
  allAssets: any[] = [];
  allLocations: any[] = [];
  
  // Filter variables
  searchTerm: string = '';
  filterCondition: string = '';
  filterAsset: string = '';
  
  // Modal state
  showModal: boolean = false;
  isSubmitting: boolean = false;
  
  // New log form
  newLog: any = {
    asset_id: '',
    location_id: '',
    condition: '',
    notes: '',
    photo: null
  };
  
  // Photo preview
  previewImage: string | null = null;
  selectedFile: File | null = null;
  
  // User info
  currentUser: any;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    this.currentUser = userStr ? JSON.parse(userStr) : null;
  }

  ngOnInit() {
    this.assetId = this.route.snapshot.paramMap.get('id');
    this.loadAllData();
  }

  // ========================================
  // LOAD DATA
  // ========================================
  
  loadAllData() {
    // Load logs
    this.loadLogs();
    
    // Load master data for modal
    this.loadAssets();
    this.loadLocations();
  }

  loadLogs() {
    // Jika ada assetId dari route, load logs untuk asset tertentu
    // Jika tidak, load semua logs
    const logObservable = this.assetId 
      ? this.api.getAssetLogsByAssetId(this.assetId)
      : this.api.getAssetLogs();

    logObservable.subscribe({
      next: (res: any) => {
        console.log('Logs response:', res);
        
        // Handle berbagai format response
        if (Array.isArray(res)) {
          this.logs = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.logs = res.data;
        } else if (res.results && Array.isArray(res.results)) {
          this.logs = res.results;
        } else {
          this.logs = [];
        }
        
        // Sort by created_at descending (newest first)
        this.logs.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
        
        this.filteredLogs = [...this.logs];
        this.extractUniqueAssets();
      },
      error: (error) => {
        console.error('Error loading logs:', error);
        this.logs = [];
        this.filteredLogs = [];
      }
    });
  }

  loadAssets() {
    this.api.getAssets().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.allAssets = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.allAssets = res.data;
        } else {
          this.allAssets = [];
        }
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.allAssets = [];
      }
    });
  }

  loadLocations() {
    this.api.getLocations().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.allLocations = res;
        } else if (res.data && Array.isArray(res.data)) {
          this.allLocations = res.data;
        } else {
          this.allLocations = [];
        }
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this.allLocations = [];
      }
    });
  }

  extractUniqueAssets() {
    const assetMap = new Map();
    
    this.logs.forEach(log => {
      if (log.asset_id && !assetMap.has(log.asset_id)) {
        assetMap.set(log.asset_id, {
          id: log.asset_id,
          code: log.asset_code || `Asset #${log.asset_id}`,
          name: log.asset_name || 'N/A'
        });
      }
    });
    
    this.uniqueAssets = Array.from(assetMap.values());
  }

  // ========================================
  // FILTERS
  // ========================================
  
  applyFilters() {
    this.filteredLogs = this.logs.filter(log => {
      // Filter by search term
      const searchLower = this.searchTerm.toLowerCase();
      const matchSearch = !this.searchTerm || 
        (log.asset_name?.toLowerCase().includes(searchLower) ||
         log.asset_code?.toLowerCase().includes(searchLower) ||
         log.asset_id?.toString().includes(searchLower) ||
         log.location_name?.toLowerCase().includes(searchLower) ||
         log.created_by_name?.toLowerCase().includes(searchLower));

      // Filter by condition
      const matchCondition = !this.filterCondition || 
        log.condition === this.filterCondition;

      // Filter by asset
      const matchAsset = !this.filterAsset || 
        log.asset_id?.toString() === this.filterAsset;

      return matchSearch && matchCondition && matchAsset;
    });
  }

  // ========================================
  // STATISTICS
  // ========================================
  
  getConditionCount(condition: string): number {
    return this.logs.filter(log => log.condition === condition).length;
  }

  getCriticalCount(): number {
    return this.logs.filter(log => 
      log.condition === 'Rusak Berat' || log.condition === 'Hilang'
    ).length;
  }

  // ========================================
  // CONDITION HELPERS
  // ========================================
  
  getConditionClass(condition: string): string {
    if (!condition) return 'baik';
    
    const cond = condition.toLowerCase();
    
    if (cond === 'baik') return 'baik';
    if (cond === 'rusak ringan') return 'rusak-ringan';
    if (cond === 'rusak berat') return 'rusak-berat';
    if (cond === 'hilang') return 'hilang';
    
    return 'baik';
  }

  // ========================================
  // MODAL FUNCTIONS
  // ========================================
  
  openAddModal() {
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newLog = {
      asset_id: '',
      location_id: '',
      condition: '',
      notes: '',
      photo: null
    };
    this.previewImage = null;
    this.selectedFile = null;
  }

  // ========================================
  // FILE UPLOAD
  // ========================================
  
  onFileSelect(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan!');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!');
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.previewImage = null;
    this.selectedFile = null;
    this.newLog.photo = null;
  }

  // ========================================
  // SUBMIT LOG
  // ========================================
  
  async submitLog() {
    // Validation
    if (!this.newLog.asset_id || !this.newLog.location_id || !this.newLog.condition) {
      alert('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    this.isSubmitting = true;

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('asset_id', this.newLog.asset_id.toString());
      formData.append('location_id', this.newLog.location_id.toString());
      formData.append('condition', this.newLog.condition);
      
      // Add created_by from current user
      if (this.currentUser && this.currentUser.id) {
        formData.append('created_by', this.currentUser.id.toString());
      } else {
        formData.append('created_by', '1'); // Default system user
      }
      
      // Add optional fields
      if (this.newLog.notes) {
        formData.append('notes', this.newLog.notes);
      }
      
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
      }

      console.log('Submitting log data...');

      // Submit to API using createAssetLog method
      this.api.createAssetLog(formData).subscribe({
        next: (response: any) => {
          console.log('Log created successfully:', response);
          
          // Show success message
          alert('Log berhasil ditambahkan!');
          
          // Reload logs
          this.loadLogs();
          
          // Close modal
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating log:', error);
          
          // Show error message
          let errorMessage = 'Gagal menambahkan log. ';
          if (error.error && error.error.message) {
            errorMessage += error.error.message;
          } else if (error.message) {
            errorMessage += error.message;
          } else {
            errorMessage += 'Silakan coba lagi.';
          }
          
          alert(errorMessage);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });

    } catch (error) {
      console.error('Error submitting log:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
      this.isSubmitting = false;
    }
  }

  // ========================================
  // NAVIGATION
  // ========================================
  
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.location.back();
  }

  // ========================================
  // VIEW PHOTO
  // ========================================
  
  viewPhoto(photoUrl: string) {
    if (!photoUrl) return;
    
    // Jika photo URL relatif, tambahkan base URL
    let fullUrl = photoUrl;
    if (!photoUrl.startsWith('http')) {
      // Sesuaikan dengan base URL backend Anda
      const baseUrl = this.api['baseUrl'] || 'http://localhost:3000';
      fullUrl = `${baseUrl}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
    }
    
    // Buka di tab baru
    window.open(fullUrl, '_blank');
  }

  // ========================================
  // DELETE LOG (Optional - jika diperlukan)
  // ========================================
  
  deleteLog(logId: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus log ini?')) {
      return;
    }

    const deletedBy = this.currentUser?.id || 1;

    this.api.deleteAssetLog(logId, deletedBy).subscribe({
      next: (response) => {
        console.log('Log deleted:', response);
        alert('Log berhasil dihapus!');
        this.loadLogs();
      },
      error: (error) => {
        console.error('Error deleting log:', error);
        alert('Gagal menghapus log. Silakan coba lagi.');
      }
    });
  }
}