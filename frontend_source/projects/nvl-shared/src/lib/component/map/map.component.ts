import { ElementRef, ViewChild } from '@angular/core';

import { BigScreenService } from 'angular-bigscreen';
import { MapService } from '../../service/map/map.service';

declare let L;

type Callback = (map?: any) => void;

export class MapComponent {
    @ViewChild('map', { static: null })
    elementRef: ElementRef;

    controls: { [key: string]: any; } = {};

    saveExecuted = false;

    map: any;

    constructor(
        protected bigScreenService: BigScreenService,
        protected mapService: MapService,
    ) {
    }

    addScalebarButton() {
        L.easyButton('<span"><i class="fas fa-ruler"></i></span">',
            () => this.addScalebarControl()).addTo(this.map);
    }

    addExpandButton() {
        L.easyButton('<span"><i class="fas fa-expand" style="margin-left:3px"></i></span">',
            () => this.expand()).addTo(this.map);
    }

    enableCoordinatesControl() {
        L.control
            .coordinates({
                position: 'topright',
                decimals: 4,
                decimalSeperator: '.',
                labelTemplateLat: 'Latitude: {y}',
                labelTemplateLng: 'Longitude: {x}',
                enableUserInput: true,
                useDMS: false,
                useLatLngOrder: true,
                markerType: L.marker,
                markerProps: {} // optional default {},
            })
            .addTo(this.map);
    }

    addLayers(tags: string[]) {
        tags.forEach(
            tag => this.controls[tag] = this.mapService.createLayer(tag).addTo(this.map)
        );
    }

    createMap() {
        this.mapService.createMap(this.elementRef, (map) => this.map = map);
    }

    setSaveExecuted() {
        this.saveExecuted = true;
    }

    setSaveExecutable() {
        this.saveExecuted = false;
    }

    private expand() {
        if (this.bigScreenService.isFullscreen()) {
            this.bigScreenService.exit();
        } else {
            this.bigScreenService.request(this.elementRef.nativeElement);
        }
    }

    private addScalebarControl() {
        if (this.controls.scalebar) {
            this.controls.scalebar.removeFrom(this.map);
            this.controls.scalebar = null;
        } else {
            this.controls.scalebar = this.mapService.createLayer('scalebar').addTo(this.map);
        }

    }

}
