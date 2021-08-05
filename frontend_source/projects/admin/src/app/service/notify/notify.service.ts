import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  translate = (tag: string) => this.translateService.instant(tag);

  constructor(
    private notifierService: NotifierService,
    private translateService: TranslateService
  ) { }

  successSave() {
    this.notifierService.notify('success', this.translate('save-success'));
  }

  successExecute() {
    this.notifierService.notify('success', this.translate('execute-success'));
  }

  successDelete() {
    this.notifierService.notify('success', this.translate('delete-success'));
  }

  success(tag: string) {
    this.notifierService.notify('success', this.translate(tag));
  }

  error(tag: string) {
    this.notifierService.notify('error', this.translate(tag || 'error'));
  }
}
