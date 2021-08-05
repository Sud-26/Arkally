import { Component, OnInit, Output, EventEmitter,  ElementRef} from '@angular/core';
// import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPassDailogComponent } from '../dialog/forget-pass-dailog/forget-pass-dailog.component';
import { LoginDailogComponent } from '../dialog/login/login.component';
import { RegisterDailogComponent } from '../dialog/register/register.component';



@Component({
  selector: 'app-dash-header',
  templateUrl: './header.component.html',
  styleUrls: ['./../dashboard/dashboard.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
  }
})

export class HeaderComponent implements OnInit {
  collapse: boolean = false;
  width: number = 0;
  mobileView: boolean = false;

  constructor(
    public dialog: MatDialog,
    scroll: ElementRef,
  ) {
  }



  @Output()
  scrollView = new EventEmitter<any>();

  ngOnInit() {
    if (window.innerWidth < 993) {
      this.mobileView = true;
    }
  }

  onScrollView(ele, id) {
    this.collapse = false;
    this.scrollView.emit({ ele, id });
  }

  onResize(event: any) {
    this.width = event.target.innerWidth;
    if (this.width < 993) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  }

  openForgotPass(e) {
    this.dialog.open(ForgetPassDailogComponent, {
      width: '500px'
    });
  }

  openLoginDialog() {
    this.collapse = false;
    this.dialog.open(LoginDailogComponent, {
      width: '500px'
    });
  }

  openRegisterDialog() {
    this.collapse = false;
    this.dialog.open(RegisterDailogComponent, {
      width: '500px'
    });
  }

  scrollUp($element) {
    this.collapse = false;
    // console.log( $element.target)
    document.querySelector('.fixed-header').scrollIntoView({ behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let lists = document.querySelectorAll('.navbar-collapse .nav-link');
    this.removeActiveLink(lists);
  }

  removeActiveLink(lists) {
    for (var i = 0; i < lists.length; i++) {
      lists[i].classList.remove('active');
      if (lists[i].classList[0] == 'nav-item') {
        lists[i].children[0].classList.remove('active');
      }
    }
  }



}
