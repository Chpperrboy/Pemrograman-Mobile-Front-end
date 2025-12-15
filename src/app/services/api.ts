import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* ========================================================
      UNIVERSAL GET METHOD (FIX ERROR MERAH)
     ======================================================== */
  get(endpoint: string) {
    return this.http.get(`${this.baseUrl}/api/${endpoint}`);
  }

  /* ========================================================
      AUTH
     ======================================================== */
  login(data: any) {
    return this.http.post(`${this.baseUrl}/api/users/login`, data);
  }


  // REGISTER
  register(data: any) {
    return this.http.post(`${this.baseUrl}/api/users/register`, data);
  }

  /* ========================================================
      ASSETS
     ======================================================== */
  getAssets() {
    return this.http.get(`${this.baseUrl}/api/assets`);
  }

  getAssetById(id: number) {
    return this.http.get(`${this.baseUrl}/api/assets/${id}`);
  }

  addAsset(data: any) {
    return this.http.post(`${this.baseUrl}/api/assets`, data);
  }

  /**
   * Alias for creating an asset to match method names used across pages
   */
  createAsset(data: any) {
    return this.addAsset(data);
  }

  updateAsset(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/api/assets/${id}`, {
      ...data,
      updated_by: 1
    });
  }

  deleteAsset(id: number) {
    return this.http.delete(`${this.baseUrl}/api/assets/${id}`);
  }

  /* ========================================================
      COMPANIES
     ======================================================== */
  getCompanies() {
    return this.http.get(`${this.baseUrl}/api/companies`);
  }

  getCompanyById(id: number) {
    return this.http.get(`${this.baseUrl}/api/companies/${id}`);
  }

  addCompany(data: any) {
    return this.http.post(`${this.baseUrl}/api/companies`, data);
  }

  /**
   * Alias for creating a company to match method names used across pages
   */
  createCompany(data: any) {
    return this.addCompany(data);
  }

  updateCompany(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/api/companies/${id}`, {
      ...data,
      updated_by: 1
    });
  }

  deleteCompany(id: number) {
    return this.http.delete(`${this.baseUrl}/api/companies/${id}`);
  }

  /* ========================================================
      FACTORIES
     ======================================================== */
  getFactories() {
    return this.http.get(`${this.baseUrl}/api/factories`);
  }

  getFactoryById(id: number) {
    return this.http.get(`${this.baseUrl}/api/factories/${id}`);
  }

  addFactory(data: any) {
    return this.http.post(`${this.baseUrl}/api/factories`, data);
  }

  /**
   * Alias for creating a factory
   */
  createFactory(data: any) {
    return this.addFactory(data);
  }

  updateFactory(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/api/factories/${id}`, {
      ...data,
      updated_by: 1
    });
  }

  deleteFactory(id: number) {
    return this.http.delete(`${this.baseUrl}/api/factories/${id}`);
  }

  /* ========================================================
      DEPARTMENTS
     ======================================================== */
  getDepartments() {
    return this.http.get(`${this.baseUrl}/api/departments`);
  }

  getDepartmentById(id: number) {
    return this.http.get(`${this.baseUrl}/api/departments/${id}`);
  }

  addDepartment(data: any) {
    return this.http.post(`${this.baseUrl}/api/departments`, data);
  }

  createDepartment(data: any) {
    return this.addDepartment(data);
  }

  updateDepartment(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/api/departments/${id}`, {
      ...data,
      updated_by: 1
    });
  }

  deleteDepartment(id: number) {
    return this.http.delete(`${this.baseUrl}/api/departments/${id}`);
  }

  /* ========================================================
      LOCATIONS
     ======================================================== */
  getLocations() {
    return this.http.get(`${this.baseUrl}/api/locations`);
  }

  getLocationById(id: number) {
    return this.http.get(`${this.baseUrl}/api/locations/${id}`);
  }

  addLocation(data: any) {
    return this.http.post(`${this.baseUrl}/api/locations`, data);
  }

  createLocation(data: any) {
    return this.addLocation(data);
  }

  updateLocation(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/api/locations/${id}`, {
      ...data,
      updated_by: 1
    });
  }

  deleteLocation(id: number) {
    return this.http.delete(`${this.baseUrl}/api/locations/${id}`);
  }

  /* ========================================================
      CATEGORIES
     ======================================================== */
  getCategories() {
    return this.http.get(`${this.baseUrl}/api/asset_categories`);
  }

  getCategoryById(id: number) {
    return this.http.get(`${this.baseUrl}/api/asset_categories/${id}`);
  }

  addCategory(data: any) {
    return this.http.post(`${this.baseUrl}/api/asset_categories`, data);
  }

  createCategory(data: any) {
    return this.addCategory(data);
  }

  updateCategory(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/api/asset_categories/${id}`, {
      ...data,
      updated_by: 1
    });
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/api/asset_categories/${id}`);
  }

  /* ========================================================
      ASSET ACTIVITY LOG
     ======================================================== */
  
  /**
   * Get all asset activity logs
   */
  getAssetLogs() {
    return this.http.get(`${this.baseUrl}/api/asset_activity_log`);
  }

  /**
   * Get asset activity logs by asset ID
   */
  getAssetLogsByAssetId(assetId: number) {
    return this.http.get(`${this.baseUrl}/api/asset_activity_log/asset/${assetId}`);
  }

  /**
   * Get single asset activity log by ID
   */
  getAssetLogById(id: number) {
    return this.http.get(`${this.baseUrl}/api/asset_activity_log/${id}`);
  }

  /**
   * Create new asset activity log
   */
  addAssetLog(data: any) {
    return this.http.post(`${this.baseUrl}/api/asset_activity_log`, data);
  }

  /**
   * Alias for creating asset log
   */
  createAssetLog(data: any) {
    return this.addAssetLog(data);
  }

  /**
   * Update asset activity log
   */
  updateAssetLog(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/api/asset_activity_log/${id}`, {
      ...data,
      updated_by: 1
    });
  }

  /**
   * Delete asset activity log (soft delete)
   */
  deleteAssetLog(id: number, deletedBy?: number) {
    return this.http.delete(`${this.baseUrl}/api/asset_activity_log/${id}`, {
      body: { deleted_by: deletedBy || 1 }
    });
  }

  /**
   * Get asset activity log statistics
   */
  getAssetLogStats() {
    return this.http.get(`${this.baseUrl}/api/asset_activity_log/stats/summary`);

  }

}