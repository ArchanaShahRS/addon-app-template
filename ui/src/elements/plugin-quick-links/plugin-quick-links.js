import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-icon/pebble-icon.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-tag-item/pebble-tag-item.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';
import { AppInstanceManager } from '@riversandtechnologies/ui-platform-elements/lib/managers/app-instance-manager.js';

class PluginQuickLinks extends PolymerElement {
    static get is() {
        return 'plugin-quick-links';
    }
    constructor() {
        super();
    }
    static get template() {
        return html`
            <style>
               
                pebble-tag-item {
                    --tag-color: #d2d7dd;
                    margin:2px;                    
                }
                pebble-tag-item:hover{
                    cursor:pointer;
                }
                            
                .displayflexwrap{
                    display:flex;
                    flex-wrap: wrap;
                }
            </style>
            <div class="displayflexwrap">
                 <div>
                   <pebble-tag-item class="text-ellipsis" id="ex1" name="Last Week Entities" show-icon icon="pebble-icon:calender" on-click="_lastWeek"></pebble-tag-item>
                   
                 </div>
                 <div>
                 <pebble-tag-item id="ex2" name="Last Month Entities" show-icon  icon="pebble-icon:calender" on-click="_lastMonth"></pebble-tag-item>
               
                 </div>
                 <div>
                 <pebble-tag-item id="ex3" name="Last Quarter Entities" show-icon icon="pebble-icon:calender" on-click="_lastQuarter"></pebble-tag-item>
                 
                 </div>
                 <div>
                 <pebble-tag-item id="ex4" name="Recently Submitted Entities" show-icon icon="pebble-icon:calender" on-click="_recentlysubmitted"></pebble-tag-item>
                 
                 </div>
             </div>
        `;
    }

 
    _manageVisibility()
    {
        let ex4=this.shadowRoot.querySelector("#ex4");
        if(this.WorkflowDetail.visible)
        {
            ex4.style.display="block";
        }
        else{
            ex4.style.display="none";
        }

    }
    _createGuid() {
        return 'xxxxxxxxxxxx4xxxyx'.replace(/[xy]/g, function (c) {
            let r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    _lastWeek() {
        let endDate = new Date();
        let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        let sdate = startDate.toLocaleDateString('en-US');
        let edate = endDate.toLocaleDateString('en-US');
        this._searchInBetween(sdate, edate);
    }
    _lastMonth() {
        let endDate = new Date();
        let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
        let sdate = startDate.toLocaleDateString('en-US');
        let edate = endDate.toLocaleDateString('en-US');
        this._searchInBetween(sdate, edate);
    }

    _lastQuarter() {
        let endDate = new Date();
        let startDate = new Date(new Date().setDate(new Date().getDate() - 120));
        let sdate = startDate.toLocaleDateString('en-US');
        let edate = endDate.toLocaleDateString('en-US');
        this._searchInBetween(sdate, edate);
    }
    _recentlysubmitted()
    {
        let endDate = new Date();
        let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        let sdate = startDate.toLocaleDateString('en-US');
        let edate = endDate.toLocaleDateString('en-US');
        this._searchRecentInWF(sdate, edate);
    }
    _searchRecentInWF(startDate,endDate)
    {
        let queryParam = {
            attributes: {
                rsInternalGenericCreatedDate: startDate + ' - ' + endDate
            },
            wfName: this.WorkflowDetail.workflowshortname,
            wfShortName: this.WorkflowDetail.workflowshortname,
            wfActivityName: this.WorkflowDetail.workflowstepshortname,
            wfActivityExternalName: this.WorkflowDetail.workflowstepshortname,
            mappedEntityTypesString: this.WorkflowDetail.entityTypeshortname,
            mappedContextsString: [
                {
                    self: 'self'
                }
            ]
        };
        this._redirectTo('search-thing', queryParam);

    }
    _searchInBetween(startDate, endDate) {
        let queryParam = {
            attributes: {
                rsInternalGenericCreatedDate: startDate + ' - ' + endDate
            }
        };

        this._redirectTo('search-thing', queryParam);
    }

    _redirectTo(appName, queryParam) {
        let queryparam = { state: JSON.stringify(queryParam) };
        AppInstanceManager.navigateToRoute(appName, queryparam);
    }

    static get properties() {
        return {
         
            contextData: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onContextDataChange'
            },
            WorkflowDetail:{
                type: Object,
                value: function () {
                    return {
                        visible: false,
                        label: '',
                        workflowshortname: '',
                        workflowstepshortname: '',
                        entityTypeshortname: ''
                    };
                },
                reflectToAttribute: true
            }
        };
    }
    async connectedCallback() {
        super.connectedCallback();
        let configResponse = await ConfigurationManager.getConfig('plugin-quick-links',this.contextData);
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
            this._manageVisibility();
            }
        }
    }
    _handleConfigGetError(configResponse) {
        console.error('UI config get failed with error', configResponse);
    }
}
customElements.define(PluginQuickLinks.is, PluginQuickLinks);
