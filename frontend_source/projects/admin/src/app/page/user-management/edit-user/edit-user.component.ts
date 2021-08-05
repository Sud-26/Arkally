import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { EditPageTemplate } from '../../edit-page.template';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { UserManagement } from '../user-management.model';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html'
})
export class EditUserComponent extends EditPageTemplate<UserManagement> implements OnInit {

  languages$: Observable<any>;
  accountTypes$: Observable<any>;
  timezones$: Observable<any>;

  secondPassword: string;
  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected notifyService: NotifyService,
    protected translateService: TranslateService
  ) {
    super(
      environment.api.path.user_management,
      restClientService,
      router,
      activatedRoute,
      notifyService,
      translateService
    );

    this.model = new UserManagement();
  }

  ngOnInit() {
    this.languages$ = this.restClientService.get(environment.api.path.dropdown.language);
    this.accountTypes$ = this.restClientService.get(environment.api.path.dropdown.account_type);
    this.timezones$ = this.restClientService.get(environment.api.path.dropdown.timezone);

   
  }
  ngAfterViewInit(){
    setTimeout(()=>{this.model.password = "" },2000)
  }


  save() {
    if (this.model.password == "") {
       this.notifyService.success('Previous Password remain same');
       this.saveEditUser();
      
    } else if (this.editForm.valid && this.model.password !== this.secondPassword) {
      this.notifyService.error('passwords-dont-match');
    } else if (this.editForm.valid) {
      this.saveEditUser()
    }
  }

  saveEditUser(){
    
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
