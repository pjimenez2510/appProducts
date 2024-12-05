import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateComponent } from './components/add-update/add-update.component';

@NgModule({
  declarations: [
    LogoComponent,
    HeaderComponent,
    CustomInputComponent,
    AddUpdateComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [
    LogoComponent,
    HeaderComponent,
    CustomInputComponent,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AddUpdateComponent,
  ],
})
export class SharedModule {}
