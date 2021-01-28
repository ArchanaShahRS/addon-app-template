import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-datetime-picker/pebble-datetime-picker.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-icon/pebble-icon.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-lov/pebble-lov.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-graph-progress-ring/pebble-graph-progress-ring.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-spinner/pebble-spinner.js';
//import '@riversandtechnologies/ui-platform-elements/lib/flow/elements/pebble-progress-bar';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-graph-pie/pebble-graph-pie.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-combo-box/pebble-combo-box.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';
import { DataObjectManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/DataObjectManager.js';
import { AppInstanceManager } from '@riversandtechnologies/ui-platform-elements/lib/managers/app-instance-manager.js';
import { DataAccessManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/index.js';

class PluginMyCatalog extends PolymerElement {
    static get is() {
        return 'plugin-my-catalog';
    }

    static get template() {
        return html` 

        <style>
        .pointer {cursor: pointer;}
        .contextTreecustom {
           height: 82vh;
        }
        .avg-item-container {
            border: solid 1px #d2d7dd;
            border-radius: 3px;      
            padding:20px 160px 20px 160px;
            font-size: 14px;
            position: relative;
            background: #fff;
            margin: 10px;
            max-width: 100%;
            min-width:  20px;
            line-height: 20px;
            flex-direction: row;
            align-items: center;
        }
        .div-container {
            display:flex;
            border: solid 1px #d2d7dd;
            border-radius: 3px;      
            padding: 15px 15px 15px 15px;
            position: relative;
            background: #fff;
            margin: 4px;
            max-width: 100%;
            min-width:  20px;
            flex-direction: row;
            align-items: center;
        }
    
        .displayflexwrap{
                display:flex;
                flex-wrap: wrap;
            }
        .tag-item-container {
            border: solid 1px #d2d7dd;
            border-left: solid 4px #d2d7dd;
            border-radius: 3px;      
            padding: 0 15px 0px 5px;
            font-size: 12px;
            position: relative;
            background: #fff;
            margin: 4px;
            max-width: 100%;
            min-width:  20px;
            line-height: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    
        .div-table {
            display: table;         
            width: 100%;         
         
            }
            .div-table-row {
            display: table-row;
            width: auto;
            clear: both;
            }
            .div-table-col-80 {
            float: left; /* fix for  buggy browsers */
            display: table-column;         
            width: 78%;         
            }
            .div-table-col-70 {
                float: left; /* fix for  buggy browsers */
                display: table-column;         
                width: 69%;         
                }
         
            .div-table-col-right {
            float: left; /* fix for  buggy browsers */
            display: table-column;         
            width: 31%;         
            text-align:right;
            }
            .div-table-col-merge {
            float: left; /* fix for  buggy browsers */
            display: table-column;         
            width: 100%;         
            }
        </style>  
       
       
        <pebble-spinner active=[[spinnerFlag]]></pebble-spinner>
        <br>
        <div id="maindiv" style="display:none">
      
        <pebble-popover id="filterPopover" class\$="filter" for="" no-overlap="" vertical-align="auto" horizontal-align="auto" allow-multiple>
        
        <pebble-datetime-picker id="rangepicker" clear-selection\$={{clearSelection}} toggle-calendar\$={{toggleCalendar}} for="" picker-type="daterange" show-ranges="" heading-format="ddd, MMM DD YYYY" start-date-text="{{displaygte}}" end-date-text="{{displaylte}}" start-date-value="{{gte}}" end-date-value="{{lte}}" on-date-range-selected="_onUpdateValue" has-value-checked="false" has-value-toggle-enable="[[attributeValuesExistsSearchEnabled]]">
        </pebble-datetime-picker>
        
        <pebble-button class="focus btn btn-success" elevation="1" raised button-text="Select" on-tap="saveHandler"                    
        ></pebble-button>
        <pebble-button class="btn btn-secondary" elevation="1" raised button-text="Clear Selection" on-tap="clearHandler"                    
        ></pebble-button>

        </pebble-popover>
    
            <div>
              <pebble-dialog class="pebbleDialog" id= "myDialog" modal dialog-title="Select Taxonomy" scrollable>          
              <template is="dom-if" if="true">
                 <div class="caegory-selector contextTreecustom">
                  <rock-classification-selector
                        id="classificationTree"         
                        is-model-tree="[[isModelTree]]"
                        context-data="[[classificationContextData]]"
                        multi-select="[[multiSelect]]"
                        leaf-node-only="[[leafNodeOnly]]"
                        enable-node-click="true"
                        hide-leaf-node-checkbox="[[hideLeafNodeCheckbox]]"
                        root-node-data="{{_rootNodeData}}"
                        root-node="[[_rootNode]]"
                        path-entity-type="[[_rootEntityType]]"
                        path-relationship-name="[[_rootRelationshipName]]"
                        tags="{{tags}}"
                        selected-classifications = "{{preselectedClassifications}}">
                                    </rock-classification-selector>   
                </div>
                 <div class="buttons">
                <pebble-button dialog-confirm class="btn btn-success"  button-text="Save" on-tap ="_onSave"></pebble-button>
                <pebble-button dialog-confirm class="btn btn-secondary" button-text="Cancel" on-tap ="_onCancel"></pebble-button>
               </div>
                </template> 
                </pebble-dialog>
                <pebble-dialog  id= "myDialogCancel" modal dialog-title="Confirmation" scrollable style="width:fit-content">
                    <div style="text-align: center; padding: 13px;">
                    <label> Discard Changes? </label> <br><br>
                    
                    <pebble-button dialog-confirm class="btn btn-success"  button-text="Yes" on-tap ="_yesClick"></pebble-button>
                    <pebble-button dialog-confirm class="btn btn-secondary" button-text="No" on-tap ="_noClick"></pebble-button>
                    </div>
                </pebble-dialog>   
        
            
            </div>
    
<div class="div-table">
        <div class="div-table-row">
            
            <div class="div-table-col-70">
                <div class="displayflexwrap">
                    Taxonomy &nbsp;
                    <pebble-icon class="m-l-25 icon-size" title="Select Taxonomy" icon="pebble-icon:Open-window" on-tap="openDailogCategorySelector"></pebble-icon>
                    
                        <dom-repeat items="{{selectedTax}}">
                        <template>
                        <span class="tag-item-container border">{{item}}</span>
                        </template>
                        </dom-repeat>  
                </div>
             </div>

             <div class="div-table-col-right">
                <div style="display:flex" class="grid">
                    Select Date Range &nbsp;
                    <pebble-icon class="m-l-25 icon-size" title="Select Date Range" icon="pebble-icon:calender" on-tap="calendarClickHandler"></pebble-icon>
                    <span class="tag-item-container border">[[selectedDateRange]]</span>
                </div>
            </div>

         </div>

         <div class="div-table-row">
            <div class="div-class-col">
                <div id="refEntityDiv" class="displayflexwrap" >
                    <div class="tab-title" style="padding:8px"> [[referenceFilter.label]] </div>
                    <div style="width: 100%;max-width: 250px;">
                        <pebble-combo-box class="tab-title" id='multi-select-lov'selection-changed="_applyFilter" tag-removed="_applyFilter" on-click="_openDataList" items={{refentitydata}}  multi-select label="Select  [[referenceFilter.label]] "> </pebble-combo-box>
                    </div>
                </div>
            </div>
         </div>
        
        <div class="div-table-row">
          <div class="div-class-col">
                <div class="div-container">
                        <div class="avg-item-container">
                        <b>  Workflow Summary</b>
                        <pebble-graph-pie id="pie1" data="[[data]]" chart-style="[[pieChartStyle]]"> </pebble-graph-pie>
                        </div>
                        <div class="avg-item-container">    
                        <b>  Status Summary </b>
                        <pebble-graph-pie id="pie2" data="[[data2]]" chart-style="[[pieChartStyle]]"> </pebble-graph-pie>
                        </div>
                        <!--
                        <div class="displayflexwrap" flow-layout="grid gap:md">
                            <div  id="chart1" style="width:100px;" flow-layout="col:3">
                            <pebble-graph-progress-ring class="pointer" percentage="[[wfchart1percentage]]" _showPercentage="true"></pebble-graph-progress-ring>
                            <label>[[wfchart1.label]]</label>
                            </div>
                                   
                            <div class="pointer" id="chart2" style="width:100px;" flow-layout="col:3">
                            <pebble-graph-progress-ring percentage="[[wfchart2percentage]]" _showPercentage="true"></pebble-graph-progress-ring>
                            <label>[[wfchart2.label]]</label>
                            </div>
                                    
                            <div class="pointer" id="chart3" style="width:100px;" flow-layout="col:3">
                            <pebble-graph-progress-ring percentage="[[wfchart3percentage]]" _showPercentage="true"></pebble-graph-progress-ring>
                            <label>[[wfchart3.label]]</label>
                            </div>
                                    
                            <div class="pointer" id="chart4" style="width:100px;" flow-layout="col:3">
                            <pebble-graph-progress-ring percentage="[[wfchart4percentage]]" _showPercentage="true"></pebble-graph-progress-ring>
                            <label>[[wfchart4.label]]</label>
                            </div>
                        </div>
                        </div>
                        <div layout fullWidth>
                            <div  class="displayflexwrap" flow-layout="grid gap:md">
                                    <div  id="chart5" style="width:100px;" flow-layout="col:3">
                                    <pebble-graph-progress-ring percentage="[[createdchartpercentage]]" _showPercentage="true"></pebble-graph-progress-ring>
                                    <label>[[createdchart.label]]</label>
                                    </div>
                                
                                    <div id="chart6" style="width:100px;" flow-layout="col:3">
                                    <pebble-graph-progress-ring percentage="[[modifiedchartpercentage]]" _showPercentage="true"></pebble-graph-progress-ring>
                                    <label>[[modifiedchart.label]]</label>
                                    </div>
                                            
                                    <div id="chart7" style="width:100px;" flow-layout="col:3">
                                    <pebble-graph-progress-ring percentage="[[discontinuedchartpercentage]]" _showPercentage="true"></pebble-graph-progress-ring>
                                    <label>[[discontinuedchart.label]]</label>
                                    </div>
                                          
                                    <div  id="chart8" style="width:100px;" flow-layout="col:3">
                                    <pebble-graph-progress-ring percentage="[[publishedchartpercentage]]" _showPercentage="true"></pebble-graph-progress-ring>
                                    <label>[[publishedchart.label]]</label>
                                    </div>
                             </div>
                        </div>
                        -->
                </div>
            </div>
         </div>
</div>
        `;
    }

    async _applyFilter() {

        this.spinnerFlag = true;
        //getting selected filter value
        let lov = this.shadowRoot.querySelector('#multi-select-lov');
        let tempArray = new Array();
        if (lov.pebbleLov !== null) {
            for (let v in lov.pebbleLov.selectedItems) {
                let value = lov.pebbleLov.selectedItems[v].value;
                tempArray.push(value);
            }
            this.selectedFilters = tempArray;
        }

        //Not showing all blocks till data is calculated
        this.spinnerFlag = !(await this.loadCharts());
        /*
        let chart1 = this.shadowRoot.querySelector('#chart1');
        let chart2 = this.shadowRoot.querySelector('#chart2');
        let chart3 = this.shadowRoot.querySelector('#chart3');
        let chart4 = this.shadowRoot.querySelector('#chart4');
        let chart5 = this.shadowRoot.querySelector('#chart5');
        let chart6 = this.shadowRoot.querySelector('#chart6');
        let chart7 = this.shadowRoot.querySelector('#chart7');
        let chart8 = this.shadowRoot.querySelector('#chart8');

        //Hiding all charts
        chart1.style.display = 'none';
        chart2.style.display = 'none';
        chart3.style.display = 'none';
        chart4.style.display = 'none';
        chart5.style.display = 'none';
        chart6.style.display = 'none';
        chart7.style.display = 'none';
        chart8.style.display = 'none';

        if (!this.spinnerFlag) {
            if (this.wfchart1.visible) {
                chart1.style.display = 'block';
            }
            if (this.wfchart2.visible) {
                chart2.style.display = 'block';
            }
            if (this.wfchart3.visible) {
                chart3.style.display = 'block';
            }
            if (this.wfchart4.visible) {
                chart4.style.display = 'block';
            }
            if (this.createdchart.visible) {
                chart5.style.display = 'block';
            }
            if (this.modifiedchart.visible) {
                chart6.style.display = 'block';
            }
            if (this.discontinuedchart.visible) {
                chart7.style.display = 'block';
            }
            if (this.publishedchart.visible) {
                chart8.style.display = 'block';
            }
        }*/

    }

    /* Dialog box classification selector related methods */

    _onSave() {
        this.finalselectedClassifications = ObjectUtils.cloneObject(this.preselectedClassifications);
        this.persisttags = ObjectUtils.cloneObject(this.tags);
        this.persistSelectedClassificationText = ObjectUtils.cloneObject(this.selectedClassificationText);
        this.persistNewClassificationText = ObjectUtils.cloneObject(this.newClassificationText);
        // let contextTree = this.shadowRoot.querySelector('#classificationTree');
        // this.persistselectedItems=ObjectUtils.cloneObject(contextTree._selectedItems);
        // To use selected classification path in query
        let temparry = new Array();
        for (let t in this.tags) {
            temparry.push(this.tags[t].longName);
        }
        this.selectedTax = temparry;

        if(this.tags.length==0)
        {
            this.selectedTax.push("No Taxonomy Selected");
        }
        // this.treeItems = ObjectUtils.cloneObject(contextTree.selectedClassifications);
        this.shadowRoot.querySelector('#myDialog').close();

        this._applyFilter();
    }

    _onCancel() {
        this.shadowRoot.querySelector('#myDialog').open();
        this.shadowRoot.querySelector('#myDialogCancel').open();
    }

    _yesClick() {
        this.shadowRoot.querySelector('#myDialogCancel').close();
        this.shadowRoot.querySelector('#myDialog').close();

        //To show selected classifications next time , in case of discard changes event
        this.preselectedClassifications = ObjectUtils.cloneObject(this.finalselectedClassifications);
        this.tags = ObjectUtils.cloneObject(this.persisttags);
        this.selectedClassificationText = ObjectUtils.cloneObject(this.persistSelectedClassificationText);
        this.newClassificationText = ObjectUtils.cloneObject(this.persistNewClassificationText);
        // let contextTree = this.shadowRoot.querySelector('#classificationTree');
        // contextTree._selectedItems=ObjectUtils.cloneObject(this.persistselectedItems);
    }

    _noClick() {
        this.shadowRoot.querySelector('#myDialogCancel').close();
        this.shadowRoot.querySelector('#myDialog').open();
    }

    openDailogCategorySelector() {
        this.shadowRoot.querySelector('#myDialog').open();
        let contextTree = this.shadowRoot.querySelector('#classificationTree');

        if (this.preselectedClassifications.length == 0)
            contextTree.generateRequest();
    }

    /* calender methods*/

    calendarClickHandler() {
        let filterPopover = this.shadowRoot.querySelector('#filterPopover');
        filterPopover.open();
        let rangePicker = this.shadowRoot.querySelector('#rangepicker');
        rangePicker.openPicker();
    }
    saveHandler() {
        let filterPopover = this.shadowRoot.querySelector('#filterPopover');
        this.selectedDateRange = this.displaygte + " - " + this.displaylte;
        filterPopover.close();
        this._applyFilter();
    }

    clearHandler() {
        let filterPopover = this.shadowRoot.querySelector('#filterPopover');
        this.selectedDateRange = "No Date Selected";
        filterPopover.close();
        this._applyFilter();
    }
    _openPicker() {
        let rangePicker = this.shadowRoot.querySelector('#rangepicker');
        rangePicker.openPicker();
    }

    _openDataList() {
        this._getRefEntityData();
        this.shadowRoot
            .querySelector('pebble-combo-box')
            .shadowRoot.querySelector('pebble-collection-container')
            .openPopover();
    }

    async _getRefEntityModel() {
        let requestData = {
            params: {
                query: {
                    id: this.referenceFilter.referenceEntityShortname + '_entityManageModel',
                    filters: {
                        typesCriterion: ['entityManageModel']
                    }
                },
                fields: {
                    attributes: ['_ALL']
                }
            }
        };
        let res = await this._sendRequestToGetModel(requestData);
        let attributes = res.response.content.entityModels[0].data.attributes;
        for (let key in attributes) {
            if (attributes[key].properties.isEntityIdentifier == true) {
                this.referenceEntiytyIdentifier = key;
            }
            if (attributes[key].properties.isExternalName == true) {
                this.refereneceEntityExternalName = key;
            }
        }
        //attributes is not an array of object , its a simple json object with multiple key value pair

        await this._getRefEntityData();
    }
    async _getRefEntityData() {
        let requestData = {
            params: {
                query: {
                    valueContexts: [
                        {
                            source: 'internal',
                            locale: 'en-US'
                        }
                    ],
                    filters: {
                        typesCriterion: [this.referenceFilter.referenceEntityShortname]
                    }
                },
                fields: {
                    attributes: [this.referenceEntiytyIdentifier, this.refereneceEntityExternalName]
                }
            }
        };
        let res = await this._sendRequestToGetDetail(requestData);
        let tempArray = new Array();
        let objEntities = res.response.content.entities;

        //Loop through users and add in items array
        for (let i in objEntities) {
            tempArray.push({
                id: objEntities[i]['data']['attributes'][this.referenceEntiytyIdentifier]['values'][0]['value'],
                title: objEntities[i]['data']['attributes'][this.refereneceEntityExternalName]['values'][0]['value'],
                value: objEntities[i]['data']['attributes'][this.refereneceEntityExternalName]['values'][0]['value'],
                subtitle: '',
                image: ''
            });
        }
        this.refentitydata = tempArray;
    }


    _redirectTo(appName, queryParam) {
        let queryparam = { state: JSON.stringify(queryParam) };
        AppInstanceManager.navigateToRoute(appName, queryparam);
    }

    chart1Click(e) {
        //redirect with parameter
        let queryParam = {
            wfName: this.wfchart1.workflowshortname,
            wfShortName: this.wfchart1.workflowshortname,
            wfActivityName: this.wfchart1.workflowstepshortname,
            wfActivityExternalName: this.wfchart1.workflowstepshortname,
            mappedEntityTypesString: this.wfchart1.entityTypeshortname,
            mappedContextsString: [
                {
                    self: 'self'
                }
            ]
        };
        this._redirectTo('search-thing', queryParam);
    }
    chart2Click(e) {
        //redirect with parameter
        let queryParam = {
            wfName: this.wfchart2.workflowshortname,
            wfShortName: this.wfchart2.workflowshortname,
            wfActivityName: this.wfchart2.workflowstepshortname,
            wfActivityExternalName: this.wfchart2.workflowstepshortname,
            mappedEntityTypesString: this.wfchart2.entityTypeshortname,
            mappedContextsString: [
                {
                    self: 'self'
                }
            ]
        };
        this._redirectTo('search-thing', queryParam);
    }

    chart3Click(e) {
        //redirect with parameter
        let queryParam = {
            wfName: this.wfchart3.workflowshortname,
            wfShortName: this.wfchart3.workflowshortname,
            wfActivityName: this.wfchart3.workflowstepshortname,
            wfActivityExternalName: this.wfchart3.workflowstepshortname,
            mappedEntityTypesString: this.wfchart3.entityTypeshortname,
            mappedContextsString: [
                {
                    self: 'self'
                }
            ]
        };
        this._redirectTo('search-thing', queryParam);
    }
    chart4Click(e) {
        //redirect with parameter
        let queryParam = {
            wfName: this.wfchart4.workflowshortname,
            wfShortName: this.wfchart4.workflowshortname,
            wfActivityName: this.wfchart4.workflowstepshortname,
            wfActivityExternalName: this.wfchart4.workflowstepshortname,
            mappedEntityTypesString: this.wfchart4.entityTypeshortname,
            mappedContextsString: [
                {
                    self: 'self'
                }
            ]
        };
        this._redirectTo('search-thing', queryParam);
    }

    async _sendRequestToGetModel(requestData) {
        let entitySearchAndGetRequest = DataObjectManager.createRequest('searchandget', requestData, '', {
            dataIndex: 'entityModel'
        });
        let entitySearchAndGetResponse = await DataObjectManager.initiateRequest(entitySearchAndGetRequest);
        return entitySearchAndGetResponse;
    }
    async _sendRequestToGetCount(requestData) {
        let entitySearchAndGetRequest = DataObjectManager.createRequest('initiatesearchandgetcount', requestData, '', {
            dataIndex: 'entityData'
        });
        let entitySearchAndGetResponse = await DataObjectManager.initiateRequest(entitySearchAndGetRequest);
        return entitySearchAndGetResponse;
    }
    async _sendRequestToGetGovernCount(requestData) {
        let entitySearchAndGetRequest = DataObjectManager.createRequest('initiatesearchandgetcount', requestData, '', {
            dataIndex: 'entityGovernData'
        });
        let entitySearchAndGetResponse = await DataObjectManager.initiateRequest(entitySearchAndGetRequest);
        return entitySearchAndGetResponse;
    }
    async _sendRequestToGetDetail(requestData) {
        let initiateSearchRequest = DataObjectManager.createRequest('initiatesearch', requestData, undefined, {
            dataIndex: 'entityData'
        });
        let initiateSearchResponse = await DataObjectManager.initiateRequest(initiateSearchRequest);
        let requestId = initiateSearchResponse.response.content.requestId;
        let getSearchResultRequest = DataObjectManager.createRequest('getsearchresultdetail', requestData, requestId, {
            dataIndex: 'entityData'
        });
        let getSearchResultResponse = await DataObjectManager.initiateRequest(getSearchResultRequest);
        return getSearchResultResponse;
    }
    async _sendRequestToURL(URL, requestData) {
        let response = await DataAccessManager.rest(
            URL,
            requestData
        );
        return response;
    }

    async _getTotalEntities(entitytype) {
        let reqBody = {
            params: {
                query: {
                    contexts: [],
                    filters: {
                        typesCriterion: [entitytype]
                    }
                },
                options: {
                    maxRecords: 200
                }
            }
        };

        let res = await this._sendRequestToGetCount(reqBody);
        return res.response.content.totalRecords;
    }
    async _getEntitiesCountIn(wfname, entitytype, activityname) {
        /*
        let reqBody = {
            params: {
                query: {
                    contexts: [
                        {
                            self: 'self',
                            workflow: wfname
                        }
                    ],
                    filters: {
                        typesCriterion: [entitytype],
                        attributesCriterion: [
                            {
                                activities: {
                                    attributes: [
                                        {
                                            activityName: {
                                                eq: activityname
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                options: {
                    maxRecords: 200
                }
            }
        };

        let res = await this._sendRequestToGetGovernCount(reqBody);
        return res.response.content.totalRecords;*/

        let requestData = {
            "params": {
                "isCombinedQuerySearch": true,
                "options": {
                    "from": 0,
                    "to": 50
                }
            },
            "entity": {
                "id": "combinedGet",
                "name": "combinedGet",
                "type": "config",
                "data": {
                    "jsonData": {
                        "searchQueries": [
                            {
                                "serviceName": "entitygovernservice",
                                "action": "get",
                                "searchSequence": 1,
                                "searchQuery": {
                                    "query": {
                                        "contexts": [
                                            {
                                                "self": "self",
                                                "workflow": wfname
                                            }
                                        ],
                                        "filters": {
                                            "typesCriterion": [entitytype],
                                            "attributesCriterion": [
                                                {
                                                    "activities": {
                                                        "attributes": [
                                                            {
                                                                "activityName": {
                                                                    "eq": activityname
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                "serviceName": "entityservice",
                                "action": "get",
                                "searchSequence": 2,
                                "searchQuery": {
                                    "query": {
                                        "filters": {
                                            "typesCriterion": [entitytype],
                                            "attributesCriterion": [],
                                            "propertiesCriterion": []
                                        },
                                        "valueContexts": [
                                            {
                                                "source": "internal",
                                                "locale": "en-US"
                                            }
                                        ]
                                    },
                                    "options": {
                                        "maxRecords": 1
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            "domain": "thing",
            "operation": "initiatesearch"
        };
        //adding taxonomy filter if its selected
        if (this.selectedTax.length > 0 && this.selectedTax != "No Taxonomy Selected") {
            let taxObj = {
                [this.taxonomyAttrShortname]: {
                    "startswith": this.selectedTax,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            requestData.entity.data.jsonData.searchQueries[1].searchQuery.query.filters.attributesCriterion.push(taxObj);
        }
        //adding refattr filter if its selected
        if (this.selectedFilters.length > 0) {
            let filterObj = {
                [this.referenceFilter.referenceAttrShortname]: {
                    "startswith": this.selectedFilters,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            requestData.entity.data.jsonData.searchQueries[1].searchQuery.query.filters.attributesCriterion.push(filterObj);
        }

        //adding date criteria if date range is selected
        let rangePicker = this.shadowRoot.querySelector('#rangepicker');
        if (this.selectedDateRange != "No Date Selected") {
            let dateCriteria = {
                "createdDate": {
                    "gte": moment(this.gte).format(rangePicker._isoDateTimeFormat),
                    "lte": moment(this.lte).format(rangePicker._isoDateTimeFormat),
                    "type": "_DATETIME",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            requestData.entity.data.jsonData.searchQueries[1].searchQuery.query.filters.propertiesCriterion.push(dateCriteria);
        }

        let URL = "/data/pass-through/entityappservice/getcombined";
        let res = await this._sendRequestToURL(URL, requestData);
        return res.response.totalRecords;
    }

    async _getCreatedCount(entitytype, createdateattributename, modifieddateattributename) {
        //using [] brackets for using variable as key in json object
        let reqbody = {
            params: {
                query: {
                    filters: {
                        typesCriterion: [entitytype],
                        attributesCriterion: [
                            {
                                [createdateattributename]: {
                                    hasvalue: true,
                                    type: '_STRING',
                                    valueContexts: [
                                        {
                                            source: 'internal',
                                            locale: 'en-US'
                                        }
                                    ]
                                }
                            },
                            {
                                [modifieddateattributename]: {
                                    hasvalue: false,
                                    type: '_BOOLEAN',
                                    valueContexts: [
                                        {
                                            source: 'internal',
                                            locale: 'en-US'
                                        }
                                    ]
                                }
                            }
                        ],
                        propertiesCriterion: []
                    }
                },
                fields: {
                    attributes: ['_ALL']
                }
            }
        };

        //adding taxonomy filter if its selected
        if (this.selectedTax.length > 0 && this.selectedTax != "No Taxonomy Selected") {
            let taxObj = {
                [this.taxonomyAttrShortname]: {
                    "startswith": this.selectedTax,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.attributesCriterion.push(taxObj);
        }
        //adding refattr filter if its selected
        if (this.selectedFilters.length > 0) {
            let filterObj = {
                [this.referenceFilter.referenceAttrShortname]: {
                    "startswith": this.selectedFilters,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.attributesCriterion.push(filterObj);
        }

        //adding date criteria if date range is selected
        let rangePicker = this.shadowRoot.querySelector('#rangepicker');
        if (this.selectedDateRange != "No Date Selected") {
            let dateCriteria = {
                "createdDate": {
                    "gte": moment(this.gte).format(rangePicker._isoDateTimeFormat),
                    "lte": moment(this.lte).format(rangePicker._isoDateTimeFormat),
                    "type": "_DATETIME",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.propertiesCriterion.push(dateCriteria);
        }

        let res = await this._sendRequestToGetCount(reqbody);
        return res.response.content.totalRecords;
    }

    async _getModifiedCount(entitytype, modifieddateattributename, discontinueattrname, discontinueattrval) {
        //we need to check that its not discontinued but we can not check as we do not have not eq operator in query
        let reqbody = {
            params: {
                query: {
                    filters: {
                        typesCriterion: [entitytype],
                        attributesCriterion: [
                            {
                                [modifieddateattributename]: {
                                    hasvalue: true,
                                    type: '_BOOLEAN',
                                    valueContexts: [
                                        {
                                            source: 'internal',
                                            locale: 'en-US'
                                        }
                                    ]
                                }
                            }
                        ],
                        propertiesCriterion: []
                    }
                },
                fields: {
                    attributes: ['_ALL']
                }
            }
        };
        //adding taxonomy filter if its selected
        if (this.selectedTax.length > 0 && this.selectedTax != "No Taxonomy Selected") {
            let taxObj = {
                [this.taxonomyAttrShortname]: {
                    "startswith": this.selectedTax,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.attributesCriterion.push(taxObj);
        }
        //adding refattr filter if its selected
        if (this.selectedFilters.length > 0) {
            let filterObj = {
                [this.referenceFilter.referenceAttrShortname]: {
                    "startswith": this.selectedFilters,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.attributesCriterion.push(filterObj);
        }

        //adding date criteria if date range is selected
        let rangePicker = this.shadowRoot.querySelector('#rangepicker');
        if (this.selectedDateRange != "No Date Selected") {
            let dateCriteria = {
                "createdDate": {
                    "gte": moment(this.gte).format(rangePicker._isoDateTimeFormat),
                    "lte": moment(this.lte).format(rangePicker._isoDateTimeFormat),
                    "type": "_DATETIME",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.propertiesCriterion.push(dateCriteria);
        }
        let res = await this._sendRequestToGetCount(reqbody);
        return res.response.content.totalRecords;
    }

    async _getDiscontinuedCount(entitytype, discontinueattrname, discontinueattrval) {
        let reqbody = {
            params: {
                query: {
                    filters: {
                        typesCriterion: [entitytype],
                        attributesCriterion: [
                            {
                                [discontinueattrname]: {
                                    exact: discontinueattrval,
                                    type: '_STRING',
                                    valueContexts: [
                                        {
                                            source: 'internal',
                                            locale: 'en-US'
                                        }
                                    ]
                                }
                            }
                        ],
                        propertiesCriterion: []
                    }
                },
                fields: {
                    attributes: ['_ALL']
                }
            }
        };
        //adding taxonomy filter if its selected
        if (this.selectedTax.length > 0 && this.selectedTax != "No Taxonomy Selected") {
            let taxObj = {
                [this.taxonomyAttrShortname]: {
                    "startswith": this.selectedTax,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.attributesCriterion.push(taxObj);
        }
        //adding refattr filter if its selected
        if (this.selectedFilters.length > 0) {
            let filterObj = {
                [this.referenceFilter.referenceAttrShortname]: {
                    "startswith": this.selectedFilters,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.attributesCriterion.push(filterObj);
        }

        //adding date criteria if date range is selected
        let rangePicker = this.shadowRoot.querySelector('#rangepicker');
        if (this.selectedDateRange != "No Date Selected") {
            let dateCriteria = {
                "createdDate": {
                    "gte": moment(this.gte).format(rangePicker._isoDateTimeFormat),
                    "lte": moment(this.lte).format(rangePicker._isoDateTimeFormat),
                    "type": "_DATETIME",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.propertiesCriterion.push(dateCriteria);
        }
        let res = await this._sendRequestToGetCount(reqbody);
        return res.response.content.totalRecords;
    }

    async _getPublishedCount(entitytype, publishedattrname, publishedattrval) {
        let reqbody = {
            params: {
                query: {
                    filters: {
                        typesCriterion: [entitytype],
                        attributesCriterion: [
                            {
                                [publishedattrname]: {
                                    exact: publishedattrval,
                                    type: '_STRING',
                                    valueContexts: [
                                        {
                                            source: 'internal',
                                            locale: 'en-US'
                                        }
                                    ]
                                }
                            }
                        ],

                        propertiesCriterion: []
                    }
                },
                fields: {
                    attributes: ['_ALL']
                }
            }
        };
        //adding taxonomy filter if its selected
        if (this.selectedTax.length > 0 && this.selectedTax != "No Taxonomy Selected") {
            let taxObj = {
                [this.taxonomyAttrShortname]: {
                    "startswith": this.selectedTax,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.attributesCriterion.push(taxObj);
        }
        //adding refattr filter if its selected
        if (this.selectedFilters.length > 0) {
            let filterObj = {
                [this.referenceFilter.referenceAttrShortname]: {
                    "startswith": this.selectedFilters,
                    "operator": "_OR",
                    "type": "_STRING",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.attributesCriterion.push(filterObj);
        }

        //adding date criteria if date range is selected
        let rangePicker = this.shadowRoot.querySelector('#rangepicker');
        if (this.selectedDateRange != "No Date Selected") {
            let dateCriteria = {
                "createdDate": {
                    "gte": moment(this.gte).format(rangePicker._isoDateTimeFormat),
                    "lte": moment(this.lte).format(rangePicker._isoDateTimeFormat),
                    "type": "_DATETIME",
                    "valueContexts": [
                        {
                            "source": "internal",
                            "locale": "en-US"
                        }
                    ]
                }
            };
            reqbody.params.query.filters.propertiesCriterion.push(dateCriteria);
        }
        let res = await this._sendRequestToGetCount(reqbody);
        return res.response.content.totalRecords;
    }

    async loadCharts() {
        let chart1 = this.shadowRoot.querySelector('#chart1');
        let chart2 = this.shadowRoot.querySelector('#chart2');
        let chart3 = this.shadowRoot.querySelector('#chart3');
        let chart4 = this.shadowRoot.querySelector('#chart4');
        let chart5 = this.shadowRoot.querySelector('#chart5');
        let chart6 = this.shadowRoot.querySelector('#chart6');
        let chart7 = this.shadowRoot.querySelector('#chart7');
        let chart8 = this.shadowRoot.querySelector('#chart8');


        let ReferenceFilterDiv=this.shadowRoot.querySelector("#refEntityDiv");

        let workflowdata = new Array();

        if (this.wfchart1.visible) {
         //   chart1.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.wfchart1.entityTypeshortname);
            let count = await this._getEntitiesCountIn(
                this.wfchart1.workflowshortname,
                this.wfchart1.entityTypeshortname,
                this.wfchart1.workflowstepshortname
            );
            this.wfchart1percentage = (count * 100) / totalEntities;

            workflowdata.push({
                id: 1,
                key: this.wfchart1.workflowstepshortname,
                value: this.wfchart1percentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: this.wfchart1.label,
                color: '#F6D40C'
            });
        } else {
           // chart1.style.display = 'none';
        }

        if (this.wfchart2.visible) {
          //  chart2.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.wfchart2.entityTypeshortname);
            let count = await this._getEntitiesCountIn(
                this.wfchart2.workflowshortname,
                this.wfchart2.entityTypeshortname,
                this.wfchart2.workflowstepshortname
            );
            this.wfchart2percentage = (count * 100) / totalEntities;
            workflowdata.push({
                id: 2,
                key: this.wfchart2.workflowstepshortname,
                value: this.wfchart2percentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: this.wfchart2.label,
                color: '#36B44A'
            });
        } else {
          //  chart2.style.display = 'none';
        }

        if (this.wfchart3.visible) {
         //   chart3.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.wfchart3.entityTypeshortname);
            let count = await this._getEntitiesCountIn(
                this.wfchart3.workflowshortname,
                this.wfchart3.entityTypeshortname,
                this.wfchart3.workflowstepshortname
            );
            this.wfchart3percentage = (count * 100) / totalEntities;
            workflowdata.push({
                id: 3,
                key: this.wfchart3.workflowstepshortname,
                value: this.wfchart3percentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: this.wfchart3.label,
                color: '#EE204C'
            });
        } else {
         //   chart3.style.display = 'none';
        }

        if (this.wfchart4.visible) {
          //  chart4.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.wfchart4.entityTypeshortname);
            let count = await this._getEntitiesCountIn(
                this.wfchart4.workflowshortname,
                this.wfchart4.entityTypeshortname,
                this.wfchart4.workflowstepshortname
            );
            this.wfchart4percentage = (count * 100) / totalEntities;
            workflowdata.push({
                id: 4,
                key: this.wfchart4.workflowstepshortname,
                value: this.wfchart4percentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: this.wfchart4.label,
                color: '#129CE6'
            });
        } else {
         //   chart4.style.display = 'none';
        }

        let entitydata=new Array();
        if (this.createdchart.visible) {
          //  chart5.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.createdchart.entityTypeshortname);
            //passing modifieddate attribute name too as we need to check it has no value
            let count = await this._getCreatedCount(
                this.createdchart.entityTypeshortname,
                this.createdchart.attributeshortname,
                this.modifiedchart.attributeshortname
            );
            this.createdchartpercentage = (count * 100) / totalEntities;
            entitydata.push({
                id: 1,
                key: this.createdchart.label,
                value: this.createdchartpercentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label:this.createdchart.label,
                color: '#F78E1E'
            });
        } else {
          //  chart5.style.display = 'none';
        }

        if (this.modifiedchart.visible) {
         //   chart6.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.modifiedchart.entityTypeshortname);
            //passing discontinued attribute name too as we need to check entity is not discontinued
            let count = await this._getModifiedCount(
                this.modifiedchart.entityTypeshortname,
                this.modifiedchart.attributeshortname,
                this.discontinuedchart.attributeshortname,
                this.discontinuedchart.attributevalue
            );
            this.modifiedchartpercentage = (count * 100) / totalEntities;
            entitydata.push({
                id: 2,
                key: this.modifiedchart.label,
                value: this.modifiedchartpercentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label:this.modifiedchart.label,
                color: '#785DA8'
            });
        } else {
         //   chart6.style.display = 'none';
        }

        if (this.discontinuedchart.visible) {
          //  chart7.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.discontinuedchart.entityTypeshortname);
            let count = await this._getDiscontinuedCount(
                this.discontinuedchart.entityTypeshortname,
                this.discontinuedchart.attributeshortname,
                this.discontinuedchart.attributevalue
            );
            this.discontinuedchartpercentage = (count * 100) / totalEntities;
            entitydata.push({
                id: 3,
                key: this.discontinuedchart.label,
                value: this.discontinuedchartpercentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label:this.discontinuedchart.label,
                color: '#EE204C'
            });
        } else {
          //  chart7.style.display = 'none';
        }

        if (this.publishedchart.visible) {
          //  chart8.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.publishedchart.entityTypeshortname);
            let count = await this._getPublishedCount(
                this.publishedchart.entityTypeshortname,
                this.publishedchart.attributeshortname,
                this.publishedchart.attributevalue
            );
            this.publishedchartpercentage = (count * 100) / totalEntities;
            entitydata.push({
                id: 4,
                key: this.publishedchart.label,
                value: this.publishedchartpercentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label:this.publishedchart.label,
                color: '#36B44A'
            });
        } else {
         //   chart8.style.display = 'none';
        }

        if (this.referenceFilter.visible) {
            ReferenceFilterDiv.style.display = 'block';
           } else {
                ReferenceFilterDiv.style.display = 'none';
           }
        this.data = workflowdata;
        this.data2=entitydata;
        return true;
    }

    pie1Click(e) {
        //   alert(e.target._getSelectedSliceDetails(e));
    }

    static get properties() {
        return {
            displaygte: {
                type: String

            },
            displaylte: {
                type: String
            },
            gte: {
                type: String
            },
            lte: {
                type: String
            },
            selectedDateRange: {
                type: String,
                reflectToAttribute: true,
                value: 'No Date Selected'
            },

            pieChartStyle: {
                type: String,
                value: 'margin-top: -5px; margin-left: 60px; margin- bottom: 10px;'
            },

            data: {
                type: Array,
                value: function () {
                    return [
                      
                    ];
                },
                reflectToAttribute: true,
                observer: '_onDataChanged'
            },
            data2: {
                type: Array,
                value: function () {
                    return [
                      
                    ];
                },
                reflectToAttribute: true,
                observer: '_onDataChanged'
            },

            referenceEntiytyIdentifier: {
                type: String,
                reflectToAttribute: true
            },
            refereneceEntityExternalName: {
                type: String,
                reflectToAttribute: true
            },
            referenceFilter:{
                type: Object,
                value: function () {
                    return {
                        visible: false,
                        label: '',
                        referenceAttrShortname: '',
                        referenceEntityShortname: ''
                      
                    };
                },
                reflectToAttribute: true
            },

            taxonomyAttrShortname: {
                type: String,
                reflectToAttribute: true
            },
            refentitydata: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [];
                }
            },
            spinnerFlag: {
                type: Boolean,
                value: true
            },
            contextData: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onContextDataChange'
            },
            wfchart1: {
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
            },
            wfchart1percentage: {
                type: String,
                value: 0,
                reflectToAttribute: true
            },
            wfchart2: {
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
            },
            wfchart2percentage: {
                type: String,
                value: 0,
                reflectToAttribute: true
            },
            wfchart3: {
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
            },
            wfchart3percentage: {
                type: String,
                value: 0,
                reflectToAttribute: true
            },
            wfchart4: {
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
            },
            wfchart4percentage: {
                type: String,
                value: 0,
                reflectToAttribute: true
            },
            createdchart: {
                type: Object,
                value: function () {
                    return {
                        visible: false,
                        label: '',
                        entityTypeshortname: ''
                    };
                },
                reflectToAttribute: true
            },
            createdchartpercentage: {
                type: String,
                value: 0,
                reflectToAttribute: true
            },
            modifiedchart: {
                type: Object,
                value: function () {
                    return {
                        visible: false,
                        label: '',
                        entityTypeshortname: ''
                    };
                },
                reflectToAttribute: true
            },
            modifiedchartpercentage: {
                type: String,
                value: 0,
                reflectToAttribute: true
            },
            discontinuedchart: {
                type: Object,
                value: function () {
                    return {
                        visible: false,
                        label: '',
                        entityTypeshortname: '',
                        attributeshortname: '',
                        attributevalue: ''
                    };
                },
                reflectToAttribute: true
            },
            discontinuedchartpercentage: {
                type: String,
                value: 0,
                reflectToAttribute: true
            },
            publishedchart: {
                type: Object,
                value: function () {
                    return {
                        visible: false,
                        label: '',
                        entityTypeshortname: '',
                        attributevalue: ''
                    };
                },
                reflectToAttribute: true
            },
            publishedchartpercentage: {
                type: String,
                value: 0,
                reflectToAttribute: true
            },

            selectedTax: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [
                        "No Taxonomy Selected"
                    ];
                },
            },
            selectedFilters: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [];
                },
            },
            classificationContextData: {
                type: Object,
                value: function () {
                    return {};
                }

            },
            _rootNodeData: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },
            _rootNode: {
                type: String,
                value: 'productclassificationroot'
            },
            _rootEntityType: {
                type: String,
                value: 'classification'
            },
            _rootRelationshipName: {
                type: String,
                value: 'belongsTo'
            },
            hideLeafNodeCheckbox: {
                type: Boolean,
                value: false
            },
            leafNodeOnly: {
                type: Boolean,
                value: false
            },
            multiSelect: {
                type: Boolean,
                value: true
            },
            isModelTree: {
                type: Boolean,
                value: true
            },

            treeItems: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            persistselectedItems: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },
            persisttags: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },
            tags: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },
            finalselectedClassifications: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },
            preselectedClassifications: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },
            persistNewClassificationText: {
                type: String
            },
            persistSelectedClassificationText: {
                type: String
            }
        };
    }

    async connectedCallback() {
        super.connectedCallback();

        this.classificationContextData = ObjectUtils.cloneObject(this.contextData);
        this.classificationContextData.ValContexts = [
            {
                "source": "internal",
                "locale": "en-US"
            }
        ];
        this.classificationContextData["ItemContexts"] = [{ "id": "", "type": "", "name": "", "domain": {}, "permissionContext": { "readPermission": true, "writePermission": true }, "attributeNames": [""] }];

        let configResponse = await ConfigurationManager.getConfig('plugin-my-catalog', this.contextData);

        if (
            ObjectUtils.isValidObjectPath(configResponse, 'response.status') &&
            configResponse.response.status == 'success'
        ) {
            this._handleConfigGetSuccess(configResponse);
            this.spinnerFlag = !(await this.loadCharts());
            let maindiv = this.shadowRoot.querySelector('#maindiv');
            if (!this.spinnerFlag) {
                maindiv.style.display = 'block';

            }
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
                if(this.referenceFilter.visible)
                {
                this._getRefEntityModel();
                }
            }
        }
    }

    _handleConfigGetError(configResponse) {
        console.error('UI config get failed with error', configResponse);
    }

    ready() {
        super.ready();
      /*  this.$.chart1.addEventListener('click', e => {
            this.chart1Click(e);
        });
        this.$.chart2.addEventListener('click', e => {
            this.chart2Click(e);
        });
        this.$.chart3.addEventListener('click', e => {
            this.chart3Click(e);
        });
        this.$.chart4.addEventListener('click', e => {
            this.chart4Click(e);
        });
        this.$.chart5.addEventListener('click', e => {
            this.chart5Click(e);
        });
        this.$.chart6.addEventListener('click', e => {
            this.chart6Click(e);
        });
        this.$.chart7.addEventListener('click', e => {
            this.chart7Click(e);
        });
        this.$.chart8.addEventListener('click', e => {
            this.chart8Click(e);
        });
        //   this.$.pie1.addEventListener('click', e => {
        //     this.pie1Click(e);
        // });*/
        
    }
}

customElements.define(PluginMyCatalog.is, PluginMyCatalog);
