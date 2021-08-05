import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { ActionSliderDialogComponent } from './component/action-slider-dialog/action-slider-dialog.component';
import { AddModuleComponent } from './page/hv_modules/add-module/add-module.component';
import { AddRebateComponent } from './page/rebate/add-rebate/add-rebate.component';
import { AddRentComponent } from './page/rent/add-rent/add-rent.component';
import { AddSubscriptionComponent } from './page/subscription/add-subscription/add-subscription.component';
import { AddSupportComponent } from './page/support/add-support/add-support.component';
import { AddUserComponent } from './page/user-management/add-user/add-user.component';
import { AddVehiclesComponent } from './page/vehicles/add-vehicles/add-vehicles.component';
import { AppComponent } from './page/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { BigScreenModule } from 'angular-bigscreen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ColorPickerModule } from 'ngx-color-picker';
import { ConsoleComponent } from './page/console/console.component';
import { CoreComponent } from './page/core/core.component';
import { EditModuleComponent } from './page/hv_modules/edit-module/edit-module.component';
import { EditRebateComponent } from './page/rebate/edit-rebate/edit-rebate.component';
import { EditRentComponent } from './page/rent/edit-rent/edit-rent.component';
import { EditSubscriptionComponent } from './page/subscription/edit-subscription/edit-subscription.component';
import { EditSupportComponent } from './page/support/edit-support/edit-support.component';
import { EditUserComponent } from './page/user-management/edit-user/edit-user.component';
import { EditVehiclesComponent } from './page/vehicles/edit-vehicles/edit-vehicles.component';
import { HttpClientModule } from '@angular/common/http';
import { HwModulesComponent } from './page/hv_modules/hv_modules.component';
import { LOCALE_ID } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { LocationComponent } from './page/locations/location/location.component';
import { LocationsComponent } from './page/locations/locations.component';
import { LoginComponent } from './page/login/login.component';
import { MapDashboardComponent } from './page/map-dashboard/map-dashboard.component';
import { MapPointDialogComponent } from './component/map-point-dialog/map-point-dialog.component';
import { VehicleSlotDialog } from './component//vehicle-slot-dialog/vehicle-slot-dialog.component';
import { MatDialogServiceModule } from 'dialog-service'
import { MatExpansionModule } from '@angular/material/expansion';
import { Ng8BreadcrumbModule } from 'ng8-breadcrumb';
import { NotifierModule } from 'angular-notifier';

import { RebateComponent } from './page/rebate/rebate.component';
import { RentComponent } from './page/rents/rent.component';
import { ReportComponent } from './page/report/report.component';
import { SecurityModule } from './security/security.module';
import { SubscriptionComponent } from './page/subscription/subscription.component';
import { SupportComponent } from './page/support/support.component';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementComponent } from './page/user-management/user-management.component';
import { UserProfileComponent } from './page/user-profile/user-profile.component';
import { VehiclesComponent } from './page/vehicles/vehicles.component';
import { AlarmListComponent } from './page/alarm-list/alarm-list.component';
import localeEn from '@angular/common/locales/en';
import localeHr from '@angular/common/locales/hr';
import { notiferConfig } from '../configs/notifer';
import { registerLocaleData } from '@angular/common';
import { NvlSharedModule } from 'projects/nvl-shared/src/lib/nvl-shared.module';
import { RentStatsComponent } from './page/rent-stats/rent-stats.component';
import { RentStatsDialogComponent } from './component/rent-stats-dialog/rent-stats-dialog.component';
import { FooterComponent } from './frontend/footer/footer.component';
import { HeaderComponent } from './frontend/header/header.component';
import { DashboardComponent } from './frontend/dashboard/dashboard.component';

import { RegisterDailogComponent } from './frontend/dialog/register/register.component';
import { LoginDailogComponent } from './frontend/dialog/login/login.component';
import { ForgetPassDailogComponent } from './frontend/dialog/forget-pass-dailog/forget-pass-dailog.component';

import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import {ReportDetailsComponent} from './page/report/report-details/report-details.component';

import { GaugeChartModule } from 'angular-gauge-chart'
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { DashLoginComponent } from './frontend/dash-login/dash-login.component';
import { DashRegisterComponent } from './frontend/dash-register/dash-register.component';
import { AdminDashboardComponent } from './page/admin-dashboard/admin-dashboard.component';
import { EmailVerifyComponent } from './frontend/email-verify/email-verify.component';
import { PieDetailsComponent } from './page/admin-dashboard/pie-details/pie-details.component';

import { ChartsModule } from 'ng2-charts';
import { TravelDetailsComponent } from './page/admin-dashboard/travel-details/travel-details.component';
import { SpeedDetailsComponent } from './page/admin-dashboard/speed-details/speed-details.component';
import { MileageDetailsComponent } from './page/admin-dashboard/mileage-details/mileage-details.component';
import { VehicleDetailsDailogComponent } from './component/vehicle-details-dailog/vehicle-details-dailog.component';
import { AboutComponent } from './frontend/about/about.component';



registerLocaleData(localeHr, 'hr');
registerLocaleData(localeEn, 'en');

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      let langToSet = localStorage.getItem('locale');

      if (langToSet === undefined ||langToSet === null) {
        langToSet = 'en';
      }

      translate.setDefaultLang(langToSet);
      translate.use(langToSet).subscribe(
        () => {
          console.log(`Successfully initialized '${langToSet}' language.'`);
        }, err => {
          console.error(`Problem with '${langToSet}' language initialization.'`);
        }, () => {
          resolve(null);
        });
    });
  });
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CoreComponent,
    VehiclesComponent,
    LocationsComponent,
    HwModulesComponent,
    ConsoleComponent,
    SubscriptionComponent,
    SupportComponent,
    AddModuleComponent,
    EditModuleComponent,
    AddVehiclesComponent,
    EditVehiclesComponent,
    LocationComponent,
    AddSupportComponent,
    EditSupportComponent,
    EditSubscriptionComponent,
    AddSubscriptionComponent,
    RebateComponent,
    RentComponent,
    MapDashboardComponent,
    AddRebateComponent,
    AddRentComponent,
    EditRebateComponent,
    EditRentComponent,
    UserManagementComponent,
    AddUserComponent,
    EditUserComponent,
    UserProfileComponent,
    ActionSliderDialogComponent,
    ReportComponent,
    MapPointDialogComponent,
    AlarmListComponent,
    VehicleSlotDialog,
    RentStatsComponent,
    RentStatsDialogComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    LoginDailogComponent,
    RegisterDailogComponent,
    ForgetPassDailogComponent,
    ReportDetailsComponent,
    DashLoginComponent,
    DashRegisterComponent,
    AdminDashboardComponent,
    EmailVerifyComponent,
    PieDetailsComponent,
    TravelDetailsComponent,
    SpeedDetailsComponent,
    MileageDetailsComponent,
    VehicleDetailsDailogComponent,
    AboutComponent
  ],
  imports: [
    Ng8BreadcrumbModule.forRoot({
      prefix: false
    }),
    HttpClientModule,
    BigScreenModule,
    BrowserModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AppRoutingModule,
    ColorPickerModule,
    NvlSharedModule,
    MatDialogServiceModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    SecurityModule,
    NotifierModule.withConfig(notiferConfig),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
      disableConsoleLogging: false
    }),
    NgxPageScrollCoreModule,
    GaugeChartModule,
    NgxSliderModule,
    ChartsModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [TranslateService, Injector], multi: true },
    { provide: LOCALE_ID, useValue: 'hr-HR' },
    { provide: MAT_DATE_LOCALE, useValue: 'hr-HR' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ActionSliderDialogComponent, 
    MapPointDialogComponent,
    VehicleSlotDialog,
    VehicleDetailsDailogComponent,
    RentStatsDialogComponent,
    LoginDailogComponent,
    RegisterDailogComponent,
    ForgetPassDailogComponent
  ],
})
export class AppModule { }
