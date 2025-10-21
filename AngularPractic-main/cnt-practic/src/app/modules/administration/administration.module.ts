import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { FormsModule } from '@angular/forms';
import { AdministrationRoutingModule } from './administation-routing';

@NgModule({
  declarations: [
    AdminPageComponent,
    UsersPageComponent
  ],

  imports: [
    AdministrationRoutingModule,
    CommonModule,
    FormsModule
  ]
})

export class AdministrationModule { }