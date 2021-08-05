import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../security/service/authentication/authentication.service';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { EditPageTemplate } from '../../edit-page.template';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { Rent } from '../rent.model';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-rent',
  templateUrl: './edit-rent.component.html'
})
export class EditRentComponent extends EditPageTemplate<Rent> implements OnInit {

  users$: Observable<any>;
  traceable_objects$: Observable<any>;

  permissionUpdateAdmin = false;

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected notifyService: NotifyService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService
  ) {
    super(
      environment.api.path.rent,
      restClientService,
      router,
      activatedRoute,
      notifyService,
      translateService
    );
    this.model = new Rent();
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
    this.traceable_objects$ = this.restClientService.get(environment.api.path.dropdown.traceable_object);
    this.permissionUpdateAdmin = this.authenticationService.checkPermission('rent', 'filter_user');
  }
}
