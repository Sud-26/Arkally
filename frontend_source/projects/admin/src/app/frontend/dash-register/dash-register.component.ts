import { Component, OnInit } from '@angular/core';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { NotifyService } from '../../service/notify/notify.service';
import { environment } from 'projects/admin/src/environments/environment';

import { RegisterForm } from '../register.model';

const emailVerification = environment.api.path.emailVerification;

@Component({
  selector: 'app-dash-register',
  templateUrl: './dash-register.component.html',
  styleUrls: ['./../dashboard/dashboard.component.scss']
})
export class DashRegisterComponent implements OnInit {
  registerForm: RegisterForm;

  constructor(
    protected restClientService: RestClientService,
    protected notifyService: NotifyService
  ) {
  }

  ngOnInit() {
  }
  onRegister(form, event: Event) {
    event.preventDefault();
    Object.keys(form).forEach(key => form[key] === undefined ? form[key] = '' : form[key])
    form.fullname = form.firstName + ' ' + form.lastName

    form.postalCode = String(form.postalCode)
    form.mobileNumber = String(form.mobileNumber)

    delete form.terms;
    delete form.updateByMails;
    if (
      // form.firstName != ''
      // && form.lastName != ''
      form.fullname != ''
      && form.address != ''
      && form.postalCode != ''
      && form.city != ''
      && form.country != ''
      && form.postalCode != ''
      && form.city != ''
      && form.country != ''
      && form.mobileNumber != ''
      && form.email != ''
      && form.password != ''
      && form.confirmPassword != ''
      // && form.terms != ''
    ) {
      if (form.password === form.confirmPassword) {
        this.restClientService
          .post(environment.api.path.createUserFront, form)
          .subscribe(response => {
            if (response.success) {
              this.notifyService.success(response.message);
              this.onEmailVerification(response.data.user_id);
            } else {
              this.notifyService.error(response.message);
            }
          });

      } else {
        this.notifyService.error("Password don't match ! Please re-enter the password");
      }

    } else {
      this.notifyService.error("Please fill the required fields");
    }


  }

  onEmailVerification(userId) {

    let obj = {'user_id': userId};
    localStorage.setItem('userId', userId);
    this.restClientService.post(emailVerification, obj).subscribe(
			response => {
				if (!Array.isArray(response)) {
					this.notifyService.success(response.message);
				} else {
					// console.log(response)
					this.notifyService.error('Something went wrong');
				}
			}
		);
  }
}
