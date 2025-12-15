import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-department.page.html',
  styleUrls: ['./add-department.page.scss']
})
export class AddDepartmentPage implements OnInit {

  department: any = {
    factory_id: null,
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
      this.api.getDepartments().subscribe((res: any) => {
        const data = res.find((x: any) => x.id == this.id);
        if (data) this.department = data;
      });
    }
  }

  save() {
    this.submitted = true;

    if (!this.department.factory_id || !this.department.name || !this.department.phone) {
      return;
    }

    this.saving = true;

    if (this.id) {
      this.api.updateDepartment(this.id, this.department).subscribe(() => {
        this.saving = false;
        alert('Department berhasil diupdate');
        this.router.navigateByUrl('/departments');
      }, () => {
        this.saving = false;
        alert('Gagal update department');
      });
    } else {
      this.api.addDepartment(this.department).subscribe(() => {
        this.saving = false;
        alert('Department berhasil ditambahkan');
        this.router.navigateByUrl('/departments');
      }, () => {
        this.saving = false;
        alert('Gagal menambahkan department');
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('/departments');
  }
}