import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateComponent } from 'src/app/shared/components/add-update/add-update.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  product!: Product;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  async addUpdateProduct() {
    let sucess = await this.utilsSvc.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal',
      //componentProps:{product}
    });
  }
}
