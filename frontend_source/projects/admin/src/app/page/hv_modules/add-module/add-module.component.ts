import { Component, OnInit } from '@angular/core';

import { AddPageTemplate } from '../../add-page.template';
import { AuthenticationService } from '../../../security/service/authentication/authentication.service';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { HwModule } from '../hv_module.model';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html'
})
export class AddModuleComponent extends AddPageTemplate<HwModule> implements OnInit {

  users$: Observable<any>;
  objects$: Observable<any>;
  unassignedModules: Observable<any>;

  permissionUpdateAdmin = false;

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService
  ) {
    super(
      environment.api.path.hw_modules,
      restClientService,
      router,
      notifyService,
      translateService
    );
    this.model = new HwModule();
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
    this.objects$ = this.restClientService.get(environment.api.path.dropdown.traceable_object);
    this.unassignedModules = this.restClientService.get(environment.api.path.dropdown.unassigned_hw_modules);

    this.permissionUpdateAdmin = this.authenticationService.checkPermission('hw_module', 'update_admin');
  }
}
