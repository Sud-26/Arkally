import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

/**
 * Create covalent form field.
 * @author __
 */
@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  constructor(private translateService: TranslateService) {
  }

  text = (name: string, label: string, required: boolean) => this.create(name, label, 'text', required);
  password = (name: string, label: string, required: boolean) => this.create(name, label, 'password', required);
  language = (
    name: string, 
    label: string, 
    required: boolean,
    selections,
    theDefault
  ) => this.create(name, label, 'select', required, selections, theDefault);

  private create(name: string, label: string, type: string, required: boolean, selections = null, theDefault = null) {
    return {
      name,
      label: this.translateService.instant(label),
      type,
      required,
      selections,
      default: theDefault
    };
  }
}
