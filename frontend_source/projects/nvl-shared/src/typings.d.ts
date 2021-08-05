import * as L from 'leaflet';
import 'leaflet-easybutton';
import 'leaflet-graticule';
declare module 'leaflet' {
  namespace control {
    function fullscreen(v: any);
  }
}
