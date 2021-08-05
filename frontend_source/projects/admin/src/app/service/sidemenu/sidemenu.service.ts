import { Injectable } from '@angular/core';
import { RootLayoutComponent } from 'projects/nvl-shared/src/lib/component/root-layout/root-layout.component';

@Injectable({
  providedIn: 'root'
})
export class SidemenuService {
  elementRef: RootLayoutComponent;

  constructor() { }

  setRootLayoutComponent(element) {
    this.elementRef = element;
  }

  toggle() {
    this.elementRef.toggleMenu();
  }
}
