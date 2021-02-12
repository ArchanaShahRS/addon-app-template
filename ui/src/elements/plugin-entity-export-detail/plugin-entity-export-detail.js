import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-spinner/pebble-spinner.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';
import { AppInstanceManager } from '@riversandtechnologies/ui-platform-elements/lib/managers/app-instance-manager.js';
import { DataAccessManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/index.js';
import { DateTimeFormatUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/DateTimeFormatUtils.js';

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
        <style>
      
        .div-container {
            display: flex;
            flex-wrap: wrap;
            border: solid 1px #d2d7dd;
            border-radius: 3px;
            padding: 1%;
            position: relative;
            background: #fff;
           
            max-width: 100%;
            min-width: 20px;
            flex-direction: row;
            align-items: center;
            width: 95%;
        }
        </style>
        <pebble-spinner active=[[spinnerFlag]]></pebble-spinner>
        <dom-repeat items="{{exportdetails}}">
        <template>
            <div class="div-container">
                <div style="padding: 1%;     width: 65%;">
                   
                    <b>Last Published:</b> [[item.lastexportdate]]
                    <br />
                    <b>File Name:</b> [[item.fileName]]
                   
                </div>
               
                <div style="width: 30%;">
                    <pebble-button style="float:right;"
                        class="btn-success"
                        id="btnClick"
                        button-text="Show Task Detail"
                        large-text
                        no-link="false"
                        on-tap="_redirectTo"
                        data-args="{{item.taskID}}"
                        disabled="{{disabledProperty}}"
                    ></pebble-button>
                </div>
            </div>
            </template>
            </dom-repeat>
            <br />
        `;
    }

    _redirectTo(taskid) {
        let appName = 'task-detail';
        let queryParam = { id: taskid.currentTarget.dataArgs };
        AppInstanceManager.navigateToRoute(appName, queryParam);
    }
 
    async _loadExportDetail() {
        let currentinstance = this;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const entityid = urlParams.get('id');
        let requestData = {
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
        };


        let URL = "/data/pass-through/eventservice/get";
        let res = await this._sendRequestToURL(URL, requestData);
        let objEvents = res['response']['events'];
        let dataarr=new Array();
        for (let i in objEvents) 
        {
            if(i<this.displaytop)
            {
            //put a condition to display only last 5 and it should show from latest to old  so need to make for loop in reverse
            let taskID = objEvents[i].data.attributes.taskId.values[0].value;
            let val=objEvents[i].properties.modifiedDate;
            let lastexportdate = DateTimeFormatUtils.convertFromISODateTimeToClientFormat(val,"datetime");
          
            let filename= await currentinstance._getFileName(taskID);
            currentinstance.disabledProperty = false;
            dataarr.push({
                "lastexportdate":lastexportdate,
                "taskID":taskID,
                "fileName":filename
            });
          }
          else{
              break;
          }

        }
        if(objEvents!=undefined)
        {
            this.exportdetails=dataarr;
        }
        this.spinnerFlag=false;       
    }

    async _sendRequestToURL(URL, requestData) {
        let response = await DataAccessManager.rest(
            URL,
            requestData
        );
        return response;
    }
    async _getFileName(taskid) {
      
        let requestData = {
            params: {
                query: {
                    id: taskid,
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
        };
        let URL = "/data/pass-through/requesttrackingservice/get";
        let res = await this._sendRequestToURL(URL, requestData);
        let objReqObj = res['response']['requestObjects'];
        return objReqObj[0].data.attributes.fileName.values[0].value;
      
    }
    static get properties() {
        return {
            displaytop:{
                type:Number,
                value:2
            },
            exportdetails:{
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [
                        {
                            lastexportdate:"Pending Publish",
                            taskID:'',
                            fileName:''
                        }
                    ];
                },
            },
            spinnerFlag: {
                type: Boolean,
                value: true
            },
            lastexportdate: {
                type: String,
             
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
                reflectToAttribute: true
            },
          
            disabledProperty: {
                type: String,
                value: true,
                reflectToAttribute: true
            },
            contextData: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onContextDataChange'
            }
        };
    }

    async connectedCallback() {
        super.connectedCallback();
        let configResponse = await ConfigurationManager.getConfig('plugin-entity-export-detail',this.ContextData);
        if (
            ObjectUtils.isValidObjectPath(configResponse, 'response.status') &&
            configResponse.response.status == 'success'
        ) {
          
            this._handleConfigGetSuccess(configResponse);
            await this._loadExportDetail();
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
customElements.define(PluginEntityExportDetail.is, PluginEntityExportDetail);
