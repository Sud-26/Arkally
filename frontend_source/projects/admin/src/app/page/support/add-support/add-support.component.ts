import { Component, OnInit } from '@angular/core';

import { AddPageTemplate } from '../../add-page.template';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { Support } from '../support.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-add-support',
  templateUrl: './add-support.component.html'
})
export class AddSupportComponent extends AddPageTemplate<Support> implements OnInit {

  users$: Observable<any>;

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected translateService: TranslateService
  ) {
    super(
      environment.api.path.support,
      restClientService,
      router,
      notifyService,
      translateService
    );

    this.model = new Support();
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
  }
}