import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';

import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-lov/pebble-lov.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-popover/pebble-popover.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';

class PluginWorkflowInvocationDeletionModel extends PolymerElement {
    static get is() {
        return 'plugin-workflow-invocation-deletion-model';
    }

    static get template() {
        return html`
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css" />
            <style>
            pebble-popover {
                --min-width-popover: 150px;
                --default-popup-t-p: 12px;
                --default-popup-b-p: 12px;
                --default-popup-r-p: 12px;
                --default-popup-l-p: 12px;
            }
        </style>
            
            <div class="pull-right">
                <pebble-button
                    class="btn-success"
                    id="btnClick"
                    button-text="Invoke Workflow"
                    noink=""
                    large-text
                    on-tap="_invokeworkflow"
                ></pebble-button>

                <pebble-button
                    class="btn-success"
                    id="btnallClick"
                    button-text="Delete Workflow"
                    noink=""
                    large-text
                    on-tap="_deleteworkflow"
                ></pebble-button>
            </div>

            <pebble-textbox id="txtEntityType" label="Enter Entity Type" value="{{valueEntityType}}"> </pebble-textbox>
            <pebble-textbox id="txtEntityId" label="Enter Entity Id" value="{{valueEntityId}}"> </pebble-textbox>
            <pebble-textbox id="txtWorkflowName" label="Enter Workflow Short Name" value="{{valueWorkflowName}}">
            </pebble-textbox>    
            Entity Types:
            <pebble-lov id="entitytypelov" items="{{entityTypes}}" show-image no-sub-title></pebble-lov>
          
            <pebble-dialog
                id="sampleDialog"
                name="sampleDialog"
                small
                show-close-icon
                modal
                dialog-title="{{dialogTitle}}"
            >
                {{dialogContent}}
            </pebble-dialog>
         
<!--
            <pebble-button id="button" button-text="Open lov" title="Open lov" class="dropdownText dropdownIcon btn dropdown-primary dropdown-trigger"  target-id="popover" on-tap="_openList"> 
            </pebble-button> 
            <pebble-popover id="popover" for="button" vertical-align="auto" horizontal-align="auto"> 
            <pebble-lov items="[[items]]" on-selection-changed="_onListUpdate"></pebble-lov>     
            </pebble-popover> 

          -->
        `;
    }

    constructor() {
        super();
        this.getEntityTypes();
    }
    _openList() { 
          let popover = this.shadowRoot.querySelector('#popover'); 
          popover.show(); 
        }
    _invokeworkflow() {
        this.WorkflowAPI(this.valueEntityType, this.valueEntityId, this.valueWorkflowName, 'startWorkflow');
    }
    _deleteworkflow() {
        this.WorkflowAPI(this.valueEntityType, this.valueEntityId, this.valueWorkflowName, 'deleteEntityFromWorkflow');
    }
    WorkflowAPI(entityType, entityID, workflowName, Action) {
        let res;
        let finalMSG = '',
            title = '';
        let xhttp = new XMLHttpRequest();
        // Converting JSON data to string
        let reqbody;
        if (Action == 'startWorkflow') {
            reqbody = JSON.stringify({
                params: {
                    workflow: {
                        workflowName: workflowName
                    }
                },
                entity: {
                    id: entityID,
                    type: entityType
                }
            });
        } else if (Action == 'deleteEntityFromWorkflow') {
            reqbody = JSON.stringify({
                params: {
                    workflowName: workflowName
                },
                entity: {
                    id: entityID,
                    type: entityType
                }
            });
        }
        console.log(reqbody);
        let currentinstance = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //JSON response parsing

                res = JSON.parse(this.responseText);
                let ObjResponseDetail = res['response']['statusDetail'];
                title = res['response']['status'];
                finalMSG = ObjResponseDetail['message'];
            }

            if (finalMSG != '') {
                currentinstance.dialogContent = finalMSG;
                currentinstance.dialogTitle = title.toUpperCase();
                currentinstance.$.sampleDialog.open();
            }
        };
        xhttp.open('POST', 'https://sepik01.riversand.com/api/entitygovernservice/' + Action, true);
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

    getEntityTypes() {
        let res;
        let xhttp = new XMLHttpRequest();
        // Converting JSON data to string
        let reqbody = JSON.stringify({
            params: {
                query: {
                    filters: {
                        typesCriterion: ['entityType'],
                        attributesCriterion: []
                    },
                    domain: 'thing',
                    valueContexts: [
                        {
                            source: 'internal',
                            locale: 'en-US'
                        },
                        {
                            locale: 'en-US',
                            source: 'internal'
                        }
                    ]
                },
                fields: {
                    attributes: ['externalName', 'entityTypeIcon']
                },
                options: {
                    from: 0,
                    to: 49
                },
                sort: {
                    properties: [
                        {
                            sortType: '_STRING',
                            externalName: '_ASC'
                        }
                    ]
                }
            },
            domain: 'baseModel',
            operation: 'initiatesearch'
        });

        let currentinstance = this;
        let tempArray = new Array();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //JSON response parsing
                res = JSON.parse(this.responseText);
                let ObjResponseDetail = res['response']['entityModels'];
                for (let i in ObjResponseDetail) {
                    /*
                    Here id is shortname of entity type and title is display name of entity type
                    Ex: id=stagingitem , title = "Vendor item"
                    */
                    let eachtype = ObjResponseDetail[i];
                    let name = eachtype.name;
                    let externalname = eachtype.data.attributes.externalName.values[0].value;
                    let entitypeObj = { id: name, title: externalname, subtitle: '', image: '' };
                    tempArray[i] = entitypeObj;

                    //UI it shows display name but in backend it takes shortname
                }
                currentinstance.entityTypes = tempArray;

                let entitytypelov = currentinstance.shadowRoot.querySelector('#entitytypelov');
                console.log(entitytypelov.selectedItem);
            }
        };
        xhttp.open('POST', 'https://sepik01.riversand.com/api/entityModelService/get', true);
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
            valueEntityType: {
                type: String,
                reflectToAttribute: true
            },
            valueEntityId: {
                type: String,
                reflectToAttribute: true
            },
            valueWorkflowName: {
                type: String,
                reflectToAttribute: true
            },
            dialogContent: {
                type: String,
                reflectToAttribute: true
            },
            dialogTitle: {
                type: String,
                reflectToAttribute: true
            },
            entityTypes: {
                type: Array,
                notify: true,
                value: function () {
                    return [
                        {
                            id: 'select',
                            title: 'Select type',
                            subtitle: 'H',
                            image: '/src/images/lookup-item.jpg'
                        }
                    ];
                },
                reflectToAttribute: true
            },
            items: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [
                        {
                            id: 1,
                            title: 'Hydrogen',
                            subtitle: 'H',
                            image: '/src/images/lookup-item.jpg'
                        },
                        {
                            id: 2,
                            title: 'Helium',
                            subtitle: 'He',
                            image: '/src/images/lookup-item.jpg'
                        }
                    ];
                }
            }
        };
    }

    async connectedCallback() {
        super.connectedCallback();

        let configResponse = await ConfigurationManager.getConfig('plugin-workflow-invocation-deletion-model');

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

customElements.define(PluginWorkflowInvocationDeletionModel.is, PluginWorkflowInvocationDeletionModel);
