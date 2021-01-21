import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';


class PluginGoogleMap extends PolymerElement {
    static get is() {
        return 'plugin-google-map';
    }

    static get template() {
        return html`
        <h3>Google Map</h3></br>
        <pebble-button class="btn-success"
        id="btnClick"
        button-text="Load Map"
        noink=""
        large-text
        on-tap="loadMapScenario"></pebble-button> 
  
        <div id="map"></div>
      <!--  <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>-->
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA6viM699Pq0vGwhKyoKDAOMjqMWmaq45&libraries=&v=weekly"
          defer
        ></script>

        <google-map fit-to-markers api-key="AIzaSyD3E1D9b-Z7ekrT3tbhl_dy8DCXuIuDDRc">
  <google-map-marker latitude="37.78" longitude="-122.4" draggable="true"></google-map-marker>
</google-map>

            `;
    }

    loadMapScenario() {
        let map;
     
          map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          });
         
       /*     let map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
            // No need to set credentials if already passed in URL 
            center: new Microsoft.Maps.Location(29.7354, -95.52276)
        });
        let center = map.getCenter();
        let pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
        let infobox = new Microsoft.Maps.Infobox(center, {
            title: 'Map Center',
            description: 'Seattle',
            visible: false
        });
        infobox.setMap(map);
        Microsoft.Maps.Events.addHandler(pushpin, 'click', function () {
            infobox.setOptions({ visible: true });
        });
        map.entities.push(pushpin);*/
    }
    static get properties() {
        return {
            longitude: {
                type: String,
                value: ''
            },
            latitude: {
                type: String,
                value: ''
            }
        };
    }

    async connectedCallback() {
        super.connectedCallback();

        let configResponse = await ConfigurationManager.getConfig('plugin-google-map');

        if (
            ObjectUtils.isValidObjectPath(configResponse, 'response.status') &&
            configResponse.response.status == 'success'
        ) {
            this._handleConfigGetSuccess(configResponse);
        } else {
            this._handleConfigGetError(configResponse);
        }
    }

    _handleConfigGetSuccess(configResponse) {
        let res = configResponse.response.content;
        let compConfig = {};

        if (ObjectUtils.isValidObjectPath(res, 'configObjects.0.data.contexts.0.jsonData')) {
            compConfig = res.configObjects[0].data.contexts[0].jsonData;

            if (ObjectUtils.isEmpty(compConfig)) {
                console.error('UI config is empty', configResponse);
            } else {
                if (compConfig.config) {
                    let config = compConfig.config;

                    if (config.properties) {
                        for (let propKey in config.properties) {
                            this.set(propKey, config.properties[propKey]);
                        }
                    }
                }
            }
        }
    }

    _handleConfigGetError(configResponse) {
        console.error('UI config get failed with error', configResponse);
    }
}
customElements.define(PluginGoogleMap.is, PluginGoogleMap);
