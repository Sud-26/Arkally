import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { EditPageTemplate } from '../../edit-page.template';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Subscription } from '../subscription.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-subscription',
  templateUrl: './edit-subscription.component.html'
})
export class EditSubscriptionComponent extends EditPageTemplate<Subscription> implements OnInit {

  users$: Observable<any>;
  model$: Observable<any>;
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
    super(
      environment.api.path.subscription,
      restClientService,
      router,
      activatedRoute,
      notifyService,
      translateService,
      false
    );

    this.model = new Subscription();

    this.restClientService.get(`${environment.api.path.subscription}/${this.id}`).subscribe(
      response => {
        if (response.success) {
          this.model = response.data;
          if (!this.model.rebate_is_fixed) {
            this.rebateType = 'percentage';
          }
        } else {
          this.notifyService.error(response.message);
        }
      }
    );
  }

  ngOnInit() {
    // this.inituUsers$(); * TODO move to abstract class 
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
    this.rebateFixed$ = this.restClientService.get(environment.api.path.dropdown.rebate_fixed);
    this.rebatePercentage$ = this.restClientService.get(environment.api.path.dropdown.rebate_percentage);
    this.subscriptions$ = this.restClientService.get(environment.api.path.dropdown.subscription_model);
    this.model$ = this.restClientService.get(environment.api.path.dropdown.hw_module+`?id=${this.id}`);
  }

  changeUserName(value){
    this.model$ = this.restClientService.get(environment.api.path.dropdown.hw_module+`?id=${value.id}`);
  }

  onRebateValChange(value: string) {
    this.rebateType = value;
  }
}
