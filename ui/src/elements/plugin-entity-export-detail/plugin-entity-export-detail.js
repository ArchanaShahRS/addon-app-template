import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';
import { AppInstanceManager } from '@riversandtechnologies/ui-platform-elements/lib/managers/app-instance-manager.js';

class PluginEntityExportDetail extends PolymerElement {
    static get is() {
        return 'plugin-entity-export-detail';
    }
    constructor() {
        super();
        this._loadExportDetail();
    }
    static get template() {
        return html`
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css" />

            <style>
                .dialogTitle {
                    --primary-color: [stylecolor];
                }
            </style>
            <div>
                <div>
                    <br />
                    <label>Last Published:</label> [[lastexportdate]]

                    <br />
                    <label>File Name:</label>
                    [[fileName]]
                </div>
                <br /><br />
                <div>
                    <pebble-button
                        class="btn-success"
                        id="btnClick"
                        button-text="Show Task Detail"
                        large-text
                        no-link="false"
                        on-tap="_redirectTo"
                        disabled="{{disabledProperty}}"
                    ></pebble-button>
                </div>
            </div>
            <br />
        `;
    }

    _redirectTo() {
        let appName = 'task-detail';
        let queryParam = { id: this.taskID };
        AppInstanceManager.navigateToRoute(appName, queryParam);
    }

    _loadExportDetail() {
        let currentinstance = this;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const entityid = urlParams.get('id');

        let res;
        //Get all Users using API
        let xhttp = new XMLHttpRequest();
        // Converting JSON data to string
        let reqbody = JSON.stringify({
            params: {
                query: {
                    filters: {
                        typesCriterion: ['externalevent'],
                        attributesCriterion: [
                            {
                                exportEntityList: {
                                    contains: entityid
                                }
                            },
                            {
                                eventSubType: {
                                    exact: 'REPORTING'
                                }
                            },
                            {
                                profileName: {
                                    exact: currentinstance.profilename
                                }
                            }
                        ]
                    }
                },
                fields: {
                    attributes: ['_ALL']
                }
            }
        });

        xhttp.onreadystatechange = async function () {
            if (this.readyState == 4 && this.status == 200) {
                //JSON response parsing
                res = JSON.parse(this.responseText);
                let objEvents = res['response']['events'];

                //Loop through users and add in items array
                for (let i in objEvents) {
                    currentinstance.taskID = objEvents[i].data.attributes.taskId.values[0].value;
                    currentinstance.lastexportdate = objEvents[i].properties.modifiedDate;
                    await currentinstance._getFileName();
                    currentinstance.disabledProperty = false;
                }
            }
        };

        xhttp.open('POST', 'https://sepik01.riversand.com/api/eventservice/get', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.setRequestHeader('x-rdp-version', '8.1');
        xhttp.setRequestHeader('x-rdp-tenantId', 'sepik01');
        xhttp.setRequestHeader('x-rdp-userId', 'archana.shah@riversand.com');
        xhttp.setRequestHeader('x-rdp-clientId', 'rdpclient');
        xhttp.setRequestHeader('x-rdp-tenantId', 'sepik01');
        xhttp.setRequestHeader('auth-client-id', 'G4uOqlaNHpjS620YzvEkHEo2U1x30Pjh');
        xhttp.setRequestHeader(
            'auth-client-secret',
            '3G2SLyB6jjQIAlZKW4mbWmibQ_5FYNhztDEk6j4Cw_RnUTY2CFvCGgCT4siHYnQo'
        );
        xhttp.send(reqbody);
    }

    async _getFileName() {
        let currentinstance = this;
        let res;
        //Get all Users using API
        let xhttp = new XMLHttpRequest();
        // Converting JSON data to string
        let reqbody = JSON.stringify({
            params: {
                query: {
                    id: currentinstance.taskID,
                    filters: {
                        typesCriterion: ['tasksummaryobject']
                    }
                },
                fields: {
                    attributes: ['fileName']
                },
                options: {
                    maxRecords: 1
                }
            }
        });

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //JSON response parsing
                res = JSON.parse(this.responseText);
                let objReqObj = res['response']['requestObjects'];

                //Loop through users and add in items array
                for (let i in objReqObj) {
                    currentinstance.fileName = objReqObj[i].data.attributes.fileName.values[0].value;
                }
            }
        };

        xhttp.open('POST', 'https://sepik01.riversand.com/api/requesttrackingservice/get', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.setRequestHeader('x-rdp-version', '8.1');
        xhttp.setRequestHeader('x-rdp-tenantId', 'sepik01');
        xhttp.setRequestHeader('x-rdp-userId', 'archana.shah@riversand.com');
        xhttp.setRequestHeader('x-rdp-clientId', 'rdpclient');
        xhttp.setRequestHeader('x-rdp-tenantId', 'sepik01');
        xhttp.setRequestHeader('auth-client-id', 'G4uOqlaNHpjS620YzvEkHEo2U1x30Pjh');
        xhttp.setRequestHeader(
            'auth-client-secret',
            '3G2SLyB6jjQIAlZKW4mbWmibQ_5FYNhztDEk6j4Cw_RnUTY2CFvCGgCT4siHYnQo'
        );
        xhttp.send(reqbody);
    }
    static get properties() {
        return {
            lastexportdate: {
                type: String,
                value: 'Pending Publish',
                reflectToAttribute: true
            },
            taskID: {
                type: String,
                reflectToAttribute: true
            },
            fileName: {
                type: String,
                reflectToAttribute: true
            },
            profilename: {
                type: String,
                value: 'EventHub_JSON_Export_Process'
            },
            stylecolor: {
                type: String,
                value: '#fff',
                notify: true,
                reflectToAttribute: true
            },
            disabledProperty: {
                type: String,
                value: true,
                reflectToAttribute: true
            }
        };
    }

    async connectedCallback() {
        super.connectedCallback();

        let configResponse = await ConfigurationManager.getConfig('plugin-entity-export-detail');

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
        this._loadExportDetail();
    }
    _handleConfigGetError(configResponse) {
        console.error('UI config get failed with error', configResponse);
    }
}
customElements.define(PluginEntityExportDetail.is, PluginEntityExportDetail);
