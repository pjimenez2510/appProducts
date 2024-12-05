import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.interface';
import { User } from 'src/app/models/user.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  isModal: boolean = true;
  @Input() product!: Product;
  user = {} as User;
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(0, [Validators.required, Validators.min(0)]),
    image: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }
  // ======== Tomar/Seleccionar Imagen =======
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto'))
      .dataUrl;
    if (dataUrl) this.form.controls.image.setValue(dataUrl);
  }
  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  // ======== Convierte valores de tipo string a number =======
  setNumberInputs() {
    let { soldUnits, price } = this.form.controls;

    if (soldUnits.value) soldUnits.setValue(soldUnits.value);
    if (price.value) price.setValue(price.value);
  }
  // ======== Crear Producto =======
  async createProduct() {
    let path = `users/${this.user.uid}/products`;
    const loading = await this.utilsSvc.presentLoading();
    await loading.present();

    // === Subir la imagen y obtener la url ===
    let dataUrl = this.form.value.image;
    if (!dataUrl) {
      return;
    }
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);
    delete this.form.value.id;
    this.firebaseSvc
      .addDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsSvc.dismissModal({ success: true });
        this.utilsSvc.presentToast({
          message: 'Producto creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
  // ======== Actualizar Producto =======
  async updateProduct() {
    let path = `users/${this.user.uid}/products/${this.product.id}`;
    const loading = await this.utilsSvc.presentLoading();
    await loading.present();
    // === Si cambió la imagen, subir la nueva y obtener la url ===
    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      if (!dataUrl) {
        return;
      }
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }
    delete this.form.value.id;
    this.firebaseSvc
      .updateDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsSvc.dismissModal({ success: true });
        this.utilsSvc.presentToast({
          message: 'Producto actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
