import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CancelSaveComponent } from './component/cancel-save/cancel-save.component';
import { ClearAddComponent } from './component/clear-add/clear-add.component';
import { ConditionalPipe } from './pipe/conditional.pipe';
import { CovalentModule } from './covalent.module';
import { DateTimestamp } from './pipe/date-timestamp.pipe';
import { DivFieldComponent } from './component/div-field/div-field.component';
import { DropMenuComponent } from './component/drop-menu/drop-menu.component';
import { FormHeaderComponent } from './component/form-header/form-header.component';
import { HttpLoaderFactory } from './factory/http-loader.factory';
import { Iso8601Pipe } from './pipe/iso-8601.pipe';
import { LoginComponent } from './component/login/login.component';
import { MatSelectionListMultipleDirective } from './directive/mat-selection-list-multiple/mat-selection-list-multiple.directive';
import { MaterialModule } from './material.module';
import { MqIfDirective } from './directive/mq-if/mq-if.directive';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NonAvailablePipe } from './pipe/non-available.pipe';
import { OverviewTableComponent } from './component/overview-table/overview-table.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { RootLayoutComponent } from './component/root-layout/root-layout.component';
import { SimpleIso8601Pipe } from './pipe/simple-iso-8601.pipe';
import { SimpleTimestampPipe } from './pipe/simple-timestamp.pipe';
import { TimestampPipe } from './pipe/timestamp.pipe';
import { UuidButtonComponent } from './component/uuid-button/uuid-button.component';

/**
 * Shared module.
 * This should be only directly exportable (public-api.ts) module in nvl-shared lib project.
 * Put all shareable componentes, services, directives etc. in this project and module.
 * @author __
 */
@NgModule({
  declarations: [
    Iso8601Pipe,
    SimpleIso8601Pipe,
    ConditionalPipe,
    TimestampPipe,
    DateTimestamp,
    SimpleTimestampPipe,
    NonAvailablePipe,
    LoginComponent,
    RootLayoutComponent,
    DropMenuComponent,
    MqIfDirective,
    MatSelectionListMultipleDirective,
    OverviewTableComponent,
    ClearAddComponent,
    CancelSaveComponent,
    DivFieldComponent,
    UuidButtonComponent,
    FormHeaderComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CovalentModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgMaterialMultilevelMenuModule,
    NgSelectModule,
    NgbModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'No data found', // Message to show when array is presented, but contains no values
        totalMessage: ' - number of rows', // Footer total message
        selectedMessage: 'Selected' // Footer selected message
      }
    })
  ],
  exports: [
    CovalentModule,
    CancelSaveComponent,
    ClearAddComponent,
    DivFieldComponent,
    FormsModule,
    LoginComponent,
    TranslateModule,
    RootLayoutComponent,
    MaterialModule,
    NgMaterialMultilevelMenuModule,
    NgSelectModule,
    ReactiveFormsModule,
    OverviewTableComponent,
    OwlDateTimeModule,
    UuidButtonComponent,
    FormHeaderComponent,
    ConditionalPipe
  ]
})
export class NvlSharedModule { }
