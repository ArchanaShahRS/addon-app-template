import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';
import '@polymer/paper-progress/paper-progress.js';
// ui-platform-elements

import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-icon/pebble-icon.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-lov/pebble-lov.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-graph-progress-ring/pebble-graph-progress-ring.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';
import { AppInstanceManager } from '@riversandtechnologies/ui-platform-elements/lib/managers/app-instance-manager.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';

import { DataAccessManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/index.js';

import { DataObjectManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/DataObjectManager.js';
import '@riversandtechnologies/ui-platform-business-elements/src/elements/rock-classification-selector/rock-classification-selector.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-combo-box/pebble-combo-box.js';

//import'@riversandtechnologies/ui-platform-elements/lib/flow/elements/pebble-progress-bar';

class PluginVendorScoreCard extends PolymerElement {
    static get is() {
        return 'plugin-vendor-score-card';
    }
    constructor() {
        super();
    }
    static get template() {
        return html`<style>
        .contextTreecustom {       
        height: 82vh;
        }
        .tag-item-container {
            border: solid 1px #d2d7dd;
            border-left: solid 4px #d2d7dd;
            border-radius: 3px;      
            padding: 0 15px 0px 5px;
            font-size: 12px;
            position: relative;
            background: #fff;
            margin: 0px 0px 4px 4px;
            max-width: 100%;
            min-width:  20px;
            line-height: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .avg-item-container {
            border: solid 1px #d2d7dd;
            border-radius: 3px;      
          
            margin: 10px 0px 0px 0px;
            max-width: 100%;
            min-width:  20px;
            align-items: center;
            width:100px;
        }
        .div-item-container:hover {
           cursor:pointer;
        }
      
        .displayflexwrap{
        display:flex;
        flex-wrap: wrap;
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
        width: 56%;         
        }
     
        .div-table-col-20 {
            float: left; /* fix for  buggy browsers */
            display: table-column;         
            width: 11%;         
            }
        .div-table-col-right {
            float: left;
            display: table-column;
            width: 44%;
            text-align: center;
           
        }
        
        .div-table-col-right-72 {
            float: left; /* fix for  buggy browsers */
            display: table-column;         
            width: 86%;         
            }
            .div-table-col-right-100 {
                float: right; /* fix for  buggy browsers */
                display: table-column;         
                width: 100%;         
                }
        .displayflexwrap{
            display:flex;
            flex-wrap: wrap;
        }
        .div-item-container {
            border: solid 1px #d2d7dd;
            border-radius: 3px;      
            padding: 0 5px 0px 5px;
            font-size: 12px;
            position: relative;
            background: #fff;
            margin: 10px 0px 12px 12px;
            max-width: 100%;
            min-width:  20px;
            line-height: 20px;
            flex-direction: row;
            align-items: center;
            }
            paper-progress{
                width: 100%;
                padding-right: 8px;
                --paper-progress-height:15px;
                --paper-progress-transition-duration: 0.08s;
                --paper-progress-transition-timing-function: ease;
                --paper-progress-transition-delay: 0s;
                --paper-progress-container-color: #d2d7dd;
                }
                .paper-progress-purple {
                    --paper-progress-active-color:#785DA8;
                    }
                    .paper-progress-red {
                        --paper-progress-active-color:#EE204C;
                        }
     </style>
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
        </template>
     </pebble-dialog>
     <pebble-dialog  id= "myDialogCancel" modal dialog-title="Confirmation" scrollable style="width:fit-content">
        <div style="text-align: center; padding: 13px;">
           <label> Discard Changes? </label> <br><br>
           <pebble-button dialog-confirm class="btn btn-success"  button-text="Yes" on-tap ="_yesClick"></pebble-button>
           <pebble-button dialog-confirm class="btn btn-secondary" button-text="No" on-tap ="_noClick"></pebble-button>
        </div>
     </pebble-dialog>
     <br>
     <pebble-spinner active=[[spinnerFlag]]></pebble-spinner>

     <div class="div-table">

        <div class="div-table-row">
            <div class="div-table-col-80">
                <div class="displayflexwrap">
                Taxonomy &nbsp;
                <pebble-icon class="m-l-25 icon-size" title="Select Taxonomy" icon="pebble-icon:Open-window" on-tap="openDailogCategorySelector"></pebble-icon>
                
                <dom-repeat items="{{selectedTax}}">
                    <template>
                        <span class="tag-item-container border">{{item}}</span>
                    </template>
                </dom-repeat>
                </div>
                </br>
            </div>
            <div class="div-table-col-right">
                    <div id="refEntityDiv">
                   
                    <pebble-combo-box class="tab-title" id='multi-select-lov' selection-changed="_applyFilter" tag-removed="_applyFilter" on-click="_openDataList" items={{refentitydata}}  multi-select label="Select Vendor"> </pebble-combo-box>
                    </div>         
            </div>
        </div>


        <div class="div-table-row">
        <div class="div-table-col-right-100">
              
        <pebble-button style="float:right"  class="btn btn-success" button-text="Apply" on-tap ="_applyFilter"></pebble-button>
        </div>
        </div>

        <div class="div-table-row">
            <div class="avg-item-container div-table-col-20">
              
                <pebble-graph-progress-ring  percentage="{{average}}" _showPercentage="true"></pebble-graph-progress-ring>
               
            </div>
            <div class="div-table-col-right-72">
                    <div id="entitiessubmitted" class="div-item-container">
                    Entities Submitted  <br>
                        <div class="displayflexwrap">
                      
                        <paper-progress class="paper-progress-purple" value=[[submittedPercent]]></paper-progress>
                        [[submittedPercent]]%
                        </div>
                   </div>
                   <div id="entitiesrejected" class="div-item-container"  on-click="_entititesRejectedDivClicked">
                   Entities Rejected <br>
                       <div class="displayflexwrap">
                      
                       <paper-progress class="paper-progress-red" value= [[rejectedPercent]]></paper-progress>
                       [[rejectedPercent]]%
                       </div>
                  </div>
             
             </div>
        </div>

     </div>
   
     `;
    }

 _entititesRejectedDivClicked()
  {
    let queryParam ;
    queryParam = {
       "attributes":{[this.rejectionScoreAttrshortame]:"1"},
       "entitytype":this.WorkflowDetail.entityTypeshortname
    };
 
    //If Vendor is available
    if(this.selectedFilters.length>0 && this.selectedFilters!=null)
    {
        let searchString="";
        for(let i=0;i<this.selectedFilters.length;i++)
        {
            searchString=searchString+"'"+this.selectedFilters[i] + "'";
             if(this.selectedFilters.length-(i+1)>0)
            {
                searchString=searchString+" or ";
            }
        }        

        queryParam.attributes[this.ownershipAttrShortname]=searchString;

    }
    if(this.selectedTax.length>0 && this.selectedTax!="No Taxonomy Selected")
    {
        let searchString="";
        for(let i=0;i<this.selectedTax.length;i++)
        {
            searchString=searchString+"'"+this.selectedTax[i] + "'";
             if(this.selectedTax.length-(i+1)>0)
            {
                searchString=searchString+" or ";
            }
        }        

 
        queryParam.attributes[this.taxonomyAttrShortname]=searchString;

    }
    this._redirectTo('search-thing', queryParam);

  }
    _redirectTo(appName, queryParam) {
        let queryparam = { state: JSON.stringify(queryParam) };
        AppInstanceManager.navigateToRoute(appName, queryparam);
    }

    async _calculateData() {
        this.totalSubmitted=0;
        this.totalRejected=0;
        if (this.selectedFilters.length > 0) {
            for (let x in this.selectedFilters) {
                let vendorentitites = await this._getTotalEntitiesByVendor(this.selectedFilters[x]);
                let entitiesintobesubmitted = await this._getTotalEntitiesByVendorInWFStep(this.selectedFilters[x]);
                let remainingentities = vendorentitites - entitiesintobesubmitted;
                let rejecttedentities = await this._getRejectedEntitiesScoreBasedCount(this.selectedFilters[x]);
                this.totalEntities+=vendorentitites;
                this.totalSubmitted = this.totalSubmitted + remainingentities;
                this.totalRejected = this.totalRejected + rejecttedentities;
            }
        } else {
            //This mean without any filters
            let vendorentitites = await this._getTotalEntitiesByVendor(null);
            let entitiesintobesubmitted = await this._getTotalEntitiesByVendorInWFStep(null);
            let remainingentities = vendorentitites - entitiesintobesubmitted;
            let rejecttedentities = await this._getRejectedEntitiesScoreBasedCount(null);
            this.totalEntities+=vendorentitites;
            this.totalSubmitted = this.totalSubmitted + remainingentities;
            this.totalRejected = this.totalRejected + rejecttedentities;
        }
        this.submittedPercent=((this.totalSubmitted*100)/this.totalEntities).toFixed(2);
        this.rejectedPercent=((this.totalRejected*100)/this.totalEntities).toFixed(2);
        this._getAvgQuality();

    }
    async _applyFilter() {
        this.spinnerFlag = true;
        //getting selected filter value
        let lov = this.shadowRoot.querySelector('#multi-select-lov');
        let tempArray = new Array();
        if (lov.pebbleLov !== null) {
            /*  for (let v in lov.selectedIds) {
                  let value = lov.selectedIds[v];
                  if(value!=undefined)
                  tempArray.push(value);
              }*/
            for (let v in lov.pebbleLov.selectedItems) {
                let value = lov.pebbleLov.selectedItems[v].subtitle;
                if (value != undefined)
                    tempArray.push(value);
            }
            this.selectedFilters = tempArray;
        }
        await this._calculateData();
        this.spinnerFlag = false;



    }
    _onSave() {


        this.finalselectedClassifications = ObjectUtils.cloneObject(this.preselectedClassifications);
        this.persisttags = ObjectUtils.cloneObject(this.tags);
        this.persistSelectedClassificationText = ObjectUtils.cloneObject(this.selectedClassificationText);
        this.persistNewClassificationText = ObjectUtils.cloneObject(this.newClassificationText);

        //     let contextTree = this.shadowRoot.querySelector('#classificationTree');
        //   this.persistselectedItems=ObjectUtils.cloneObject(contextTree._selectedItems);

        //To use selected classification path in query
        let temparry = new Array();
        for (let t in this.tags) {
            temparry.push(this.tags[t].longName);
        }
        this.selectedTax = temparry;

        if (this.tags.length == 0) {
            this.selectedTax[0] = "No Taxonomy Selected";
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
        //   contextTree._selectedItems=ObjectUtils.cloneObject(this.persistselectedItems);

    }

    _noClick() {
        this.shadowRoot.querySelector('#myDialogCancel').close();
        this.shadowRoot.querySelector('#myDialog').open();

    }

    _openDataList() {
        this._getVendors();
        this.shadowRoot
            .querySelector('pebble-combo-box')
            .shadowRoot.querySelector('pebble-collection-container')
            .openPopover();
    }

    openDailogCategorySelector() {

        this.shadowRoot.querySelector('#myDialog').open();
        let contextTree = this.shadowRoot.querySelector('#classificationTree');

        if (this.preselectedClassifications.length == 0)
            contextTree.generateRequest();
    }

    async _getTotalEntitiesByVendor(ownership) {
        let reqBody = {
            params: {
                query: {
                    contexts: [],
                    filters: {
                        typesCriterion: [this.WorkflowDetail.entityTypeshortname],
                        attributesCriterion: [

                        ]
                    }
                },
                options: {
                    maxRecords: 200
                }
            }
        };
        if (ownership != null) {
            let attrObj = {
                [this.ownershipAttrShortname]: {
                    eq: ownership,
                    "type": "_STRING",
                        "valueContexts": [
                          {
                            "source": "internal",
                            "locale": "en-US"
                          }
                    ]
                }
            }
            reqBody.params.query.filters.attributesCriterion.push(attrObj);

        }

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
            reqBody.params.query.filters.attributesCriterion.push(taxObj);
        }
        let res = await this._sendRequestToGetCount(reqBody);
        return res.response.content.totalRecords;
    }
    async _getTotalEntitiesByVendorInWFStep(ownership) {
        let reqBody ={
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
                              "self": "self"
                            },
                            {
                              "self": "self",
                              "workflow": this.WorkflowDetail.workflowshortname
                            }
                          ],
                          "filters": {
                            "attributesCriterion": [
                              {
                                "activities": {
                                  "attributes": [
                                    {
                                      "status": {
                                        "exacts": [
                                          "Executing",
                                          "AssignmentChange"
                                        ],
                                        "operator": "_OR"
                                      }
                                    },
                                    {
                                      "activityName": {
                                        "eq": this.WorkflowDetail.workflowstepshortname
                                      }
                                    }
                                  ],
                                  "contexts": [
                                    {
                                      "self": "self",
                                      "workflow": this.WorkflowDetail.workflowshortname
                                    }
                                  ],
                                  "nonContextual": false
                                }
                              },
                              {
                                "status": {
                                  "eq": "Executing",
                                  "contexts": [
                                    {
                                      "self": "self",
                                      "workflow": this.WorkflowDetail.workflowshortname
                                    }
                                  ],
                                  "nonContextual": false
                                }
                              }
                            ],
                            "typesCriterion": [
                              this.WorkflowDetail.entityTypeshortname
                            ],
                            "nonContextual": false
                          }
                        },
                        "options": {
                          "from": 0,
                          "to": 0
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
                            "typesCriterion": [
                                this.WorkflowDetail.entityTypeshortname
                            ],
                            "attributesCriterion": [
                             
                            ],
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
                          "maxRecords": 200
                        },
                        "appName": "app-entity-discovery",
                        "authorizationType": "accommodate"
                      }
                    }
                  ]
                }
              }
            },
            "domain": "thing",
            "operation": "initiatesearch"
          };

        if (ownership != null) {
            let attrObj = {
                [this.ownershipAttrShortname]: {
                    "eq": ownership,
                    "type": "_STRING",
                        "valueContexts": [
                          {
                            "source": "internal",
                            "locale": "en-US"
                          }
                        ]
                }
            };
            reqBody.entity.data.jsonData.searchQueries[1].searchQuery.query.filters.attributesCriterion.push(attrObj);

        }
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
            reqBody.entity.data.jsonData.searchQueries[1].searchQuery.query.filters.attributesCriterion.push(taxObj);
        }
        let URL = "/data/pass-through/entityappservice/getcombined";
        let res = await this._sendRequestToURL(URL, reqBody);
        return res.response.totalRecords;
    }

    async _getVendors() {
        let requestData = {
            params: {
                query: {

                    filters: {
                        "typesCriterion": ['user'],
                        "propertiesCriterion": [
                            {
                                "roles": {
                                    "eq": "vendor"
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
        let res = await this._sendRequestToGetModel(requestData);
        let tempArray = new Array();
        let objEntities = res.response.content.entityModels;

        //Loop through users and add in items array
        for (let i in objEntities) {
            tempArray.push({
                id: objEntities[i]['name'],
                title: objEntities[i]['name'],
                value: objEntities[i]['name'],
                subtitle: objEntities[i]['properties']['ownershipData'],
                image: ''
            });
        }
        this.refentitydata = tempArray;

    }

    async _getRejectedEntitiesScoreBasedCount(ownership) {
        let requestData =
        {
            "params": {
                "query": {
                    "filters": {
                        "typesCriterion": [this.WorkflowDetail.entityTypeshortname],
                        "attributesCriterion": [
                            {
                                [this.rejectionScoreAttrshortame]: {
                                    gte: 1
                                }
                            }
                        ],
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
                    "from": 0,
                    "to": 50
                }

            }

        };

        if (this.selectedTax.length > 0 && this.selectedTax != "No Taxonomy Selected") {
            let taxObj = {
                [this.taxonomyAttrShortname]: {
                    "exacts": this.selectedTax,
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
            requestData.params.query.filters.attributesCriterion.push(taxObj);
        }

        if (ownership != null) {
            let attrObj = {
                [this.ownershipAttrShortname]: {
                    "eq": ownership,
                    "type": "_STRING",
                        "valueContexts": [
                          {
                            "source": "internal",
                            "locale": "en-US"
                          }
                        ]
                }
            };
            requestData.params.query.filters.attributesCriterion.push(attrObj);

        }

        let res = await this._sendRequestToGetCount(requestData);
        return res.response.content.totalRecords;
    }

    async _getAvgQuality() {
        this.average = 100-( (this.totalRejected * 100) / this.totalSubmitted);
    }
    manageVisibility() {

        this.spinnerFlag = false;
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


    async _sendRequestToURL(URL, requestData) {
        let response = await DataAccessManager.rest(
            URL,
            requestData
        );
        return response;
    }

    static get properties() {
        return {
            referenceFilter: {
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
            rejectionScoreAttrshortame: {
                type: String
            },
            spinnerFlag: {
                type: Boolean,
                value: true
            },
            ownershipAttrShortname: {
                type: String
            },
            WorkflowDetail: {
                type: Object,
                value: function () {
                    return {


                        workflowshortname: '',
                        workflowstepshortname: '',
                        entityTypeshortname: ''
                    };
                },
                reflectToAttribute: true
            },
           
            filteredEntitiesCount: {
                type: String,
                reflectToAttribute: true
            },
            submittedPercent:{
                type: Number,
                value:0,
                reflectToAttribute: true
            },
            rejectedPercent:{
                type: Number,
                value:0,
                reflectToAttribute: true
            },
            totalSubmitted: {
                type: Number,
                value:0,
                reflectToAttribute: true
            },
            totalRejected: {
                type: Number,
                value:0,
                reflectToAttribute: true
            },
            totalEntities:{
                type: Number,
                value:0,
                reflectToAttribute: true
            },
            average: {
                type: String,
                reflectToAttribute: true
            },
            taxonomyAttrShortname: {
                type: String,
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
            entityData: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [];
                },
            },


            refentitydata: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [];
                }
            },
            classificationContextData: {
                type: Object,
                value: function () {
                    return {};
                }

            },
            contextData: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onContextDataChange'
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


        let configResponse = await ConfigurationManager.getConfig('plugin-vendor-score-card', this.contextData);
        if (
            ObjectUtils.isValidObjectPath(configResponse, 'response.status') &&
            configResponse.response.status == 'success'
        ) {
            this._handleConfigGetSuccess(configResponse);
            //once the keys are added from custom config file


            if (this.referenceFilter.visible) {
                await this._getVendors();
            }

            await this._calculateData();
            this.manageVisibility();

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
customElements.define(PluginVendorScoreCard.is, PluginVendorScoreCard);
