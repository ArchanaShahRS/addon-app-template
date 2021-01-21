import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';

import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-lov/pebble-lov.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-popover/pebble-popover.js';

import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-combo-box/pebble-combo-box.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';

class PluginRecomputeModel extends PolymerElement {
    static get is() {
        return 'plugin-recompute-model';
    }
    constructor() {
        super();
        this._getAllUsers();
    }

    static get template() {
        return html`
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css" />

            <style>
                .dialogTitle {
                    --primary-color: [stylecolor];
                }
            </style>
            <div class="pull-right">
                <pebble-button
                    class="btn-success"
                    id="btnClick"
                    button-text="Recompute"
                    noink=""
                    large-text
                    on-tap="_recompute"
                ></pebble-button>

                <pebble-button
                    class="btn-success"
                    id="btnallClick"
                    button-text="Recompute All"
                    noink=""
                    large-text
                    on-tap="_recomputeall"
                ></pebble-button>
            </div>
            <!--
            <pebble-textbox  id="txtEmail" label="Enter User Email" value={{valuetxt}}>
            </pebble-textbox>

            <br>
            <b>Select User</b>

            <pebble-lov id="userlov" items={{items}} show-image no-sub-title on-selection-changed="_onListUpdate"></pebble-lov>
          
           -->
            <br />
            <br /><br />
            <pebble-combo-box id="multi-select-lov" on-click="_openDataList" items="{{items}}" on-selection-changed="_onListUpdate" multi-select label="Select User">
            </pebble-combo-box>


            <pebble-dialog id="sampleDialog" name="sampleDialog" small show-close-icon modal dialog-title="{{dialogTitle}}">
             {{dialogContent}}
            </pebble-dialog>
        `;
    }

    _openDataList() {
        this._getAllUsers();
        this.shadowRoot
            .querySelector('pebble-combo-box')
            .shadowRoot.querySelector('pebble-collection-container')
            .openPopover();
    }
    _onListUpdate() {
        let lov = this.shadowRoot.querySelector('#multi-select-lov');
        for (let v in lov.pebbleLov._selectedItemIds) {
            console.log(lov.pebbleLov._selectedItemIds[v]);
        }
    }
    _getAllUsers() {
        let res;
        //Get all Users using API
        let xhttp = new XMLHttpRequest();
        // Converting JSON data to string
        let reqbody = JSON.stringify({
            params: {
                query: {
                    filters: {
                        typesCriterion: ['user']
                    }
                }
            }
        });

        let currentinstance = this; //Setting All Error property blank to avoid old error messages
        currentinstance.varAllErrors = '';
        let tempArray = new Array();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //JSON response parsing
                res = JSON.parse(this.responseText);
                let objEntityModels = res['response']['entityModels'];

                //Loop through users and add in items array
                for (let i in objEntityModels) {
                    //value key is needed , to set selected value in text box on ui
                    tempArray.push({
                        id: objEntityModels[i].name,
                        title: objEntityModels[i].name,
                        name: objEntityModels[i].name,
                        value: objEntityModels[i].name,
                        subtitle: '',
                        image: ''
                    });
                }
                currentinstance.items = tempArray;
            }
        };

        xhttp.open('POST', 'https://sepik01.riversand.com/api/entitymodelservice/get', true);
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

    _recomputeall() {
        let currentinstance = this;
        for (let i in currentinstance.items) {
            console.log('Recompute ALL ' + i + ':' + currentinstance.items[i].title);
            currentinstance.recomputeAPI(currentinstance.items[i].title, 'false');
            console.log('all err' + currentinstance.varAllErrors);
        }
        if (currentinstance.varAllErrors != '') {
            currentinstance.dialogTitle = 'ERROR';
            currentinstance.dialogContent = currentinstance.varAllErrors;
            currentinstance.$.sampleDialog.open();
        } else {
            currentinstance.dialogTitle = 'SUUCESS';
            currentinstance.dialogContent = 'All Users recomputed successfully';
            currentinstance.$.sampleDialog.open();
        }
    }

    _recompute() {
        // let userlov=this.shadowRoot.querySelector('#userlov');
        //console.log(userlov.selectedItem.title);
        //this.recomputeAPI(userlov.selectedItem.title, "true");

        let lov = this.shadowRoot.querySelector('#multi-select-lov');
        for (let v in lov.pebbleLov._selectedItemIds) {
            let user = lov.pebbleLov._selectedItemIds[v];
            if (lov.multiSelect) {
                this.recomputeAPI(user, false);
            } else {
                this.recomputeAPI(user, true);
            }
        }

        this.dialogTitle = 'Success';
        this.dialogContent = 'Selected Users Recomputed Successfully';
        this.$.sampleDialog.open();
    }

    recomputeAPI(useremail, showpopup) {
        let res;
        let finalMSG = '',
            title = '';
        let url = 'https://sepik01.riversand.com/api/authorizationservice/computeauthorizationmodels';
        let reqbody = JSON.stringify({
            params: {
                userId: useremail + '_user'
            }
        });

        /* 
            if showpopup var is true then only show error or success popup ,
            this is done in order to reuse same method for recomputeall user where we will not show popup for each user recomputed
            inseated will show single popup at end
        */
        let xhttp = new XMLHttpRequest();
        // Converting JSON data to string
        let currentinstance = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //JSON response parsing
                res = JSON.parse(this.responseText);
                let ObjResponseDetail = res['response']['statusDetail'];
                let messageObj = ObjResponseDetail['messages'][0];
                title = res['response']['status'];
                finalMSG = messageObj['message'];
            }
            /* 
                if showpopup var is true then only show error or success popup ,
             this is done in order to reuse same method for recomputeall user where we will not show popup for each user recomputed
             inseated will show single popup at end
            */
            if (finalMSG != '' && showpopup == 'true') {
                currentinstance.dialogContent = finalMSG;
                currentinstance.dialogTitle = title.toUpperCase();
                // Try to change backgroup color of popup based on error or success
                if (title == 'error') {
                    currentinstance.stylecolor = '#ff0';
                    currentinstance.$.sampleDialog.style.color = '#ff0';
                } else if (title == 'success') {
                    currentinstance.stylecolor = '#0f0';
                }
                //Combining all Errors for user to pass on to RecomputeAll function
                if (title == 'error') {
                    currentinstance.varAllErrors = currentinstance.varAllErrors + '||' + finalMSG;
                }
                currentinstance.$.sampleDialog.open();
            }
        };

        xhttp.open('POST', url, true);
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
            valuetxt: {
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
            stylecolor: {
                type: String,
                value: '#fff',
                notify: true,
                reflectToAttribute: true
            },
            varAllErrors: {
                type: String,
                value: ''
            },

            items: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [];
                }
            }
        };
    }

    _openList() {
        let popover = this.shadowRoot.querySelector('#popover');
        popover.show();
    }
    async connectedCallback() {
        super.connectedCallback();

        let configResponse = await ConfigurationManager.getConfig('plugin-recompute-model');

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
customElements.define(PluginRecomputeModel.is, PluginRecomputeModel);
