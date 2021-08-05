import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { EditPageTemplate } from '../../edit-page.template';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Support } from '../support.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-support',
  templateUrl: './edit-support.component.html'
})
export class EditSupportComponent extends EditPageTemplate<Support> implements OnInit {

  users$: Observable<any>;

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected notifyService: NotifyService,
    protected translateService: TranslateService
  ) {
    super(
      environment.api.path.support,
      restClientService,
      router,
      activatedRoute,
      notifyService,
      translateService
    );

    this.model = new Support();
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
  }
}
