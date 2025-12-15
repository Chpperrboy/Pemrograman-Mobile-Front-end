import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },

  {
    path: 'register',  // <-- Tambahkan ini
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
  },
  {
    path: 'assets',
    loadComponent: () =>
      import('./pages/assets/assets.page').then(m => m.AssetsPage),
  },
  {
    path: 'add-asset',
    loadComponent: () =>
      import('./pages/add-asset/add-asset.page').then(m => m.AddAssetPage),
  },
  {
  path: 'add-asset/:id', 
  loadComponent: () =>
    import('./pages/add-asset/add-asset.page').then(m => m.AddAssetPage),
},
  {
  path: 'companies',
  loadComponent: () =>
    import('./pages/companies/companies.page').then(m => m.CompaniesPage),
},
{
  path: 'add-company',
  loadComponent: () =>
    import('./pages/add-company/add-company.page').then(m => m.AddCompanyPage),
},
{
path: 'add-company/:id',
  loadComponent: () =>
    import('./pages/add-company/add-company.page').then(m => m.AddCompanyPage),
},
  {
  path: 'factories',
  loadComponent: () =>
    import('./pages/factories/factories.page').then(m => m.FactoriesPage),
},
{
  path: 'add-factory',
  loadComponent: () =>
    import('./pages/add-factory/add-factory.page').then(m => m.AddFactoryPage),
},
{
  path: 'add-factory/:id',
  loadComponent: () =>
    import('./pages/add-factory/add-factory.page').then(m => m.AddFactoryPage),
},

  {
  path: 'departments',
  loadComponent: () =>
    import('./pages/departments/departments.page').then(m => m.DepartmentsPage),
},
{
  path: 'add-department',
  loadComponent: () =>
    import('./pages/add-department/add-department.page').then(m => m.AddDepartmentPage),
},
{
  path: 'add-department/:id',  
  loadComponent: () =>
    import('./pages/add-department/add-department.page').then(m => m.AddDepartmentPage),
},

  {
  path: 'locations',
  loadComponent: () =>
    import('./pages/locations/locations.page').then(m => m.LocationsPage),
},
{
  path: 'add-location',
  loadComponent: () =>
    import('./pages/add-location/add-location.page').then(m => m.AddLocationPage),
},
{
  path: 'add-location/:id',
  loadComponent: () =>
    import('./pages/add-location/add-location.page').then(m => m.AddLocationPage),
},
  {
  path: 'categories',
  loadComponent: () =>
    import('./pages/categories/categories.page').then(m => m.CategoriesPage),
},
{
  path: 'add-category',
  loadComponent: () =>
    import('./pages/add-category/add-category.page').then(m => m.AddCategoryPage),
},
{
  path: 'add-category/:id',
  loadComponent: () =>
    import('./pages/add-category/add-category.page').then(m => m.AddCategoryPage),
},
  {
    path: 'asset-log',
    loadComponent: () => import('./pages/asset-log/asset-log.page').then( m => m.AssetLogPage)
  },

  {
  path: 'asset-log',
  loadComponent: () =>
    import('./pages/asset-log/asset-log.page').then(m => m.AssetLogPage),
},

];