import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ForgetPassDailogComponent } from '../forget-pass-dailog/forget-pass-dailog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['././../../dashboard/dashboard.component.scss']
})
export class LoginDailogComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openForgotPass(){
    this.dialog.closeAll();
    this.dialog.open(ForgetPassDailogComponent,{
      width: '500px'
    });
  }


}
