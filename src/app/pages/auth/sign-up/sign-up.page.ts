import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  isModal: boolean = false;
  group = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  async submit() {
    if (this.group.valid) {
      const loading = await this.utilsSvc.presentLoading();
      loading.present();
      this.firebaseSvc
        .singUp(this.group.value as User)
        .then(async (res) => {
          await this.firebaseSvc.updateUser(this.group.value.name as string);
          let uid = res.user.uid;
          this.group.controls.uid.setValue(uid);
          this.setUserInfo(uid);
        })
        .catch((err) => {
          this.utilsSvc.presentToast({
            message: err.message,
            color: 'danger',
            position: 'top',
            duration: 2000,
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
  constructor() {}

  async setUserInfo(uid: string) {
    if (this.group.valid) {
      const loading = await this.utilsSvc.presentLoading();
      loading.present();
      let path = `users/${uid}`;
      delete this.group.value.password;

      this.firebaseSvc
        .setDocument(path, this.group.value)
        .then((res) => {
          this.utilsSvc.saveInLocalStorage('user', this.group.value);
          this.utilsSvc.routerLink('main/home');
        })
        .catch((err) => {
          this.utilsSvc.presentToast({
            message: err.message,
            color: 'danger',
            position: 'top',
            duration: 2000,
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
