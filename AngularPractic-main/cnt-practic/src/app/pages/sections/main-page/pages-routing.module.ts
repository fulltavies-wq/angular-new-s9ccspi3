import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from 'src/app/modules/administration/pages/admin-page/admin-page.component';
import { PagesComponent } from '../../pages.component';
import { MainPageComponent } from './main-page.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'mainPage',
        component: MainPageComponent,
      },
      {
        path: 'administration',
         loadChildren: () => import('../../../modules/administration/administration.module').then(module => module.AdministrationModule)
      },
      {
        path: '',
        redirectTo: 'mainPage',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }