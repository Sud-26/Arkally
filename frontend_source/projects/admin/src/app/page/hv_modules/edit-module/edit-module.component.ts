import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../security/service/authentication/authentication.service';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { EditPageTemplate } from '../../edit-page.template';
import { HwModule } from '../hv_module.model';
import { NotifierService } from 'angular-notifier';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html'
})
export class EditModuleComponent extends EditPageTemplate<HwModule> implements OnInit {

  users$: Observable<any>;
  objects$: Observable<any>;
  unassignedModules: Observable<any>;

  permissionUpdateAdmin = false;
  permissionUpdateUser = false;

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected notifyService: NotifyService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService
  ) {
    super(environment.api.path.hw_modules, restClientService, router, activatedRoute, notifyService, translateService);
    this.model = new HwModule();
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
    this.objects$ = this.restClientService.get(environment.api.path.dropdown.traceable_object);
    this.permissionUpdateAdmin = this.authenticationService.checkPermission('hw_module', 'update_admin');
    this.permissionUpdateUser = this.authenticationService.checkPermission('hw_module', 'update_user');
    this.unassignedModules = this.restClientService.get(environment.api.path.dropdown.unassigned_hw_modules);


    console.log(this.model, 'data')
  }
}
