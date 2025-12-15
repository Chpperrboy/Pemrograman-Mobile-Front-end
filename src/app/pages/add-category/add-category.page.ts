import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'] 
})
export class AddCategoryPage implements OnInit {

  category: any = {
    code: '',
    name: '',
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
      this.api.getCategories().subscribe((res: any) => {
        const data = res.find((x: any) => x.id == this.id);
        if (data) this.category = data;
      });
    }
  }

  save() {
    this.submitted = true;

    if (!this.category.code || !this.category.name) {
      return;
    }

    this.saving = true;

    if (this.id) {
      this.api.updateCategory(this.id, this.category).subscribe(() => {
        this.saving = false;
        alert('Category berhasil diupdate');
        this.router.navigateByUrl('/categories');
      }, () => {
        this.saving = false;
        alert('Gagal update category');
      });
    } else {
      this.api.addCategory(this.category).subscribe(() => {
        this.saving = false;
        alert('Category berhasil ditambahkan');
        this.router.navigateByUrl('/categories');
      }, () => {
        this.saving = false;
        alert('Gagal menambahkan category');
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('/categories');
  }
}