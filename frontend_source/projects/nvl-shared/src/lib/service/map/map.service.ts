import { ElementRef, Injectable } from '@angular/core';

import { AutoUnsubscribe } from '../../decorator/autounsubscribe.decorator';
import { MatDialog } from '@angular/material';
import { ScaleBar } from './scalebar';

declare let L;

type Callback = (map?: any) => void;

const COLOR_DEFAULT = '#c30b82';

const OPEN_STREET_MAPS_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OPEN_STREET_MAPS_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const OPEN_SEA_MAPS_LAYER = 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png';
const OPEN_SEA_MAPS_ATTRIBUTION = 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors';

const TIMEOUT = 0;

@AutoUnsubscribe()
@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  createMap(
    elementRef: ElementRef,
    callback: Callback
  ): void {
    callback(L.map(elementRef.nativeElement, {
      preferCanvas: true
    }).setView([44.12, 15.23], 8)); // Center to Zadar
  }

  createLayer(type: string) {
    switch (type) {
      case 'open-street-maps':
        return L.tileLayer(OPEN_STREET_MAPS_LAYER, { attribution: OPEN_STREET_MAPS_ATTRIBUTION });
      case 'open-sea-maps':
        return L.tileLayer(OPEN_SEA_MAPS_LAYER, { attribution: OPEN_SEA_MAPS_ATTRIBUTION });
      case 'scalebar':
        return ScaleBar.createControl();
      case 'scale':
        return L.control.scale();
      case 'graticule':
        return this.createGraticuleControl();
      default:
        throw new Error('invalid layer');
    }
  }

  invalidate(map) {
    setTimeout(() => { map.invalidateSize(); }, TIMEOUT);
  }

  addPolyLinesToFeatureGroup(features, featureGroup, color = COLOR_DEFAULT) {
    features.forEach(element => {
      const properties = element.properties;

      const polyline = properties != null || properties != undefined ?
        L.polyline(element.geometry.coordinates)
          .bindTooltip(properties.label, { permanent: false, direction: 'top' })
          .addTo(featureGroup)
        :
        L.polyline(element.geometry.coordinates)
          .addTo(featureGroup)

      const elementColor = (element.properties.color !== undefined && element.properties.color !== null)
        ? element.properties.color
        : COLOR_DEFAULT;

      polyline.setStyle({ fillColor: elementColor, color: elementColor });
    });
  }

  addMarkersToFeatureGroup(features, featureGroup, dialogComponent, dialog: MatDialog, callback: Callback) {
    features.forEach(element => {
      const properties = element.properties;
      const color = (element.properties.gprs_active === false) ? 'red' : 'green';
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class='marker-pin'></div><i class='material-icons' style='color:${color};font-size:48px;'>location_on</i>`,
        iconAnchor: [24, 44] // 24 44
      });

      L.marker(element.geometry.coordinates, { icon })
        .bindTooltip(properties.vehicle_name, { permanent: false, direction: 'right', offset: [12, -22] })
        .addTo(featureGroup)
        .on('click', this.eventHandler.bind(null, properties, dialogComponent, dialog, callback));
    });
  }

  private eventHandler(properties, dialogComponent, dialog: MatDialog, callback: Callback) {
    const dialogRef = dialog.open(dialogComponent, {
      disableClose: false,
      minWidth: '500px',
      data: { properties }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });

    callback();
  }

  addMarkerToFeatureGroup(feature, featureGroup, color = COLOR_DEFAULT) {
    const properties = feature.properties;
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class='marker-pin'></div><i class='material-icons' style='color:${this.detectColor(color, feature.properties)};font-size:32px;'>${properties.icon}</i>`,
      iconAnchor: [16, 30] // 24 44
    });

    L.marker(feature.geometry.coordinates, { icon })
      .bindTooltip(properties.label, { permanent: false, direction: 'right', offset: [8, -15] })
      .addTo(featureGroup);
  }

  addPolygonToFeatureGroup(feature, featureGroup, color = COLOR_DEFAULT) {
    const properties = feature.properties;
    const polygon =
      L.polygon(feature.geometry.coordinates)
        .bindTooltip(properties.label, { permanent: false, direction: 'top' })
        .addTo(featureGroup);
    const polygonColor = this.detectColor(color, feature.properties);

    polygon.setStyle({ fillColor: polygonColor, color: polygonColor });
  }

  addCircleToFeatureGroup(feature, featureGroup, color = COLOR_DEFAULT) {
    const properties = feature.properties;
    const circle =
      L.circle(feature.geometry.coordinates, { radius: properties.radius })
        .bindTooltip(properties.label, { permanent: false, direction: 'top' })
        .addTo(featureGroup);
    const circleColor = this.detectColor(color, feature.properties);

    circle.setStyle({ fillColor: circleColor, color: circleColor });
  }

  addLocations(features, featureGroup, color = COLOR_DEFAULT) {
    features.forEach(
      element => {
        if (element.geometry.type === 'Point' && element.properties.radius == null) {
          this.addMarkerToFeatureGroup(element, featureGroup, color);
        }

        if (element.geometry.type === 'Polygon') {
          this.addPolygonToFeatureGroup(element, featureGroup, color);
        }

        if (element.geometry.type === 'Point' && element.properties.radius != null) {
          this.addCircleToFeatureGroup(element, featureGroup, color);
        }

        if (element.geometry.type === 'LineString' && Array.isArray(element)) {
          this.addPolyLinesToFeatureGroup(element, featureGroup, color);
        } else  if (element.geometry.type === 'LineString') {
          this.addPolyLinesToFeatureGroup([element], featureGroup, color);
        }
      }
    );
  }

  fitBounds(map, renderedFeatures, maxZoom) {
    map.fitBounds(renderedFeatures.getBounds(), { maxZoom });
  }

  

  mapTypeToGeoJson(tag) {
    switch (tag) {
      case 'marker': return 'point';
      case 'polyline': return 'linestring';
      default: return tag;
    }
  }

  mapGeoJsonTypeToType(tag) {
    switch (tag) {
      case 'point': return 'marker';
      case 'linestring': return 'polyline';
      default: return tag;
    }
  }

  private createGraticuleControl() {
    return L.latlngGraticule({
      showLabel: true,
      zoomInterval: [
        { start: 2, end: 3, interval: 30 },
        { start: 4, end: 4, interval: 10 },
        { start: 5, end: 7, interval: 5 },
        { start: 8, end: 10, interval: 1 }
      ]
    });
  }

  private detectColor(color, properties) {
    if (color === COLOR_DEFAULT && properties.color !== null && properties.color !== undefined) {
      return properties.color;
    } else if (color === COLOR_DEFAULT) {
      return COLOR_DEFAULT;
    } else if (color !== COLOR_DEFAULT) {
      return color;
    }
  }

}
