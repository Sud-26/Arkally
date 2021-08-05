import { NgForm } from '@angular/forms';
import { NotifyService } from '../service/notify/notify.service';
import { RestClientService } from '../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';

/**
 * Template Abstract class for adding pages.
 */
export abstract class AddPageTemplate<T> {
    @ViewChild('newForm', { static: true }) newForm: NgForm;

    model: T;
    returnPath: string;

    translate = (tag: string) => this.translateService.instant(tag);

    constructor(
        protected path: string,
        protected restClientService: RestClientService,
        protected router: Router,
        protected notifyService: NotifyService,
        protected translateService: TranslateService
    ) {
        this.returnPath = this.router.url.substring(0, (this.router.url.length - 4));
    }

    save() {
        if (this.newForm.valid) {
            this.restClientService.post(this.path, this.model).subscribe(
                response => {
                    if (response.success) {
                        this.router.navigate([this.returnPath]);
                        this.notifyService.successSave();
                    } else {
                        this.notifyService.error(response.message);
                    }
                }
            );
        }
    }

    cancel() {
        this.router.navigate([this.returnPath]);
    }
}
