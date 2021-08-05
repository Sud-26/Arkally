import 'leaflet/dist/images/marker-shadow.png';

import { AfterViewInit, Component, OnDestroy, OnInit, ɵConsole } from '@angular/core';
import { Observable, Subscription, forkJoin, of } from 'rxjs';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/public-api';
import { BigScreenService } from 'angular-bigscreen';
import { MapComponent } from 'projects/nvl-shared/src/lib/component/map/map.component';
import { MapPointDialogComponent } from '../../component/map-point-dialog/map-point-dialog.component';
import { MapService } from 'projects/nvl-shared/src/lib/service/map/map.service';
import { MatDialog } from '@angular/material';
import { NotifyService } from '../../service/notify/notify.service';
import { PollService } from 'projects/nvl-shared/src/lib/service/poll/poll.service';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Vehicle } from '../vehicles/vehicle.model';
import { environment } from 'projects/admin/src/environments/environment';


declare let L;

const DROPDOWN_PATHS = environment.api.path.dropdown;
const API_PATHS = environment.api.path;

@AutoUnsubscribe()
@Component({
  selector: 'app-map-dashboard',
  templateUrl: './map-dashboard.component.html',
  styleUrls: ['./map-dashboard.component.scss'],
})
export class MapDashboardComponent extends MapComponent
  implements OnInit, OnDestroy, AfterViewInit {
  poll: boolean;
  trace = true;
  isAlternative = false;
  userId: number;
  lastRefresh: Date = new Date();
  traceableObjectIds: any[];
  traceableObjectIdsCollector: any[] = [];

  // * subscriptions
  subscriptionPolledFeatures: Subscription;
  subscriptionGeographyFeatures: Subscription;
  subscriptionPolling: Subscription;

  // * feature groups
  featureGroupPolledFeatures;
  featureGroupPolledFeaturesAlt;
  featureGroupGeography;

  // * dropdown values
  users$: Observable<any>;
  objects$: Observable<any[]>;

  // * permissions
  permissionFilterUsers;
  permissionDefaultView;



  constructor(
    private dialog: MatDialog,
    private pollService: PollService,
    private restClientService: RestClientService,
    protected mapService: MapService,
    protected bigScreenService: BigScreenService,
    public authenticationService: AuthenticationService,
    public notifyService: NotifyService,
    
  ) {
    super(bigScreenService, mapService);
    this.permissionFilterUsers = authenticationService.checkPermission(
      'map',
      'filter_user'
    );
    this.permissionDefaultView = authenticationService.checkPermission(
      'map',
      'default_view'
    );
    if(localStorage.getItem('trace') != null){
      localStorage.getItem('trace') === 'false' ?  this.trace = false : this.trace = true;
    }

    // console.log(localStorage.getItem('trace') != null,Boolean(localStorage.getItem('trace')), this.trace)
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(DROPDOWN_PATHS.user_management);
    this.objects$ = this.restClientService.getForDropdown(
      DROPDOWN_PATHS.traceable_object
    );
    this.objects$.subscribe((data) => {
      data.forEach((it: Vehicle) =>
        this.traceableObjectIdsCollector.push(it.id)
      );
    });
    
  }

  ngAfterViewInit() {
    this.createMap();
    this.addLayers([
      'open-street-maps',
      'open-sea-maps',
      'graticule',
      'scalebar',
    ]);

    this.enableCoordinatesControl();
    this.addScalebarButton();
    this.addExpandButton();
    this.fetchGeography();

    // Init feature group and do initial fetch from api
    this.featureGroupPolledFeatures = L.featureGroup().addTo(this.map);
    this.featureGroupPolledFeaturesAlt = L.featureGroup().addTo(this.map);
    this.fetchPolledFeatures();

    this.mapService.invalidate(this.map);

    this.startPolling();
  }

  ngOnDestroy() {
    this.subscriptionPolling.unsubscribe();
    this.subscriptionPolledFeatures.unsubscribe();
    this.subscriptionGeographyFeatures.unsubscribe();
  }

  traceOnOff = ($event) => (this.trace = $event.checked, localStorage.setItem('trace', $event.checked)
    );

  resetFilters() {
    this.traceableObjectIds = null;
    this.userId = null;
  }

  onTraceableObjectSelectChange() {
    this.fetchPolledFeatures();
  }

  onUserSelectChange($event) {
    let options;

    if ($event !== null && $event !== undefined) {
      options = `?user_id=${$event}`;
    }

    this.objects$ = this.restClientService.getForDropdown(
      DROPDOWN_PATHS.traceable_object,
      options
    );
  }

  resetToDefaults() {
    const localStorageZoomLevel = localStorage.getItem('default-zoom');
    const zoomLevel =
      localStorageZoomLevel === undefined || localStorageZoomLevel === null
        ? environment.zoomLevel.mapGeography
        : localStorageZoomLevel;

    const lat = localStorage.getItem('default-lat');
    const lng = localStorage.getItem('default-lng');

    const center =
      lat === undefined || lat === null ? null : L.latLng(lat, lng);

    if (center !== null) {
      this.map.setView(center, zoomLevel);
    } else if (!this.isEmpty(this.featureGroupGeography.getBounds())) {
      this.mapService.fitBounds(
        this.map,
        this.featureGroupGeography,
        zoomLevel
      );
    }
  }

  resetToBoundDefaults() {
    if (!this.isEmpty(this.featureGroupGeography.getBounds())) {
      this.mapService.fitBounds(
        this.map,
        this.featureGroupGeography,
        environment.zoomLevel.mapGeography
      );
    }
  }

  trackVehicle() {
    const featureGroup = this.isEmpty(
      this.featureGroupPolledFeatures.getBounds()
    )
      ? this.featureGroupPolledFeaturesAlt
      : this.featureGroupPolledFeatures;

    this.mapService.fitBounds(
      this.map,
      featureGroup,
      environment.zoomLevel.vehicle
    );
  }

  saveDefaultsToLocalStorage() {
    const lat = this.map.getBounds().getCenter().lat;
    const lng = this.map.getBounds().getCenter().lng;

    localStorage.setItem('default-zoom', this.map.getZoom());
    localStorage.setItem('default-lat', lat);
    localStorage.setItem('default-lng', lng);

    this.notifyService.success('map-defaults');
  }

  private fetchGeography() {
    this.featureGroupGeography = L.featureGroup().addTo(this.map);

    this.subscriptionGeographyFeatures = this.restClientService
      .get(API_PATHS.module_position.geography)
      .subscribe((response) => {
        localStorage.setItem('map', JSON.stringify(response.data.features))
        this.mapService.addLocations(
          response.data.features,
          this.featureGroupGeography
        );
        this.resetToDefaults();
        this.lastRefresh = new Date();
      });
  }

  private fetchPolledFeatures() {
   
    const params = this.buildParams();

    const responsePoint = this.restClientService.get(
      API_PATHS.module_position.point + params
    );

    const responseLines =
      this.trace === true
        ? this.restClientService.get(API_PATHS.module_position.line + params)
        : null;

    const {
      featureGroup,
      featureGroupAlt,
    } = this.evaluateAlternativeFeatureGroup();

    this.forkJoinResponses(
      responseLines === null ? [responsePoint] : [responsePoint, responseLines],
      featureGroup,
      featureGroupAlt
    );

  }

  private buildParams() {
    let params = null;

    if (
      this.traceableObjectIds !== null &&
      this.traceableObjectIds !== undefined &&
      params === null
    ) {
      params = `?vehicles=${this.traceableObjectIds}`;
    } else if (
      this.traceableObjectIds !== null &&
      this.traceableObjectIds !== undefined
    ) {
      params = params + `&vehicles=${this.traceableObjectIds}`;
    }

    if (params === null) {
      params = '';
    }

    return params;
  }

  private forkJoinResponses(
    observables: Observable<any>[],
    featureGroup: any,
    featureGroupAlt: any
  ) {
    this.subscriptionPolledFeatures = forkJoin(observables).subscribe(
      (responses) => {
        responses.forEach((response) => {
          switch (response.data.property.layer_type) {
            case 'point':
              this.addMarker(response, featureGroup);
              break;
            case 'line':
              this.mapService.addPolyLinesToFeatureGroup(
                response.data.features,
                featureGroup
              );
              break;
          }
        });

        featureGroupAlt.clearLayers();
        this.lastRefresh = new Date();
      }
    );
  }

  private addMarker(response: any, featureGroup: any) {

    localStorage.setItem('featuresData', JSON.stringify(''));
    localStorage.setItem('featuresData', JSON.stringify(response.data.features));

    this.mapService.addMarkersToFeatureGroup(
      response.data.features,
      featureGroup,
      MapPointDialogComponent,
      this.dialog,
      () => {
        //  console.log('dialog', this.dialog)
        if (this.bigScreenService.isFullscreen()) {
         
          this.bigScreenService.exit();
        }
      }
    );
  }

  private evaluateAlternativeFeatureGroup() {
    let featureGroup;
    let featureGroupAlt;

    if (this.isAlternative) {
      featureGroup = this.featureGroupPolledFeaturesAlt;
      featureGroupAlt = this.featureGroupPolledFeatures;
    } else {
      featureGroup = this.featureGroupPolledFeatures;
      featureGroupAlt = this.featureGroupPolledFeaturesAlt;
    }

    this.isAlternative = !this.isAlternative;

    return { featureGroup, featureGroupAlt };
  }

  private startPolling() {
 

    this.subscriptionPolling = this.pollService
      .startPolling('refresh')
      .subscribe(
        (event) => {
          if (event === 'refresh') {

            this.fetchPolledFeatures();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private stopPolling() {
    // TODO
  }

  private isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}
