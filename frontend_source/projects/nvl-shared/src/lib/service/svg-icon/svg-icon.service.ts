import {DomSanitizer} from '@angular/platform-browser';
import {Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';

/**
 * Add custom svg icons.
 * @author __
 */
@Injectable({
  providedIn: 'root'
})
export class SvgIconService {
  constructor(private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  add(namespace: string, iconName: string, url: string) {
    this.iconRegistry.addSvgIconInNamespace(
      namespace,
      iconName,
      this.domSanitizer.bypassSecurityTrustResourceUrl(url)
    );
  }
}
