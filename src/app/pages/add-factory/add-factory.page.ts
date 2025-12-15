import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-factory',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-factory.page.html',
  styleUrls: ['./add-factory.page.scss']
})
export class AddFactoryPage implements OnInit {

  factory: any = {
    company_id: null,
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
      this.api.getFactories().subscribe((res: any) => {
        const data = res.find((x: any) => x.id == this.id);
        if (data) this.factory = data;
      });
    }
  }

  save() {
    this.submitted = true;

    if (!this.factory.company_id || !this.factory.name || !this.factory.phone) {
      return;
    }

    this.saving = true;

    if (this.id) {
      this.api.updateFactory(this.id, this.factory).subscribe(() => {
        this.saving = false;
        alert('Factory berhasil diupdate');
        this.router.navigateByUrl('/factories');
      }, () => {
        this.saving = false;
        alert('Gagal update factory');
      });
    } else {
      this.api.addFactory(this.factory).subscribe(() => {
        this.saving = false;
        alert('Factory berhasil ditambahkan');
        this.router.navigateByUrl('/factories');
      }, () => {
        this.saving = false;
        alert('Gagal menambahkan factory');
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('/factories');
  }
}