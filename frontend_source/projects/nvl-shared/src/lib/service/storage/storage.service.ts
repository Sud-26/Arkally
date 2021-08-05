import { Injectable } from '@angular/core';
import { MenuItem } from '../../model/config/menu/menu-item.config';

const MENU_KEY = 'menu-item';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public saveMenuItem(item: MenuItem) {
    localStorage.setItem(MENU_KEY, JSON.stringify(item));
  }

  public getMeneItem(): MenuItem {
    return JSON.parse(localStorage.getItem(MENU_KEY));
  }

  public getEntities(key: string) {
    const storedEntities = JSON.parse(localStorage.getItem(key));

    return {
      empty: storedEntities === null,
      storedEntities: storedEntities != null ? storedEntities : []
    };
  }

  public delete(key: string) {
    localStorage.removeItem(key);
  }

  public addEntites(entities, key) {
    localStorage.setItem(key, JSON.stringify(entities));
  }
}
