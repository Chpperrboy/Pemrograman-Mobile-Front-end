import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-location',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss']
})
export class AddLocationPage implements OnInit {

  location: any = {
    number: null,
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
      this.api.getLocations().subscribe((res: any) => {
        const data = res.find((x: any) => x.id == this.id);
        if (data) this.location = data;
      });
    }
  }

  save() {
    this.submitted = true;

    if (!this.location.number || !this.location.code || !this.location.name) {
      return;
    }

    this.saving = true;

    if (this.id) {
      this.api.updateLocation(this.id, this.location).subscribe(() => {
        this.saving = false;
        alert('Location berhasil diupdate');
        this.router.navigateByUrl('/locations');
      }, () => {
        this.saving = false;
        alert('Gagal update location');
      });
    } else {
      this.api.addLocation(this.location).subscribe(() => {
        this.saving = false;
        alert('Location berhasil ditambahkan');
        this.router.navigateByUrl('/locations');
      }, () => {
        this.saving = false;
        alert('Gagal menambahkan location');
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('/locations');
  }
}