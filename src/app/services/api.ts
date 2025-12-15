import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = environment.apiUrl;

  private jsonHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /* ========================================================
      UNIVERSAL GET
     ======================================================== */
  get(endpoint: string) {
    return this.http.get(`${this.baseUrl}/api/${endpoint}`);
  }

  /* ========================================================
      AUTH
     ======================================================== */

  // ✅ LOGIN (SUDAH BENAR)
  login(data: any) {
    return this.http.post(
      `${this.baseUrl}/api/users/login`,
      data,
      this.jsonHeaders
    );
  }

  // ✅ REGISTER (FIXED)
  register(data: any) {
    return this.http.post(
      `${this.baseUrl}/api/users`,
      data,
      this.jsonHeaders
    );
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
    return this.http.post(`${this.baseUrl}/api/assets`, data, this.jsonHeaders);
  }

  createAsset(data: any) {
    return this.addAsset(data);
  }

  updateAsset(id: number, data: any) {
    return this.http.put(
      `${this.baseUrl}/api/assets/${id}`,
      { ...data, updated_by: 1 },
      this.jsonHeaders
    );
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

  addCompany(data: any) {
    return this.http.post(`${this.baseUrl}/api/companies`, data, this.jsonHeaders);
  }

  updateCompany(id: number, data: any) {
    return this.http.put(
      `${this.baseUrl}/api/companies/${id}`,
      { ...data, updated_by: 1 },
      this.jsonHeaders
    );
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

  addFactory(data: any) {
    return this.http.post(`${this.baseUrl}/api/factories`, data, this.jsonHeaders);
  }

  updateFactory(id: number, data: any) {
    return this.http.put(
      `${this.baseUrl}/api/factories/${id}`,
      { ...data, updated_by: 1 },
      this.jsonHeaders
    );
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

  addDepartment(data: any) {
    return this.http.post(`${this.baseUrl}/api/departments`, data, this.jsonHeaders);
  }

  updateDepartment(id: number, data: any) {
    return this.http.put(
      `${this.baseUrl}/api/departments/${id}`,
      { ...data, updated_by: 1 },
      this.jsonHeaders
    );
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

  addLocation(data: any) {
    return this.http.post(`${this.baseUrl}/api/locations`, data, this.jsonHeaders);
  }

  updateLocation(id: number, data: any) {
    return this.http.put(
      `${this.baseUrl}/api/locations/${id}`,
      { ...data, updated_by: 1 },
      this.jsonHeaders
    );
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

  addCategory(data: any) {
    return this.http.post(`${this.baseUrl}/api/asset_categories`, data, this.jsonHeaders);
  }

  updateCategory(id: number, data: any) {
    return this.http.put(
      `${this.baseUrl}/api/asset_categories/${id}`,
      { ...data, updated_by: 1 },
      this.jsonHeaders
    );
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/api/asset_categories/${id}`);
  }

 /* ========================================================
    ASSET ACTIVITY LOG
   ======================================================== */

// ==========================
// GET semua asset activity log
// ==========================
getAssetLogs() {
  return this.http.get(
    `${this.baseUrl}/api/asset_activity_log`
  );
}

// ==========================
// GET asset activity log by ID
// ==========================
getAssetLogById(id: number) {
  return this.http.get(
    `${this.baseUrl}/api/asset_activity_log/${id}`
  );
}

// ==========================
// GET asset activity log by Asset ID
// ==========================
getAssetLogsByAssetId(assetId: number) {
  return this.http.get(
    `${this.baseUrl}/api/asset_activity_log/asset/${assetId}`
  );
}

// ==========================
// CREATE asset activity log
// ==========================
addAssetLog(data: any) {
  return this.http.post(
    `${this.baseUrl}/api/asset_activity_log`,
    data,
    this.jsonHeaders
  );
}

// 🔥 ALIAS (yang kamu panggil di page)
createAssetLog(data: any) {
  return this.addAssetLog(data);
}

// ==========================
// UPDATE asset activity log
// ==========================
updateAssetLog(id: number, data: any) {
  return this.http.put(
    `${this.baseUrl}/api/asset_activity_log/${id}`,
    {
      ...data,
      updated_by: 1
    },
    this.jsonHeaders
  );
}

// ==========================
// DELETE asset activity log (SOFT DELETE)
// ==========================
deleteAssetLog(id: number, deletedBy: number = 1) {
  return this.http.delete(
    `${this.baseUrl}/api/asset_activity_log/${id}`,
    {
      body: {
        deleted_by: deletedBy
      }
    }
  );
}

// ==========================
// GET statistik asset activity log
// ==========================
getAssetLogStats() {
  return this.http.get(
    `${this.baseUrl}/api/asset_activity_log/stats/summary`
  );
}

}
