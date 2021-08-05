import 'leaflet/dist/images/marker-shadow.png';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { MatDialog, MatSelectionList } from '@angular/material';
import { Observable, Subscription } from 'rxjs';

import { ActionSliderDialogComponent } from '../../../component/action-slider-dialog/action-slider-dialog.component';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/public-api';
import { BigScreenService } from 'angular-bigscreen';
import { LocationModel } from '../location.model';
import { MapComponent } from 'projects/nvl-shared/src/lib/component/map/map.component';
import { MapService } from 'projects/nvl-shared/src/lib/service/map/map.service';
import { NotifierService } from 'angular-notifier';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

declare let L;

const TYPE_EDIT = 'EDIT';
const GEOGRAPHY_COLOR = '#FF8000';
const DROPDOWN_PATHS = environment.api.path.dropdown;
const API_PATHS = environment.api.path;

@AutoUnsubscribe()
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class LocationComponent extends MapComponent implements OnInit, OnDestroy {

  @ViewChild('shapes', { static: null })
  shapesRef: MatSelectionList;

  model: LocationModel;
  id: any;
  pageType: string;
  drawType: string;
  location;
  editableLayers;
  userId: number;

  geography = false;

  // * dropdowns
  modulesList$: Observable<any>;
  actionsList$: Observable<any>;
  users$: Observable<any>;

  loader;

  // TODO fetch icons from backend
  iconList$ = [
    { name: 'home' },
    { name: 'airport_shuttle' },
    { name: 'time_to_leave' },
    { name: 'directions_boat' },
    { name: 'flight' },
    { name: 'warning' },
    { name: 'fiber_manual_record' },
    { name: 'location_on' }
  ];

  defaultDraw = {
    circle: true,
    circlemarker: false,
    marker: true,
    polygon: true,
    polyline: true,
    rectangle: false
  };

  featureGroupGeography;
  subscriptionGeographyFeatures: Subscription;

  translate = (tag: string) => this.translateService.instant(tag);

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private restClientService: RestClientService,
    protected mapService: MapService,
    protected bigScreenService: BigScreenService,
    protected router: Router,
    protected notifierService: NotifierService,
    protected translateService: TranslateService,
  ) {
    super(bigScreenService, mapService);
  }

  ngOnInit() {
    this.loader = false;
    this.id = this.activatedRoute
      .snapshot
      .params
      .id;

    this.model = new LocationModel();

    this.modulesList$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.hw_module);
    this.actionsList$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.hw_action, '?type=geo_service');
    this.users$ = this.restClientService.get(DROPDOWN_PATHS.user_management);

    this.checkTypeAndInit();
    this.fetchGeography();
  }

  /**
   * Open dialog with slider for actions.
   * @param event ng select data
   */
  openActionSliderDialog(event) {
    const dialogRef = this.dialog.open(ActionSliderDialogComponent, {
      disableClose: true,
      width: '450px',
      data: { action: event }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Save data.
   */
  save() {
    this.setSaveExecuted();
    if (this.pageType === TYPE_EDIT) {
      this.put();
    } else {
      this.post();
    }
  }

  /**
   * Cancel creation of new location.
   * Returns to locations overview.
   */
  cancel() {
    this.router.navigate(['locations']);
  }

  /**
   * Check usage type of location component.
   * Same component is used for EDIT and ADD.
   * Init accordingly.
   */
  private checkTypeAndInit() {
    this.activatedRoute
      .data
      .subscribe(data => {
        this.pageType = data.type;

        if (this.pageType === TYPE_EDIT) {
          this.prepareForEdit();
        }

        this.init();
      });
  }

  /**
   * Save Location data.
   * POST request to backend.
   * Creates new location.
   */
  private post() {
    this.restClientService.post(API_PATHS.locations, this.model)
      .subscribe(
        response => {
          if (response.success) {
            this.router.navigate(['locations']);
            this.notifierService.notify('success', this.translate('save-success'));
          } else {
            this.notifierService.notify('error', response.message);
            this.setSaveExecutable();
          }
        }
      );
  }

  /**
   * Save Location data.
   * PUT request to backend.
   * Edit location.
   */
  private put() {
    this.restClientService.put(`${API_PATHS.locations}/${this.id}`, this.model)
      .subscribe(
        response => {
          if (response.success) {
            this.router.navigate(['locations']);
            this.notifierService.notify('success', this.translate('save-success'));
          } else {
            this.notifierService.notify('error', response.message);
            this.setSaveExecutable();
          }
        }
      );
  }

  /**
   * Init map for drawing and presentation.
   */
  private init() {
    this.createMap();
    this.addLayers(
      [
        'open-street-maps',
        'open-sea-maps',
        'graticule',
        'scalebar'
      ]
    );
    this.addEditableLayers();
    this.addDrawControl();
    this.assignDrawActions();
    this.enableCoordinatesControl();
    this.addScalebarButton();
    this.addExpandButton();

    this.mapService.invalidate(this.map);
  }

  private addEditableLayers() {
    this.editableLayers = new L.FeatureGroup();
    this.map.addLayer(this.editableLayers);
  }

  /**
   * Assign actions for Leaflet Draw.
   */
  private assignDrawActions() {
    this.assignDrawCreatedAction();
    this.assignDrawDeletedAction();
  }

  private assignDrawDeletedAction() {
    this.map.on('draw:deleted', event => {
      this.model.location_type_id = undefined;
      this.model.radius = undefined;
      this.model.coordinates = undefined;
    });
  }

  private assignDrawCreatedAction() {
    this.map.on('draw:created',
      event => {
        this.map.removeLayer(this.editableLayers);
        this.editableLayers._layers = {};
        this.map.addLayer(this.editableLayers);
        this.editableLayers.addLayer(event.layer);
        this.mapLocationDrawing(event);
      }
    );
  }

  /**
   * Add Leaflet Draw control to top left corner of map.
   */
  private addDrawControl() {
    const drawPluginOptions = {
      position: 'topleft',
      draw: {
        ...this.defaultDraw,
      },
      edit: {
        featureGroup: this.editableLayers,
        remove: true,
        edit: false
      }
    };

    this.map.addControl(new L.Control.Draw(drawPluginOptions));
  }

  /**
   * Map Leaflet Draw location to geoJson..
   * @param event drawing event
   */
  private mapLocationDrawing(event) {
    this.drawType = event.layerType;
    this.model.action = [];
    this.model.location_type = this.mapService.mapTypeToGeoJson(event.layerType);
    this.model.radius = event.layer._radius;

    if (event.layerType === 'polygon') {
      this.model.coordinates = event.layer._latlngs[0];
    } else if (event.layerType === 'marker') {
      this.model.coordinates = [];
      this.model.coordinates.push(event.layer._latlng);
    } else if (event.layerType === 'circle') {
      this.model.radius = event.layer._mRadius;
      this.model.coordinates = [];
      this.model.coordinates.push(event.layer._latlng);
    } else {
      this.model.coordinates = event.layer._latlngs;
    }
  }

  /**
   * Init data for editing.
   */
  private prepareForEdit() {
    this.loader = true;
    this.restClientService.get(`${API_PATHS.locations}/${this.id}`)
      .subscribe(
        response => {
          const coordinates = response.data.coordinates;
          const type = this.mapService.mapGeoJsonTypeToType(response.data.location_type);
          const radius = response.data.radius;

          this.drawType = type;

          this.model.location_type = response.data.location_type;
          this.model.radius = radius;
          this.model.name = response.data.name;
          this.model.color = response.data.color;
          this.model.date_from = response.data.date_from;
          this.model.date_to = response.data.date_to;
          this.model.label = response.data.label;
          this.model.icon = response.data.icon;
          this.model.modules = response.data.modules;
          this.model.active = response.data.active;
          this.model.end_zone = response.data.end_zone;
          this.model.show_on_map = response.data.show_on_map;
          this.model.coordinates = response.data.coordinates;
          this.model.action = response.data.action;

          this.drawShape(response.data.location_type, coordinates, radius);
          this.loader = false;
        }
      );
  }

  /**
   * Draw shape.
   * @param type shape type
   * @param coordinates shape coordinates
   * @param radius shape radius
   */
  private drawShape(type: any, coordinates: any, radius, httpGet = false) {
    let shape;

    switch (type.toLowerCase()) {
      case 'polygon':
        L.polygon(coordinates).addTo(this.editableLayers);
        break;
      case 'linestring':
        shape = L.polyline(coordinates).addTo(this.editableLayers);
        break;
      case 'point':
        L.marker(coordinates[0]).addTo(this.editableLayers);
        coordinates = [
          {
            lat: coordinates[0].lat,
            lng: coordinates[0].lng
          }
        ];
        break;
      case 'circle':
        shape = L.circle(coordinates[0], { radius }).addTo(this.editableLayers);
        coordinates = coordinates;
        break;

    }
    this.model.coordinates = coordinates;

    switch (type.toLowerCase()) {
      case 'polygon':
        this.fitBounds(coordinates);
        break;
      case 'linestring':
        this.fitBoundsShape(shape);
        break;
      case 'point':
        this.fitBounds(coordinates);
        break;
      case 'circle':
        this.fitBoundsShape(shape);
        break;
    }
  }

  /**
   * Fit map to bounds.
   */
  private fitBounds(coordinates: any) {
    const markerBounds = L.latLngBounds(coordinates);
    this.map.fitBounds(markerBounds);
  }

  private fitBoundsShape(shape) {
    this.map.fitBounds(shape.getBounds());
  }

  private fetchGeography(userId: number = null) {
    if (this.geography) {
      const path = userId === null ? API_PATHS.module_position.geography : `${API_PATHS.module_position.geography}/${userId}`;

      this.featureGroupGeography = L.featureGroup().addTo(this.map);
      this.subscriptionGeographyFeatures = this.restClientService.get(path)
        .subscribe(
          response => {
            this.mapService.addLocations(response.data.features, this.featureGroupGeography, GEOGRAPHY_COLOR);
          }
        );
    } else if (this.featureGroupGeography) {
      this.featureGroupGeography.clearLayers();
    }
  }

  ngOnDestroy() {
    // this.subscriptionGeographyFeatures.unsubscribe();
  }

  onUserSelectChange(event) {
    this.featureGroupGeography.clearLayers();
    this.fetchGeography(event);
  }

  add() {
    // * LEAVE EMPTY
  }

  geographyOnOff(event) {
    this.geography = event.checked;
    this.fetchGeography();
  }

}

