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

import './JS/Chart.js';
import './JS/utils.js';

class PluginMyCatalog extends PolymerElement {
    static get is() {
        return 'plugin-my-catalog';
    }

    static get template() {
        return html` 

        <style>
        canvas{
		    -moz-user-select: none;
		    -webkit-user-select: none;
	       	-ms-user-select: none;
              }
                /*
            * DOM element rendering detection
            * https://davidwalsh.name/detect-node-insertion
            */
            @keyframes chartjs-render-animation {
                from { opacity: 0.99; }
                to { opacity: 1; }
            }

            .chartjs-render-monitor {
                animation: chartjs-render-animation 0.001s;
            }

            /*
            * DOM element resizing detection
            * https://github.com/marcj/css-element-queries
            */
            .chartjs-size-monitor,
            .chartjs-size-monitor-expand,
            .chartjs-size-monitor-shrink {
                position: absolute;
                direction: ltr;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                pointer-events: none;
                visibility: hidden;
                z-index: -1;
            }

            .chartjs-size-monitor-expand > div {
                position: absolute;
                width: 1000000px;
                height: 1000000px;
                left: 0;
                top: 0;
            }

            .chartjs-size-monitor-shrink > div {
                position: absolute;
                width: 200%;
                height: 200%;
                left: 0;
                top: 0;
            }


        .canvasHolder{
            width:100%;
            text-align: -webkit-center;
        }
         #filterPopover{​​​​​​​​
                position:absolute !important;
                left:540px !important;
                top:66px !important;
            }​​​​​​​​    
        .pointer {cursor: pointer;}
        .contextTreecustom {
           height: 82vh;
        }
        .avg-item-container {
            border: solid 1px #d2d7dd;
            border-radius: 3px;
            padding: 2% 2% 2% 2%;
            font-size: 14px;
            position: relative;
            background: #fff;
            margin:0.5% 0.5% 0.5% 0.5%;
            max-width: 100%;
            min-width: 20px;
            line-height: 20px;
            flex-direction: row;
            align-items: center;
            text-align: center;
            width: 50%;
        }
        .div-container {
            display: flex;
            border: solid 1px #d2d7dd;
            border-radius: 3px;
            padding: 1%;
            position: relative;
            background: #fff;
            margin: 1%;
            max-width: 100%;
            min-width: 20px;
            flex-direction: row;
            align-items: center;
            width: 95%;
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
            margin: 0px 0px 4px 4px;
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

            .div-table-col {
                float: left; /* fix for  buggy browsers */
                display: table-column;         
                width: 100%;         
              }
             
        </style>  
       
       
        <pebble-spinner active=[[spinnerFlag]]></pebble-spinner>
        <br>
        <div id="maindiv" style="display:none">
          
        <pebble-popover id="filterPopover" for="" vertical-align="top" horizontal-align="auto"   no-overlap>
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
                    <pebble-icon id="iconcal" class="m-l-25 icon-size" title="Select Date Range" icon="pebble-icon:calender" on-tap="calendarClickHandler"></pebble-icon>
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
                            <div class="canvasHolder" id="canvas-holder">
                                <canvas id="chart-area"></canvas>
                            </div>

                      <!--  <pebble-graph-pie id="pie1" data="[[data]]" chart-style="[[pieChartStyle]]"> </pebble-graph-pie>-->
                        </div>
                        <!--
                        <div class="avg-item-container">    
                        <b>  Status Summary </b>
                            <div class="canvasHolder" id="canvas-holder2">
                                 <canvas id="chart-area2"></canvas>
                            </div>
                       <pebble-graph-pie id="pie2" data="[[data2]]" chart-style="[[pieChartStyle]]"> </pebble-graph-pie>
                        </div>
                        -->
                            <div class="avg-item-container">    
                            <b>  Onboarding Summary </b>
                                <div class="canvasHolder" id="canvas-holder3">
                                    <canvas id="chart-area3"></canvas>
                            </div>
                            <!--     <pebble-graph-pie id="pie3" data="[[data3]]" chart-style="[[pieChartStyle]]"> </pebble-graph-pie>-->
                            </div>
                        
                      
                </div>
            </div>
         </div>
</div>
        `;
    }

    _onChartClick(event, ele) {

        let datasetindex = ele[0]._datasetIndex;
        //  Getting data set , for sample item entity type data set
        let dataset = ele[0]._chart.config.data.datasets[datasetindex];
        let dataindex = ele[0]._index;
        //  Once we get dataset , the data which got selected on data set that count we can get here
        this.piechartSectionClick(dataindex);
       
    }
    /*
    _onChart2Click(event, ele) {

        let datasetindex = ele[0]._datasetIndex;
        //  Getting data set , for sample item entity type data set
        let dataset = ele[0]._chart.config.data.datasets[datasetindex];
        let dataindex = ele[0]._index;
        //  Once we get dataset , the data which got selected on data set that count we can get here
        let data = dataset.data[dataindex];      
        this.piechart2SectionClick(dataindex);
             
    }*/
    
    _onChart3Click(event, ele) {

        let datasetindex = ele[0]._datasetIndex;
        //  Getting data set , for sample item entity type data set
        let dataset = ele[0]._chart.config.data.datasets[datasetindex];
        let dataindex = ele[0]._index;
        //  Once we get dataset , the data which got selected on data set that count we can get here
        let data = dataset.data[dataindex];      
        this.piechart3SectionClick(dataindex);
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

        if (this.tags.length == 0) {
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

    piechartSectionClick(ch) {
        let queryParam ;
        switch(ch)
        {
            case 0:
                //redirect with parameter
                queryParam = {
                    attributes:{},
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
                break;
            case 1:
                queryParam = {
                    attributes:{},
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
                break;

                case 2:
                    queryParam = {
                        attributes:{},
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
                    break;

                    case 3:
                        queryParam = {
                            attributes:{},
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
                        break;


      }
        //If taxonomy is available
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

            let obj={[this.taxonomyAttrShortname]:searchString }
            queryParam.attributes=obj;

        }
        //IF date is selected
        if(this.selectedDateRange.length>0 && this.selectedDateRange!="No Date Selected")
        {   
           queryParam.attributes.rsInternalGenericCreatedDate=this.selectedDateRange;
        }
        this._redirectTo('search-thing', queryParam);
    }

    piechart2SectionClick(ch) {
        let queryParam;
        switch(ch)
        {
            case 0:
              //Created
                queryParam = {
                    attributes:{
                        [this.createdchart.attributeshortname]:true,
                        [this.modifiedchart.attributeshortname]:false

                    },
                    entitytype:this.modifiedchart.entityTypeshortname
                  
                };
               
                break;
            case 1:
                //Modified
                queryParam = {
                    attributes:{
                        [this.modifiedchart.attributeshortname]:true
                    },
                    entitytype:this.modifiedchart.entityTypeshortname
                    
                };
                break;

                case 2:
                    //Discontinued
                    queryParam = {
                        attributes:{
                            [this.discontinuedchart.attributeshortname]:this.discontinuedchart.attributevalue
                        },
                        entitytype:this.discontinuedchart.entityTypeshortname
                        
                    };
                    break;

                    case 3:
                        //Published
                        queryParam = {
                            attributes:{
                                [this.publishedchart.attributeshortname]:this.publishedchart.attributevalue
                            },
                            entitytype:this.publishedchart.entityTypeshortname
                            
                        };
                        break;


      }
        //If taxonomy is available
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

          //  let obj={[this.taxonomyAttrShortname]:searchString }
            queryParam.attributes[this.taxonomyAttrShortname]=searchString;

        }
        //IF date is selected
        if(this.selectedDateRange.length>0 && this.selectedDateRange!="No Date Selected")
        {   
           queryParam.attributes.rsInternalGenericCreatedDate=this.selectedDateRange;
        }
        this._redirectTo('search-thing', queryParam);
    }
    piechart3SectionClick(ch) {
        let queryParam;
        switch(ch)
        {
            case 0:
              //Item Exists
                queryParam = {
                    attributes:{
                        [this.piechart3.attributeshortname]:"true"
                    },
                    entitytype:this.piechart3.entityTypeshortname
                };
               
                break;
            case 1:
                //Item do not exists
                queryParam = {
                    attributes:{
                        [this.piechart3.attributeshortname]:"false"
                    },
                    entitytype:this.piechart3.entityTypeshortname                    
                };
                break; 


      }
        //If taxonomy is available
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

          //  let obj={[this.taxonomyAttrShortname]:searchString }
            queryParam.attributes[this.taxonomyAttrShortname]=searchString;

        }
        //IF date is selected
        if(this.selectedDateRange.length>0 && this.selectedDateRange!="No Date Selected")
        {   
           queryParam.attributes.rsInternalGenericCreatedDate=this.selectedDateRange;
        }
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
        let requestData = {
            "params": {
                "query": {
                    "contexts": [],
                    "filters": {
                        "typesCriterion": [entitytype],
                        "attributesCriterion": [],
                        "propertiesCriterion": [],
                    }
                },
                "options": {
                    "maxRecords": 200
                }
            }
        };
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
            requestData.params.query.filters.attributesCriterion.push(taxObj);
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
            requestData.params.query.filters.attributesCriterion.push(filterObj);
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
            requestData.params.query.filters.propertiesCriterion.push(dateCriteria);
        }

        let res = await this._sendRequestToGetCount(requestData);
        return res.response.content.totalRecords;
    }
    async _getEntitiesCountIn(wfname, entitytype, activityname) {

        let requestData = {
            "domain": "thing",
            "entity": {
                "data": {
                    "jsonData": {
                        "searchQueries": [
                            {
                                "action": "get",
                                "searchQuery": {
                                    "options": {
                                        "from": 0,
                                        "to": 0
                                    },
                                    "query": {
                                        "contexts": [
                                            {
                                                "self": "self"
                                            },
                                            {
                                                "self": "self",
                                                "workflow": wfname
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
                                                                    "eq": activityname
                                                                }
                                                            }
                                                        ],
                                                        "contexts": [
                                                            {
                                                                "self": "self",
                                                                "workflow": wfname
                                                            }
                                                        ],
                                                        "nonContextual": false
                                                    }
                                                },
                                                {
                                                    "status": {
                                                        "contexts": [
                                                            {
                                                                "self": "self",
                                                                "workflow": wfname
                                                            }
                                                        ],
                                                        "eq": "Executing",
                                                        "nonContextual": false
                                                    }
                                                }
                                            ],
                                            "nonContextual": false,
                                            "typesCriterion": [
                                               entitytype
                                            ]
                                        }
                                    }
                                },
                                "searchSequence": 1,
                                "serviceName": "entitygovernservice"
                            },
                            {
                                "action": "get",
                                "searchQuery": {
                                    "appName": "app-entity-discovery",
                                    "authorizationType": "accommodate",
                                    "options": {
                                        "maxRecords": 200
                                    },
                                    "query": {
                                        "filters": {
                                            "typesCriterion": [
                                               entitytype
                                            ],
                                            "attributesCriterion": [
                                              
                                            ],
                                            "propertiesCriterion":[]
                                        },
                                        "valueContexts": [
                                            {
                                                "locale": "en-US",
                                                "source": "internal"
                                            }
                                        ]
                                    }
                                },
                                "searchSequence": 2,
                                "serviceName": "entityservice"
                            }
                        ]
                    }
                },
                "id": "combinedGet",
                "name": "combinedGet",
                "type": "config"
            },
            "operation": "initiatesearch",
            "params": {
                "isCombinedQuerySearch": true,
                "options": {
                    "from": 0,
                    "to": 50
                }
            }
        }
        
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

    async _getHavingItemsCount(entitytype, attrname, attrval) {
        let reqbody = {
            params: {
                query: {
                    filters: {
                        typesCriterion: [entitytype],
                        attributesCriterion: [
                            {
                                [attrname]: {
                                    exact: attrval,
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

        let ReferenceFilterDiv = this.shadowRoot.querySelector("#refEntityDiv");

        let workflowdata = new Array();
        let workflowdatacount = new Array();
        let pieBgColor = new Array();
        let pieLabel = new Array();
        if (this.wfchart1.visible) {
            //   chart1.style.display = 'block';
            let totalEntities = await this._getTotalEntities(this.wfchart1.entityTypeshortname);
            let count = await this._getEntitiesCountIn(
                this.wfchart1.workflowshortname,
                this.wfchart1.entityTypeshortname,
                this.wfchart1.workflowstepshortname
            );
            this.wfchart1percentage = (count * 100) / totalEntities;
            if (this.wfchart1percentage != 0) {
                this.wfchart1percentage = this.wfchart1percentage.toFixed(2);
            }
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

            workflowdatacount.push(count);
            pieBgColor.push('#F6D40C');
            pieLabel.push(this.wfchart1.label);
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
            if (this.wfchart2percentage != 0) {
                this.wfchart2percentage = this.wfchart2percentage.toFixed(2);
            }
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

            workflowdatacount.push(count);
            pieBgColor.push('#36B44A');
            pieLabel.push(this.wfchart2.label);
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
            if (this.wfchart3percentage != 0) {
                this.wfchart3percentage = this.wfchart3percentage.toFixed(2);
            }
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
            workflowdatacount.push(count);
            pieBgColor.push('#EE204C');
            pieLabel.push(this.wfchart3.label);
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
            if (this.wfchart4percentage != 0) {
                this.wfchart4percentage = this.wfchart4percentage.toFixed(2);
            }
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
            workflowdatacount.push(count);
            pieBgColor.push('#129CE6');
            pieLabel.push(this.wfchart4.label);
        }

/*
        let entitydata = new Array();
        let entitydatacount = new Array();
        let pieBgColor2 = new Array();
        let pieLabel2 = new Array();

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
            if (this.createdchartpercentage != 0) {
                this.createdchartpercentage = this.createdchartpercentage.toFixed(2);
            }
            entitydata.push({
                id: 1,
                key: this.createdchart.label,
                value: this.createdchartpercentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: this.createdchart.label,
                color: '#F78E1E'
            });

            entitydatacount.push(count);
            pieBgColor2.push('#F78E1E');
            pieLabel2.push(this.createdchart.label);

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
            if (this.modifiedchartpercentage != 0) {
                this.modifiedchartpercentage = this.modifiedchartpercentage.toFixed(2);
            }
            entitydata.push({
                id: 2,
                key: this.modifiedchart.label,
                value: this.modifiedchartpercentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: this.modifiedchart.label,
                color: '#785DA8'
            });

            entitydatacount.push(count);
            pieBgColor2.push('#785DA8');
            pieLabel2.push(this.modifiedchart.label);
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
            if (this.discontinuedchartpercentage != 0) {
                this.discontinuedchartpercentage = this.discontinuedchartpercentage.toFixed(2);
            }
            entitydata.push({
                id: 3,
                key: this.discontinuedchart.label,
                value: this.discontinuedchartpercentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: this.discontinuedchart.label,
                color: '#EE204C'
            });

            entitydatacount.push(count);
            pieBgColor2.push('#EE204C');
            pieLabel2.push(this.discontinuedchart.label);
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
            if (this.publishedchartpercentage != 0) {
                this.publishedchartpercentage = this.publishedchartpercentage.toFixed(2);
            }
            entitydata.push({
                id: 4,
                key: this.publishedchart.label,
                value: this.publishedchartpercentage,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: this.publishedchart.label,
                color: '#36B44A'
            });

            entitydatacount.push(count);
            pieBgColor2.push('#36B44A');
            pieLabel2.push(this.publishedchart.label);
        }*/

        if (this.referenceFilter.visible) {
            ReferenceFilterDiv.style.display = 'block';
        } else {
            ReferenceFilterDiv.style.display = 'none';
        }


        let itemExistsData = new Array();
        let itemExistsDataCount = new Array();
        let pieBgColor3 = new Array();
        let pieLabel3 = new Array();

        //Logic for getting vendoritem having items
        if (this.piechart3.visible) {
            let totalEntities = parseInt(await this._getTotalEntities(this.piechart3.entityTypeshortname));
            let count = parseInt(await this._getHavingItemsCount(
                this.piechart3.entityTypeshortname,
                this.piechart3.attributeshortname,
                this.piechart3.attributevalue
            ));
            let countper = count * 100 / totalEntities;
            if (countper != 0) {
                countper = countper.toFixed(2);
            }
            let vendoritemWithNoItems = totalEntities - count;
            let vendoritemWithNoItemsPer = vendoritemWithNoItems * 100 / totalEntities;
            if (vendoritemWithNoItemsPer != 0) {
                vendoritemWithNoItemsPer = vendoritemWithNoItemsPer.toFixed(2);
            }
            itemExistsData.push({
                id: 1,
                key: "Having Items",
                value: countper,
                count: count,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: "Having Items",
                color: '#F78E1E'
            });
            itemExistsData.push({
                id: 2,
                key: "Missing Item",
                value: vendoritemWithNoItemsPer,
                count: vendoritemWithNoItems,
                unit: '%',
                clickable: true,
                section: 'processing',
                label: "Missing Item",
                color: '#36B44A'
            });

            itemExistsDataCount.push(count);
            pieBgColor3.push('#F78E1E');
            pieLabel3.push("Having Items");

            itemExistsDataCount.push(vendoritemWithNoItems);
            pieBgColor3.push('#36B44A');
            pieLabel3.push("Missing Item");

        }
        
        this.data = workflowdata;
      //  this.data2 = entitydata;
        this.data3 = itemExistsData;

        this.piedata = workflowdatacount;
        //this.piedata2 = entitydatacount;
       this.piedata3 = itemExistsDataCount;
       
      //pie 1 config

        if (window.myPie == null) {
            this.pieconfig = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: this.piedata,
                        backgroundColor: pieBgColor,
                        label: 'Workflow Summary'
                    }],
                    labels: pieLabel
                },
                options: {
                    responsive: true,
                    legend: {
                        display: true
                    },
                    onClick: (e, ele) => {
                       
                        let elements = ele[0]._chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false)
                        this._onChartClick(e, elements);
                    }
                }
            };
            var ctx = this.shadowRoot.querySelector('#chart-area').getContext('2d');
            window.myPie = new Chart(ctx, this.pieconfig);
        }
        else {
            this.pieconfig.data.datasets[0].data=this.piedata;
            window.myPie.update();
        }
      /*
        if (window.myPie2 == null) {
            this.pieconfig2 = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: this.piedata2,
                        backgroundColor: pieBgColor2,
                        label: 'Status Summary'
                    }],
                    labels: pieLabel2
                },
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    onClick: (e, ele) => {
                        let elements = ele[0]._chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false)
                        this._onChart2Click(e, elements);
                    }
                }
            };
            var ctx2 = this.shadowRoot.querySelector('#chart-area2').getContext('2d');
            window.myPie2 = new Chart(ctx2, this.pieconfig2);
        }
        else {
            this.pieconfig2.data.datasets[0].data=this.piedata2;
            window.myPie2.update();
        }*/
        
       
        if (window.myPie3 == null) {
             this.pieconfig3 = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: this.piedata3,
                    backgroundColor: pieBgColor3,
                    label: 'Onboarding Summary'
                }],
                labels: pieLabel3
            },
            options: {
                responsive: true,
                legend: {
                    display: true
                },
                onClick: (e, ele) => {
                    let elements = ele[0]._chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false)
                    this._onChart3Click(e, elements);
                }
            }
        };
        var ctx3 = this.shadowRoot.querySelector('#chart-area3').getContext('2d');
            window.myPie3 = new Chart(ctx3, this.pieconfig3);
        }
        else {
             this.pieconfig3.data.datasets[0].data=this.piedata3;
            window.myPie3.update();
        }
        
        return true;
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

            data3: {
                type: Array,
                value: function () {
                    return [

                    ];
                },
                reflectToAttribute: true,
                observer: '_onDataChanged'
            },

            piedata: {
                type: Array,
                value: function () {
                    return [

                    ];
                },
                reflectToAttribute: true,
                observer: '_onDataChanged'
            },
            piedata2: {
                type: Array,
                value: function () {
                    return [

                    ];
                },
                reflectToAttribute: true,
                observer: '_onDataChanged'
            },

            piedata3: {
                type: Array,
                value: function () {
                    return [

                    ];
                },
                reflectToAttribute: true,
                observer: '_onDataChanged'
            },

            pieconfig: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            pieconfig2: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            pieconfig3: {
                type: Object,
                value: function () {
                    return {};
                }
            },
            referenceEntiytyIdentifier: {
                type: String,
                reflectToAttribute: true
            },
            refereneceEntityExternalName: {
                type: String,
                reflectToAttribute: true
            },
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
            piechart3: {
                type: Object,
                value: function () {
                    return {
                        visible: true,
                        label: '',
                        attributeshortname: '',
                        attributevalue: '',
                        entityTypeshortname: ''
                    };
                },
                reflectToAttribute: true
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
                        entityTypeshortname: '',
                        attributeshortname:''
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
                        entityTypeshortname: '',
                        attributeshortname:''
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
                        attributevalue: '',
                        attributeshortname:''
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
                if (this.referenceFilter.visible) {
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


    }
}

customElements.define(PluginMyCatalog.is, PluginMyCatalog);
