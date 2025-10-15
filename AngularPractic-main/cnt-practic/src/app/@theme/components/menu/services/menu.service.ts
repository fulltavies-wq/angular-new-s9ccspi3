import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItems: MenuItem[] = [
    {
      idItem: 1,
      itemName: 'Главная',
      itemLink: 'mainPage',
      iconTypeId: 1,
      icon: null,
      itemOrder: 1,
      parentItem: null,
      showSubMenu: false,
      subMenuItems: []
    },

    {
      idItem: 3,
      itemName: 'Мониторинг',
      itemLink: 'NULL',
      iconTypeId: 1,
      icon: null,
      itemOrder: null,
      parentItem: 5,
      showSubMenu: false,
      subMenuItems: []
    },
    {
      idItem: 31,
      itemName: 'Общая',
      itemLink: 'NULL',
      iconTypeId: 1,
      icon: null,
      itemOrder: null,
      parentItem: 51,
      showSubMenu: false,
      subMenuItems: []
    },

    {
      idItem: 5,
      itemName: 'Dashboard',
      itemLink: 'dashboard',
      iconTypeId: 1,
      icon: '',
      itemOrder: 3,
      parentItem: 1,
      showSubMenu: false,
      subMenuItems: []
    },

    {
      idItem: 51,
      itemName: 'Статистика',
      itemLink: 'dashboard',
      iconTypeId: 1,
      icon: '',
      itemOrder: 3,
      parentItem: 1,
      showSubMenu: false,
      subMenuItems: []
    },


    {
      idItem: 7,
      itemName: 'Админ Панель',
      itemLink: 'administration',
      iconTypeId: 2,
      icon: null,
      itemOrder: 4,
      parentItem: null,
      showSubMenu: false,
      subMenuItems: []
    },
    {
      idItem: 8,
      itemName: 'Пользователи',
      itemLink: 'administration/users',
      iconTypeId: 1,
      icon: '',
      itemOrder: 1,
      parentItem: 7,
      showSubMenu: false,
      subMenuItems: []
    },
  ];
  private currentItemSubject = new BehaviorSubject<MenuItem>(this.menuItems[0]);
  currentItem$ = this.currentItemSubject.asObservable();

  constructor (){}

  getParentItems(): MenuItem[] {
    return this.menuItems.filter(item => item.parentItem === null);
  }
  
  getChildrenItems(selectedItem: MenuItem): MenuItem[] {
    return this.menuItems.filter(subItem => subItem.parentItem === selectedItem.idItem);
  }
  
  // Обновляем currentItemSubject.
  setCurrentItem(item: MenuItem): void {
    this.currentItemSubject.next(item);
  }
}
