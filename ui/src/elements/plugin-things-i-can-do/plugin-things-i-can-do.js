import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-icon/pebble-icon.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';
import { AppInstanceManager } from '@riversandtechnologies/ui-platform-elements/lib/managers/app-instance-manager.js';

class PluginThingsICanDo extends PolymerElement {
    static get is() {
        return 'plugin-things-i-can-do';
    }
    constructor() {
        super();
    }
    static get template() {
        return html`
            <style>
            a{
                color: #364653;
                text-decoration: none;
                line-height: 16px;
                padding: 5px;
            }
              
            pebble-icon{
                height: 15px;
            }
            </style>

            <ul>
                <li id="upldexl">
                    <h4>
                        <pebble-icon title="Download/Upload Excel" icon="pebble-icon:download"></pebble-icon
                        ><a href="#" on-click="_uploadExcel">Download/Upload Data Template</a>
                    </h4>
                </li>
                <li id="upldasst">
                    <h4>
                        <pebble-icon title="Upload Asset" icon="pebble-icon:upload-asset"></pebble-icon>
                        <a href="#" on-click="_uploadAssets">Upload Assets</a>
                    </h4>
                </li>
                <li id="createnew">
                    <h4>
                        <pebble-icon title="Create New Entity" icon="pebble-icon:entities"></pebble-icon>
                        <a href="#" on-click="_createNewEntity">Create New Entity</a>
                    </h4>
                </li>
                <li id="upldthing">
                    <h4>
                        <pebble-icon
                            title="Download/Upload Attribute Data Model"
                            icon="pebble-icon:model-things-domain"
                        ></pebble-icon
                        ><a href="#" on-click="_uploadModel" data-args="1">Download/Upload Attribute Data Model</a>
                    </h4>
                </li>
                <li id="upldtaxonomy">
                    <h4>
                        <pebble-icon
                            title="Download/Upload Taxonomy Model"
                            icon="pebble-icon:dashboard-taxonomy"
                        ></pebble-icon
                        ><a href="#" on-click="_uploadModel" data-args="2">Download/Upload Taxonomy Model</a>
                    </h4>
                </li>
                <li id="upldref">
                    <h4>
                        <pebble-icon
                            title="Download/Upload Reference Model"
                            icon="pebble-icon:model-reference-data-domain"
                        ></pebble-icon
                        ><a href="#" on-click="_uploadModel" data-args="3">Download/Upload Reference Model</a>
                    </h4>
                </li>
                <li id="uplddigital">
                    <h4>
                        <pebble-icon
                            title="Download/Upload Digital Model"
                            icon="pebble-icon:asset-data-model"
                        ></pebble-icon
                        ><a href="#" on-click="_uploadModel" data-args="4">Download/Upload Digital Model</a>
                    </h4>
                </li>
                <li id="upldworkflow">
                    <h4>
                        <pebble-icon
                            title="Download/Upload Workflow Model"
                            icon="pebble-icon:dashboard-workflow"
                        ></pebble-icon
                        ><a href="#" on-click="_uploadModel" data-args="5">Download/Upload Workflow Model</a>
                    </h4>
                </li>
                <li id="upldgovernance">
                    <h4>
                        <pebble-icon
                            title="Download/Upload Governance Model"
                            icon="pebble-icon:dashboard-governance"
                        ></pebble-icon
                        ><a href="#" on-click="_uploadModel" data-args="6">Download/Upload Governance Model</a>
                    </h4>
                </li>
                <li id="upldcontext">
                    <h4>
                        <pebble-icon
                            title="Download/Upload Context Model"
                            icon="pebble-icon:dashboard-context"
                        ></pebble-icon
                        ><a href="#" on-click="_uploadModel" data-args="7">Download/Upload Context Model</a>
                    </h4>
                </li>
                <li id="upldauth">
                    <h4>
                        <pebble-icon
                            title="Download/Upload Auth Model"
                            icon="pebble-icon:dashboard-authorization"
                        ></pebble-icon
                        ><a href="#" on-click="_uploadModel" data-args="8">Download/Upload Auth Model</a>
                    </h4>
                </li>
            </ul>
        `;
    }

    _uploadModel(e) {
        let chk = e.target.getAttribute('data-args');
        let appName = '';

        switch (chk) {
            case '1':
                appName = 'basemodel-thing-dashboard';
                break;
            case '2':
                appName = 'taxonomymodel-dashboard';
                break;
            case '3':
                appName = 'basemodel-referencedata-dashboard';
                break;
            case '4':
                appName = 'basemodel-digitalasset-dashboard';
                break;
            case '5':
                appName = 'workflowmodel-dashboard';
                break;
            case '6':
                appName = 'govmodel-dashboard';
                break;
            case '7':
                appName = 'instancedatamodel-dashboard';
                break;
            case '8':
                appName = 'authmodel-dashboard';
                break;
            default:
                appName = '';
                break;
        }
        this._redirectTo(appName, null);
    }

    _setVisibility() {
        let upldexl = this.shadowRoot.querySelector('#upldexl');
        let upldasst = this.shadowRoot.querySelector('#upldasst');
        let createnew = this.shadowRoot.querySelector('#createnew');
        let upldthing = this.shadowRoot.querySelector('#upldthing');
        let upldtaxonomy = this.shadowRoot.querySelector('#upldtaxonomy');
        let upldgovernance = this.shadowRoot.querySelector('#upldgovernance');
        let upldref = this.shadowRoot.querySelector('#upldref');
        let uplddigital = this.shadowRoot.querySelector('#uplddigital');
        let upldworkflow = this.shadowRoot.querySelector('#upldworkflow');
        let upldauth = this.shadowRoot.querySelector('#upldauth');
        let upldcontext = this.shadowRoot.querySelector('#upldcontext');

        if (this.showUploadExcel == true) {
            upldexl.style.display = 'block';
        } else {
            upldexl.style.display = 'none';
        }

        if (this.showUploadAsset == true) {
            upldasst.style.display = 'block';
        } else {
            upldasst.style.display = 'none';
        }

        if (this.showCreateEntity == true) {
            createnew.style.display = 'block';
        } else {
            createnew.style.display = 'none';
        }

        if (this.showThingModelLink == true) {
            upldthing.style.display = 'block';
        } else {
            upldthing.style.display = 'none';
        }

        if (this.showDigitalModelLink == true) {
            uplddigital.style.display = 'block';
        } else {
            uplddigital.style.display = 'none';
        }

        if (this.showGovernanceModelLink == true) {
            upldgovernance.style.display = 'block';
        } else {
            upldgovernance.style.display = 'none';
        }

        if (this.showReferenceModelLink == true) {
            upldref.style.display = 'block';
        } else {
            upldref.style.display = 'none';
        }

        if (this.showAuthModelLink == true) {
            upldauth.style.display = 'block';
        } else {
            upldauth.style.display = 'none';
        }

        if (this.showTaxonomyModelLink == true) {
            upldtaxonomy.style.display = 'block';
        } else {
            upldtaxonomy.style.display = 'none';
        }

        if (this.showContextModelLink == true) {
            upldcontext.style.display = 'block';
        } else {
            upldcontext.style.display = 'none';
        }

        if (this.showWorkflowModelLink == true) {
            upldworkflow.style.display = 'block';
        } else {
            upldworkflow.style.display = 'none';
        }
    }

    _createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    _createNewEntity() {
        let appName = 'entity-create';
        let queryParam = { type: this.customEntityType };
        this._redirectTo(appName, queryParam);
    }
    _uploadExcel() {
        let appName = 'upload-excel';
        let queryParam = { type: this.customEntityType };
        this._redirectTo(appName, queryParam);
    }
    _uploadAssets() {
        let guid = this._createGuid();
        let appName = 'upload-assets';
        let queryParam = { uid: guid };
        this._redirectTo(appName, queryParam);
    }

    _redirectTo(appName, queryParam) {
        if (queryParam === null) {
            AppInstanceManager.navigateToRoute(appName);
        } else {
            let queryparam = { state: JSON.stringify(queryParam) };
            AppInstanceManager.navigateToRoute(appName, queryparam);
        }
    }
    static get properties() {
        return {
            customEntityType: {
                type: String,
                reflectToAttribute: true
            },
            showUploadExcel: {
                type: Boolean,
                reflectToAttribute: true,
                value: true
            },
            showUploadAsset: {
                type: Boolean,
                reflectToAttribute: true,
                value: true
            },
            showCreateEntity: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            },
            showThingModelLink: {
                type: Boolean,
                reflectToAttribute: true,
                value: true
            },
            showTaxonomyModelLink: {
                type: Boolean,
                reflectToAttribute: true,
                value: true
            },
            showReferenceModelLink: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            },
            showDigitalModelLink: {
                type: Boolean,
                reflectToAttribute: true,
                value: true
            },
            showWorkflowModelLink: {
                type: Boolean,
                reflectToAttribute: true,
                value: true
            },
            showGovernanceModelLink: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            },
            showContextModelLink: {
                type: Boolean,
                reflectToAttribute: true,
                value: true
            },
            showAuthModelLink: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
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
        //
        //here the role will come from rufelement
        let contextdata = {
            UserContexts: [
                {
                    roles: this.contextData.UserContexts[0].roles,
                    defaultRole: this.contextData.UserContexts[0].defaultRole
                }
            ]
        };
        let configResponse = await ConfigurationManager.getConfig('plugin-things-i-can-do', contextdata);
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
                this._setVisibility();
            }
        }
    }
    _handleConfigGetError(configResponse) {
        console.error('UI config get failed with error', configResponse);
    }
}
customElements.define(PluginThingsICanDo.is, PluginThingsICanDo);
