import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  isModal: boolean = false;
  group = new FormGroup({
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
        .signIn(this.group.value as User)
        .then(async (res) => {
          this.getUserInfo(res.user.uid);
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

  async getUserInfo(uid: string) {
    if (this.group.valid) {
      const loading = await this.utilsSvc.presentLoading();
      loading.present();
      let path = `users/${uid}`;
      this.firebaseSvc
        .getDocument(path)
        .then((res) => {
          const user = res as User;
          this.utilsSvc.saveInLocalStorage('user', user);
          this.utilsSvc.routerLink('main/home');
          this.group.reset();

          this.utilsSvc.presentToast({
            message: `Te damos la bienvenida ${user?.name}`,
            color: 'primary',
            position: 'middle',
            duration: 3000,
            icon: 'person-circle-outline',
          });
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
