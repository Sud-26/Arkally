import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe, ConditionalPipe, DateTimestamp} from 'projects/nvl-shared/src/public-api';
import { Observable, Subscription } from 'rxjs';

import { AuthenticationService } from './../../../security/service/authentication/authentication.service';
import { BigScreenService } from 'angular-bigscreen';
import { DatePipe } from '@angular/common';
import { MapComponent } from 'projects/nvl-shared/src/lib/component/map/map.component';
import { MapService } from 'projects/nvl-shared/src/lib/service/map/map.service';
import { RestClientService } from './../../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';


declare let L;

const DROPDOWN_PATHS = environment.api.path.dropdown;
const API_PATHS = environment.api.path;

@AutoUnsubscribe()

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})

export class ReportDetailsComponent extends MapComponent implements OnInit,OnDestroy, AfterViewInit {
  @ViewChild('reportMap', { static: null })
  elementRef: ElementRef;

  SelectionType = SelectionType;

  conditionalPipe = new ConditionalPipe();
  dateTimestampPipe = new DateTimestamp();

  users$: Observable<any>;
  objects$: Observable<any>;



  loader = false;

  featureGroupPoint;
  featureGroupLine;

  // * feature groups
  featureGroupPolledFeatures;
  featureGroupPolledFeaturesAlt;
  featureGroupGeography;

  rows = [];


  // * subscriptions
  subscriptionPolledFeatures: Subscription;
  subscriptionGeographyFeatures: Subscription;
  subscriptionPolling: Subscription;


  constructor(
    private restClientService: RestClientService,
    private translateService: TranslateService,
    public authenticationService: AuthenticationService,
    protected mapService: MapService,
    protected bigScreenService: BigScreenService,
    protected router: Router,
    private datePipe: DatePipe,
  ) {
    super(bigScreenService, mapService);
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.init();
    this.enableCoordinatesControl();
    this.addScalebarButton();
    this.addExpandButton();
    this.fetchGeography();
  }
  ngOnDestroy() {
  }

  private fetchGeography() {
    this.featureGroupGeography = L.featureGroup().addTo(this.map);

    this.subscriptionGeographyFeatures = this.restClientService
      .get(API_PATHS.module_position.geography)
      .subscribe((response) => {
        this.mapService.addLocations(
          response.data.features,
          this.featureGroupGeography
        );
        // this.lastRefresh = new Date();
      });
  }



  selectedRow($event) {
    const coordinates = $event.selected[0]
      .geom
      .coordinates;

    this.featureGroupPoint.clearLayers();

    const marker = L.marker(coordinates).addTo(this.featureGroupPoint);

    this.map.setView(this.featureGroupPoint.getBounds().getCenter(), environment.zoomLevel.reportMarker);
  }

  private init() {
    // debugger
    this.createMap();
    this.addLayers(
      [
        'open-street-maps',
        'open-sea-maps',
        'graticule',
        'scalebar'
      ]
    );
    // this.addScalebarButton();
    // this.addExpandButton();

    this.featureGroupPoint = L.featureGroup().addTo(this.map);
    this.featureGroupLine = L.featureGroup().addTo(this.map);
  }

  private getTripInfo() {
    if (this.featureGroupLine !== undefined) {
      this.featureGroupLine.clearLayers();
    }

    
  }


}
