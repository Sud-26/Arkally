import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';

import { AutoUnsubscribe } from '../../decorator/autounsubscribe.decorator';
import { FormBuilderService } from '../../service/form-builder/form-builder.service';
import { LoginConfig } from '../../model/config/login.config';
import { TdDynamicFormsComponent } from '@covalent/dynamic-forms';
import { TranslateService } from '@ngx-translate/core';

/**
 * Login component.
 * @author __
 */
@AutoUnsubscribe()
@Component({
  selector: 'nvl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnChanges {
  constructor(
    private translateService: TranslateService,
    private formBuilderService: FormBuilderService
  ) {}

  @Input()
  config: LoginConfig;

  @Input()
  loginAttempt: number; // * Increase if login don't pass

  @Input()
  env: any;

  @Output()
  login = new EventEmitter();

  selectedLocale;

  state = {
    loginAttemptFailed: false, // Show error message if login attempt don't pass
  };

  formElements;

  @ViewChild('loginForm', { static: false })
  loginForm: TdDynamicFormsComponent;

  translate = (tag: string) => this.translateService.instant(tag);

  ngOnInit() {
    this.formElements = [
      this.formBuilderService.text('username', 'app.username', true),
      this.formBuilderService.password('password', 'app.password', true),
    ];

    this.setDefaultLanguage();
  }

  // * If login attempt failed show message
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    const loginAttempt: SimpleChange = changes.loginAttempt;

    if (loginAttempt && !loginAttempt.firstChange) {
      this.state.loginAttemptFailed = true;
    }
  }

  // * Emit username and password to parent component,
  // * parent component is responsible for actual login
  doLogin() {
    this.state.loginAttemptFailed = false;

    if (this.loginForm.valid) {
      this.login.emit(this.loginForm.value);
    }
  }

  getClass(element: string) {
    switch (element) {
      case 'avatar':
        return this.config.avatar && this.config.avatar.class
          ? this.config.avatar.class
          : 'avatar';
    }
  }

  getStyle(element: string) {
    switch (element) {
      case 'avatar:background-color':
        return this.config.avatar && this.config.avatar.background
          ? this.config.avatar.background
          : '';
    }
  }

  getTitle() {
    return this.config.navbar ? '' : this.translate(this.config.title);
  }

  closeErrorMessage() {
    this.state.loginAttemptFailed = false;
  }

  setDefaultLanguage() {
    const locale = localStorage.getItem('locale');

    if (locale === undefined || locale === null) {
      this.selectedLocale = 'en';
    } else {
      this.selectedLocale = locale;
    }
  }

  languageChange($event) {
    localStorage.setItem('locale', this.selectedLocale);

    let langToSet = localStorage.getItem('locale');

    if (langToSet === undefined || langToSet === null) {
      langToSet = 'en';
    }

    this.translateService.use(langToSet).subscribe(
        () =>  window.location.reload(true)
    );
  }
}
