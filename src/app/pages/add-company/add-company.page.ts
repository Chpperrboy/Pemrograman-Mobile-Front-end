import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-company.page.html',
  styleUrls: ['./add-company.page.scss'] 
})
export class AddCompanyPage implements OnInit {

  company: any = {
    name: '',
    address: '',
    phone: '',
    is_active: 1,
    created_by: 1,
  };

  id: any = null;
  submitted = false;
  saving = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.api.getCompanies().subscribe((res: any) => {
        const data = res.find((x: any) => x.id == this.id);
        if (data) this.company = data;
      });
    }
  }

  save() {
    this.submitted = true;

    if (!this.company.name || !this.company.phone) {
      return;
    }

    this.saving = true;

    if (this.id) {
      this.api.updateCompany(this.id, this.company).subscribe(() => {
        this.saving = false;
        alert('Company berhasil diupdate');
        this.router.navigateByUrl('/companies');
      }, () => {
        this.saving = false;
        alert('Gagal update company');
      });
    } else {
      this.api.addCompany(this.company).subscribe(() => {
        this.saving = false;
        alert('Company berhasil ditambahkan');
        this.router.navigateByUrl('/companies');
      }, () => {
        this.saving = false;
        alert('Gagal menambahkan company');
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('/companies');
  }
}