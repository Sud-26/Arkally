import { Component, OnInit } from "@angular/core";
import { NotifyService } from "../../../service/notify/notify.service";
import { environment } from "projects/admin/src/environments/environment";
import { RestClientService } from "projects/admin/src/app/service/rest-client/rest-client.service";
// import { ThrowStmt } from "@angular/compiler";

const path = environment.api.path,
  forgotPassEmail = path.forgotPassEmail,
  validateOtp = path.validateOtp,
  resetPassword = path.resetPassword;

@Component({
  selector: "app-forget-pass-dailog",
  templateUrl: "./forget-pass-dailog.component.html",
  styleUrls: ["././../../dashboard/dashboard.component.scss"],
})
export class ForgetPassDailogComponent implements OnInit {
  otpFields: boolean = false;
  isPassword: boolean = false;
  isConfirmPassword: boolean = false;
  nextFirst: boolean = true;
  nextSecond: boolean = false;
  finalBtn: boolean = true;
  email: string;
  otp: number;
  password: any;
  confirmPassword: any;

  constructor(
    protected notifyService: NotifyService,
    protected restClientService: RestClientService
  ) {}

  ngOnInit() {}

  onNext() {
    // console.log(this.email)
    // console.log(this.email)
    // if(this.email != '' && this.email != undefined && this.email.split('@').length > 1){
    //   // this.otpFields = true;
    // } else{
    //   this.notifyService.error('Please enter valid Email')
    // }
    let obj = { email: this.email };

		this.restClientService.post(forgotPassEmail, obj).subscribe(
			response => {
				if (!Array.isArray(response)) {
					this.notifyService.success(response.message);
					this.otpFields = true;
					this.nextFirst = false;
					this.nextSecond = true;
				} else {
					// console.log(response)
					this.notifyService.error('Plese enter valid email id');
				}
			}
		);
		
  }

  onOtpUpdate = ($value) => (this.otp = $value);

  onPasswordChange = ($value) => (
    console.log($value), (this.password = $value)
  );

  onConfirmPasswordChange = ($value) => (
    console.log($value), (this.confirmPassword = $value)
  );

  onNextStep() {
    let obj = { email: this.email, otp: this.otp };
    this.restClientService.post(validateOtp, obj).subscribe(
      (response) => {
        if (!Array.isArray(response)) {
          this.otpFields = false;
          this.isPassword = true;
          this.isConfirmPassword = true;

          this.nextSecond = false;
          this.finalBtn = true;
					this.notifyService.success(response.message);
        } else {
          this.notifyService.error('Enter valid otp');
        }
      },
      (error) => {
        console.log(error);
        this.notifyService.error(error.message);
      }
    );
  }

  onSubmit() {
    if (
      this.password === this.confirmPassword &&
      this.password != "" &&
      this.confirmPassword
    ) {
      let obj = { email: this.email, password: this.password };
      this.restClientService.post(resetPassword, obj).subscribe(
        (response) => {
					if(!Array.isArray(response)){
						this.notifyService.success(response.message);
					}
				},
        
      );
    } else {
      this.notifyService.error("Password do not match !");
    }
  }

 
}
