import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { NotifyService } from '../service/notify/notify.service';
import { RestClientService } from '../service/rest-client/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';

/**
 * Template Abstract class for edit pages.
 */
export abstract class EditPageTemplate<T> {
    @ViewChild('editForm', { static: true }) editForm: NgForm;

    model: T;
    returnPath: string;
    id: any;

    translate = (tag: string) => this.translateService.instant(tag);

    constructor(
        protected path: string,
        protected restClientService: RestClientService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        protected notifyService: NotifyService,
        protected translateService: TranslateService,
        private serverCall: boolean = true
    ) {
        this.id = this.activatedRoute.snapshot.params.id;
        this.returnPath = this.router.url.substring(0, (this.router.url.length - (5 + this.id.length)));

        if (serverCall) {
            this.restClientService.get(`${this.path}/${this.id}`).subscribe(
                response => {
                    if (response.success) {
                        this.model = response.data;
                    } else {
                        this.notifyService.error(response.message);
                    }
                }
            );
        }
    }

    save() {
        if (this.editForm.valid) {
            this.restClientService.put(`${this.path}/${this.id}`, this.model).subscribe(
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
