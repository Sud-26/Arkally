import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { EditPageTemplate } from '../../edit-page.template';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { Rebate } from '../rebate.model';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@Component({
  selector: 'app-edit-rebate',
  templateUrl: './edit-rebate.component.html'
})
export class EditRebateComponent extends EditPageTemplate<Rebate> implements OnInit {

  users$: Observable<any>;
  rebateFixed$: Observable<any>;
  rebatePercentage$: Observable<any>;
  subscriptions$: Observable<any>;

  rebateType = 'fixed';

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected notifyService: NotifyService,
    protected translateService: TranslateService
  ) {
    super(environment.api.path.rebate, restClientService, router, activatedRoute, notifyService, translateService);
    this.model = new Rebate();
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
    this.rebateFixed$ = this.restClientService.get(environment.api.path.dropdown.rebate_fixed);
    this.rebatePercentage$ = this.restClientService.get(environment.api.path.dropdown.rebate_percentage);
    this.subscriptions$ = this.restClientService.get(environment.api.path.dropdown.subscription_model);
  }

  onRebateValChange(value: string) {
    this.rebateType = value;
  }
}
