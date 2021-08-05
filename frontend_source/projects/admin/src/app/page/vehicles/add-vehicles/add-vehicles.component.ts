import { Component, OnInit, ViewChild } from '@angular/core';

import { AddPageTemplate } from '../../add-page.template';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Vehicle } from '../vehicle.model';
import { environment } from 'projects/admin/src/environments/environment';
import { NgForm } from '@angular/forms';

const FIRST_YEAR = '01 ' + 'July 1900';
const LAST_YEAR = '01 ' + 'May 2100';

@AutoUnsubscribe()
@Component({
  selector: 'app-add-vehicles',
  templateUrl: './add-vehicles.component.html'
})
export class AddVehiclesComponent extends AddPageTemplate<Vehicle> implements OnInit {

  
  @ViewChild('newForm', { static: false })
  mySelectForm: NgForm;

  objectsTypes$: Observable<any>;
  vehicleBrands$: Observable<any>;
  vehicleModels$: Observable<any>;
  years;

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected translateService: TranslateService
  ) {
    super(
      environment.api.path.vehicles,
      restClientService,
      router,
      notifyService,
      translateService
    );

    this.model = new Vehicle();
  }

  ngOnInit() {
    this.objectsTypes$ = this.restClientService.get(environment.api.path.dropdown.traceable_object_types)
    this.vehicleBrands$ = this.restClientService.get(environment.api.path.dropdown.vehicle_brand);

    this.generateYearsArray();
  }

  onFormSubmit() {
    this.mySelectForm.form.markAllAsTouched();
    if (this.mySelectForm.form.invalid) {
      this.notifyService.error('Please fill valid details!');
      return false;
    }
  }

  onKeyDown(e){
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
  }

  generateYearsArray() {
    const firstDate = new Date(FIRST_YEAR);
    const secondDate = new Date(LAST_YEAR);

    const first = firstDate.getFullYear();
    const second = secondDate.getFullYear();

    const arr = Array();

    for (let i = first; i <= second; i++) {
      arr.push({ value: i });
    }

    this.years = arr;
  }

  onBrandChange(event) {
    this.vehicleModels$ = this.restClientService.get(`${environment.api.path.dropdown.vehicle_model}/${event}`);
  }
}
