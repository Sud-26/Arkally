import { Component, OnInit } from '@angular/core';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { NotifyService } from '../../service/notify/notify.service';
import { environment } from 'projects/admin/src/environments/environment';

const mailVerifyPath = environment.api.path.mailVerify;
@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./../dashboard/dashboard.component.scss']
})
export class EmailVerifyComponent implements OnInit {

  constructor(
    protected restClientService: RestClientService,
    protected notifyService: NotifyService
  ) { }

  ngOnInit() {
  }
  onVerify(){
    const userId =  localStorage.getItem('userId');
    this.restClientService.get(mailVerifyPath+'/'+userId).subscribe(
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
