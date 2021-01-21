import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-progress/paper-progress.js';
// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-icon/pebble-icon.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-lov/pebble-lov.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-graph-progress-ring/pebble-graph-progress-ring.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';

import { DataAccessManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/index.js';

import { DataObjectManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/DataObjectManager.js';
import '@riversandtechnologies/ui-platform-business-elements/src/elements/rock-classification-selector/rock-classification-selector.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-combo-box/pebble-combo-box.js';

//import'@riversandtechnologies/ui-platform-elements/lib/flow/elements/pebble-progress-bar';

class PluginQualityScoreCard extends PolymerElement {
    static get is() {
        return 'plugin-quality-score-card';
    }
    constructor() {
        super();
    }
    static get template() {
        return html`
       <style>
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
        margin: 4px;
        max-width: 100%;
        min-width:  20px;
        line-height: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

        paper-progress {
               --paper-progress-height:15px;
               --paper-progress-transition-duration: 0.08s;
               --paper-progress-transition-timing-function: ease;
               --paper-progress-transition-delay: 0s;
               --paper-progress-container-color: #d2d7dd;
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
          <div>
           Taxonomy 
            <pebble-icon class="m-l-25 icon-size" title="Select Taxonomy" icon="pebble-icon:Open-window" on-tap="openDailogCategorySelector"></pebble-icon>
                     <div> Selected Taxonomies </div>
                     <div style="display:flex; flex-wrap: wrap;">
                     <dom-repeat items="{{selectedTax}}">
                        <template>
                        <span class="tag-item-container border">{{item}}</span>
                        </template>
                    </dom-repeat>  
                    </div>
          </div>
          
          <div>
         <pebble-combo-box id='multi-select-lov' on-click="_openDataList" items={{refentitydata}}  multi-select label="Filter More With {{referenceEntityShortname}}"> </pebble-combo-box>
          </div>

          <div>
            <pebble-button  class="btn btn-success" button-text="Apply" on-tap ="_applyFilter"></pebble-button>
        </div>
          <table>
          <tr>
          <td> <pebble-graph-progress-ring  percentage="{{grandavg}}" _showPercentage="true"></pebble-graph-progress-ring></td>
          <td>
                <div>Missing Images <br>  <paper-progress value=[[missingImagesCount]]></paper-progress></div>
                <div>Invalid Value <br>  <paper-progress value=[[invalidValue]]></paper-progress> </div>
                <div> Missing Required Attributes <br>  <paper-progress value=[[missingRequiredAttributes]]></paper-progress> </div>
                <div  id="rejectedItemsid">Rejected Items <br>  <paper-progress value=[[rejectedItemsCount]]></paper-progress></div>
                <div id="missingRel">
                [[dynamicRelationship.label]]  <paper-progress value=[[missingRelCount]]></paper-progress>
                </div>
          </td>
          </tr>
          </table>

            <pebble-progress-bar state="warning" min="0" max="100" current="40" isLabeled> </pebble-progress-bar>
            `;
    }

    _applyFilter() {

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
        this._getMissingImagesCount();
        this._getInvalidValueCount();
        this._getMissingRequiredAttributesCount();
        this._getrejectedItemsCount();
        this._getmissingRelCount();
        this._getAvgBasedonGrandTotal();
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



        // this.treeItems = ObjectUtils.cloneObject(contextTree.selectedClassifications);
        this.shadowRoot.querySelector('#myDialog').close();

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
        this._getRefEntityData();
        this.shadowRoot
            .querySelector('pebble-combo-box')
            .shadowRoot.querySelector('pebble-collection-container')
            .openPopover();
    }

    openDailogCategorySelector() {
        /*
           //This code is for generation of category tree on click of setting icon
           let contextTree = this.shadowRoot.querySelector('#classificationTree');
           this.preselectedClassifications=[["Electrical Supplies"],["Groceries"],["Packaging Taxonomy"]];
        //   this.tags=[{"longName":"Product Taxonomy>>Electrical Supplies","name":"Electrical Supplies","value":"Electrical Supplies"},{"longName":"Product Taxonomy>>Groceries","name":"Groceries","value":"Groceries"},{"longName":"Product Taxonomy>>Packaging Taxonomy","name":"Packaging Taxonomy","value":"Packaging Taxonomy"}];
        
           contextTree.generateRequest();
        
           /*let timeInterval = 1500;
           timeOut.after(timeInterval).run(() => {
               //this.isConfigLoaded = true;
               //this._loading = false;
                  //To show selected classifications next time , in case of discard changes event
         
              this.preselectedClassifications=ObjectUtils.cloneObject(this.finalselectedClassifications);
   
           });
         */

        this.shadowRoot.querySelector('#myDialog').open();
        let contextTree = this.shadowRoot.querySelector('#classificationTree');

        if (this.preselectedClassifications.length == 0)
            contextTree.generateRequest();
    }
    async _getTotalEntities() {
        let reqBody = {
            params: {
                query: {
                    contexts: [],
                    filters: {
                        typesCriterion: this.entityTypes
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
    async _getRefEntityModel() {
        let requestData = {
            params: {
                query: {
                    id: this.referenceEntityShortname + '_entityManageModel',
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
                        typesCriterion: [this.referenceEntityShortname]
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

    async _getMissingImagesCount() {
        let requestData = {
            params: {
                query: {
                    filters: {
                        typesCriterion: this.entityTypes,
                        attributesCriterion: [

                        ],
                        relationshipsCriterion: [
                            {
                                hasimages: {
                                    hasvalue: false
                                }
                            }
                        ]
                    },
                    valueContexts: [
                        {
                            source: 'internal',
                            locale: 'en-US'
                        }
                    ]
                },
                options: {
                    maxRecords: 1
                }
            }
        };
        //adding taxonomy filter if its selected
        if (this.selectedTax.length > 0) {
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
            requestData.params.query.filters.attributesCriterion.push(taxObj);
        }
        //adding ref attr filter if its selected
        if (this.selectedFilters.length > 0) {
            let filterObj = {
                [this.referenceAttrShortname]: {
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
            requestData.params.query.filters.attributesCriterion.push(filterObj);
        }

        //brand attr value check filter pending
        /*  let requestData = {
              params: {
                  query: {
                      filters: {
                          typesCriterion: this.entityTypes,
                          attributesCriterion: [
                              {
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
                              },
                              {
                                  [this.referenceAttrShortname]: {
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
                              }
                          ],
                          relationshipsCriterion: [
                              {
                                  hasimages: {
                                      hasvalue: false
                                  }
                              }
                          ]
                      },
                      valueContexts: [
                          {
                              source: 'internal',
                              locale: 'en-US'
                          }
                      ]
                  },
                  options: {
                      maxRecords: 1
                  }
              }
          };*/
        let res = await this._sendRequestToGetCount(requestData);
        this.missingImagesCount = res.response.content.totalRecords;
    }

    async _getInvalidValueCount() {
        /*  let requestData = {
              params: {
                  query: {
                      filters: {
                          typesCriterion: this.entityTypes,
                          keywordsCriterion: {
                              operator: '_AND',
                              keywords: 'InvalidVal001'
                          }
                      },
                      valueContexts: [
                          {
                              source: 'internal',
                              locale: 'en-US'
                          }
                      ]
                  },
                  options: {
                      maxRecords: 200
                  }
              }
          };
          var res = await this._sendRequestToGetGovernCount(requestData);
          this.invalidValue = res.response.content.totalRecords;
          */
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
                                        "filters": {
                                            "typesCriterion": this.entityTypes,
                                            "keywordsCriterion": {
                                                "operator": "_AND",
                                                "keywords": "InvalidVal001"
                                            }
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
                                            "typesCriterion": this.entityTypes,
                                            "attributesCriterion": []
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
        if (this.selectedTax.length > 0) {
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
                [this.referenceAttrShortname]: {
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
        let URL = "/data/pass-through/entityappservice/getcombined";
        let res = await this._sendRequestToURL(URL, requestData);
        this.invalidValue = res.response.totalRecords;
    }

    async _getMissingRequiredAttributesCount() {
        /*
        let requestData = {
            params: {
                query: {
                    filters: {
                        typesCriterion: this.entityTypes,
                        keywordsCriterion: {
                            operator: '_AND',
                            keywords: 'Req001'
                        }
                    },
                    valueContexts: [
                        {
                            source: 'internal',
                            locale: 'en-US'
                        }
                    ]
                },
                options: {
                    maxRecords: 200
                }
            }
        };
        var res = await this._sendRequestToGetGovernCount(requestData);
        this.missingRequiredAttributes = res.response.content.totalRecords;*/
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
                                        "filters": {
                                            "typesCriterion": this.entityTypes,
                                            "keywordsCriterion": {
                                                "operator": "_AND",
                                                "keywords": "Req001"
                                            }
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
                                            "typesCriterion": this.entityTypes,
                                            "attributesCriterion": []
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
        if (this.selectedTax.length > 0) {
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
                [this.referenceAttrShortname]: {
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
        let URL = "/data/pass-through/entityappservice/getcombined";
        let res = await this._sendRequestToURL(URL, requestData);
        this.missingRequiredAttributes = res.response.totalRecords;
    }

    async _getrejectedItemsCount() {
        /*
        let requestData = {
            "params": {
                "query": {
                    "contexts": [
                        {
                            "self": "self"
                        },
                        {
                            "self": "self",
                            "workflow": this.rejectedItems.wfShortname
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
                                                "eq": this.rejectedItems.wfStepShortname
                                            }
                                        }
                                    ],
                                    "contexts": [
                                        {
                                            "self": "self",
                                            "workflow": this.rejectedItems.wfShortname
                                        }
                                    ],
                                    "valueContexts": [
                                        {
                                            "source": "internal",
                                            "locale": "en-US"
                                        }
                                    ],
                                    "nonContextual": false
                                }
                            }
                        ],
                        "typesCriterion": [
                            this.rejectedItems.entityTypeShortname
                        ],
                        "nonContextual": false
                    }
                }
            }
        };
        var res = await this._sendRequestToGetGovernCount(requestData);
        this.rejectedItemsCount = res.response.content.totalRecords;*/

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
                                                "self": "self"
                                            },
                                            {
                                                "self": "self",
                                                "workflow": this.rejectedItems.wfShortname
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
                                                                    "eq": this.rejectedItems.wfStepShortname
                                                                }
                                                            }
                                                        ],
                                                        "contexts": [
                                                            {
                                                                "self": "self",
                                                                "workflow": this.rejectedItems.wfShortname
                                                            }
                                                        ],
                                                        "valueContexts": [
                                                            {
                                                                "source": "internal",
                                                                "locale": "en-US"
                                                            }
                                                        ],
                                                        "nonContextual": false
                                                    }
                                                }
                                            ],
                                            "typesCriterion": [
                                                this.rejectedItems.entityTypeShortname
                                            ],
                                            "nonContextual": false
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
                                            "typesCriterion": this.entityTypes,
                                            "attributesCriterion": []
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
        if (this.selectedTax.length > 0) {
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
                [this.referenceAttrShortname]: {
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
        let URL = "/data/pass-through/entityappservice/getcombined";
        let res = await this._sendRequestToURL(URL, requestData);
        this.rejectedItemsCount = res.response.totalRecords;
    }

    async _getmissingRelCount() {
    /*    let requestData = {
            params: {
                query: {
                    filters: {
                        typesCriterion: this.entityTypes,
                        relationshipsCriterion: [
                            {
                                [[this.dynamicRelationship.relshortname]]: {
                                    hasvalue: false
                                }
                            }
                        ]
                    },
                    valueContexts: [
                        {
                            source: 'internal',
                            locale: 'en-US'
                        }
                    ]
                },
                options: {
                    maxRecords: 1
                }
            }
        };
        var res = await this._sendRequestToGetCount(requestData);
        this.missingRelCount = res.response.content.totalRecords;*/

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
                                        "filters": {
                                            "typesCriterion": this.entityTypes,
                                            "relationshipsCriterion": [
                                                {
                                                    [[this.dynamicRelationship.relshortname]]: {
                                                        "hasvalue": false
                                                    }
                                                }
                                            ]
                                        },
                                        "valueContexts": [
                                            {
                                                "source": "internal",
                                                "locale": "en-US"
                                            }
                                        ]
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
                                            "typesCriterion": this.entityTypes,
                                            "attributesCriterion": []
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
        if (this.selectedTax.length > 0) {
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
                [this.referenceAttrShortname]: {
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
        let URL = "/data/pass-through/entityappservice/getcombined";
        let res = await this._sendRequestToURL(URL, requestData);
        this.missingRelCount = res.response.totalRecords;
    }


    _getAvgBasedonGrandTotal()
    {
        let total=parseInt(this.missingImagesCount)+parseInt(this.missingRelCount)+parseInt(this.invalidValue)+parseInt(this.missingRequiredAttributes)+parseInt(this.rejectedItemsCount);
        this.grandavg=total/parseInt(this._getTotalEntities());

    }

    manageVisibility() {
        let lirel = this.shadowRoot.querySelector('#missingRel');
        let lirej = this.shadowRoot.querySelector('#rejectedItemsid');
        if (this.dynamicRelationship.visible) {
            lirel.style.display = 'block';
        }
        else {
            lirel.style.display = 'none';
        }
        if (this.rejectedItems.visible) {
            lirej.style.display = 'block';
        }
        else {
            lirej.style.display = 'none';
        }
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

    static get properties() {
        return {

            grandavg: {
                type: String,
                reflectToAttribute: true
            },
            
            
            missingImagesCount: {
                type: String,
                reflectToAttribute: true
            },
            missingRelCount: {
                type: String,
                reflectToAttribute: true
            },

            invalidValue: {
                type: String,
                reflectToAttribute: true
            },
            missingRequiredAttributes: {
                type: String,
                reflectToAttribute: true
            },
            rejectedItemsCount: {
                type: String,
                reflectToAttribute: true
            },
            
            referenceEntiytyIdentifier: {
                type: String,
                reflectToAttribute: true
            },
            refereneceEntityExternalName: {
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
                    return [];
                },
            },
            selectedFilters: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [];
                },
            },
            entityTypes: {
                type: Array,
                notify: true,
                reflectToAttribute: true
            },
            referenceAttrShortname: {
                type: String,
                reflectToAttribute: true
            },
            referenceEntityShortname: {
                type: String,
                reflectToAttribute: true
            },
            dynamicRelationship: {
                type: Object,
                value: function () {
                    return {
                        visible: false,
                        relshortname: '',
                        label: ''
                    };
                },
                reflectToAttribute: true
            },
            rejectedItems: {
                type: Object,
                value: function () {
                    return {
                        visible: false,
                        wfShortname: '',
                        wfStepShortname: '',
                        entityTypeShortname: ''
                    };
                },
                reflectToAttribute: true
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


        let configResponse = await ConfigurationManager.getConfig('plugin-quality-score-card', this.contextData);
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
                //once the keys are added from custom config file
                this._getMissingImagesCount();
                this._getRefEntityModel();
                this._getMissingRequiredAttributesCount();
                this._getInvalidValueCount();
                this._getrejectedItemsCount();
                this._getmissingRelCount();
              
                this.manageVisibility();
                this._getAvgBasedonGrandTotal();
            }
        }
    }
    _handleConfigGetError(configResponse) {
        console.error('UI config get failed with error', configResponse);
    }
}
customElements.define(PluginQualityScoreCard.is, PluginQualityScoreCard);
