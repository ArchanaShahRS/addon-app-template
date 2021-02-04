import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-button/pebble-button.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-icon/pebble-icon.js';
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-tag-item/pebble-tag-item.js';
import './JS/Chart.js';
import './JS/utils.js';

import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-combo-box/pebble-combo-box.js';
// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';
import { AppInstanceManager } from '@riversandtechnologies/ui-platform-elements/lib/managers/app-instance-manager.js';
import { DataObjectManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/DataObjectManager.js';

class PluginEntityCreationChart extends PolymerElement {
    static get is() {
        return 'plugin-entity-creation-chart';
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
.displayflexwrap{
    display:flex;
    flex-wrap: wrap;
}
    </style>
 <div class="displayflexwrap">

   
    <pebble-combo-box  style="width: 32%;
    padding: 0px 10px 0px 0px;" id="select-year"  on-click="_openDataListYear" items="{{YEARS}}" on-selection-changed="_onYearUpdate"  label="Select Year">
    </pebble-combo-box>

    <pebble-combo-box  style="width: 32%;
    padding: 0px 10px 0px 0px;" id="select-quarter"  on-click="_openDataListQuarter" items="{{QUARTER}}" on-selection-changed="_onQuarterUpdate"  label="Select Quarter">
    </pebble-combo-box>
    <br/><br/>
    <pebble-button
    class="btn-success"
    id="btnallClick"
    button-text="Apply"
    noink=""
    large-text
    on-tap="_apply"></pebble-button>
</div>
<br><br>
    <div style="width:100%;">
		<canvas id="canvas"></canvas>
	</div>
	<br>
    <br>
    <!--
	<button id="randomizeData">Randomize Data</button>
	<button id="addDataset">Add Dataset</button>
	<button id="removeDataset">Remove Dataset</button>
	<button id="addData">Add Data</button>
    <button id="removeData">Remove Data</button>
    -->
        `
    }
    _openDataListYear() {
        this._populateYear();
        let yearlov = this.shadowRoot.querySelector('#select-year');
        yearlov.shadowRoot.querySelector('pebble-collection-container')
            .openPopover();
    }

    _populateYear() {
        let todaydate = new Date();
        let Year = todaydate.getFullYear();
        let arr = new Array();
        for (let i = 0; i < 10; i++) {
            arr.push({
                id: Year - i,
                title: Year - i,
                value: Year - i,
            });
        }
        this.YEARS = arr;
    }
    _openDataListQuarter() {
        this.QUARTER = [
            {
                id: "q1",
                title: "Q1",
                value: "Q1",
            },
            {
                id: "q2",
                title: "Q2",
                value: "Q2",
            },
            {
                id: "q3",
                title: "Q3",
                value: "Q3",
            },
            {
                id: "q4",
                title: "Q4",
                value: "Q4",
            }
        ];
        let quarterlov = this.shadowRoot.querySelector('#select-quarter');
        quarterlov.shadowRoot.querySelector('pebble-collection-container')
            .openPopover();
    }
    _onYearUpdate() {

        let yearlov = this.shadowRoot.querySelector('#select-year');
        console.log("On Year Update:" + yearlov.pebbleLov._selectedItemId);

    }
    _onQuarterUpdate() {


        let quarterlov = this.shadowRoot.querySelector('#select-quarter');
        console.log("On Quarter Update:" + quarterlov.pebbleLov._selectedItemId);

    }
    _apply() {
        let yearlov = this.shadowRoot.querySelector('#select-year');
        let quarterlov = this.shadowRoot.querySelector('#select-quarter');
        if (yearlov.pebbleLov._selectedItemId == null && quarterlov.pebbleLov._selectedItemId == null) {
            //default is current year //default show all 4 quarters

        }
        if (yearlov.pebbleLov._selectedItemId == null && quarterlov.pebbleLov._selectedItemId != null) {
            //default is current year //display selected quarter
        }
        if (yearlov.pebbleLov._selectedItemId != null && quarterlov.pebbleLov._selectedItemId == null) {
            //display selected year //display all 4 quarter
        }

        if (yearlov.pebbleLov._selectedItemId != null && quarterlov.pebbleLov._selectedItemId != null) {
            //display selected year and quarter
        }

    }

    _regenrateChart(Year, Quarter) {
        //iterate from entitytype to make data set of each , nested loop to get count for each quarter

        if (Year == null && Quarter == null) {
            for (let i = 0; i < this.entityTypes.length; i++) {
                var colorName = this.colorNames[this.config.data.datasets.length % colorNames.length];
                var newColor = window.chartColors[colorName];
                var newDataset = {
                    label: this.entityTypes[i],
                    backgroundColor: newColor,
                    borderColor: newColor,
                    data: [],
                    fill: false
                };
                let datacount=0;
                
                for (var index = 0; index < this.QUARTER.length; index++) {

                    switch(this.QUARTER[index])
                    {
                    case "Q1":
                    break;
                    }

                    newDataset.data.push(randomScalingFactor());
                }

                this.config.data.datasets.push(newDataset);
                window.myLine.update();
            }

        }

    }

    _lastQuarter() {
        let endDate = new Date();
        let startDate = new Date(new Date().setDate(new Date().getDate() - 120));
        let sdate = startDate.toLocaleDateString('en-US');
        let edate = endDate.toLocaleDateString('en-US');
        this._searchInBetween(sdate, edate);
    }
    async _getEntitiesCountBetween(startDate, endDate) {

        let format = "YYYY-MM-DDTHH:mm:ss.SSS-0600";
        //check for daylight saving and change format accordingly


        let requestData = {
            "params": {
                "query": {
                    "contexts": [],
                    "filters": {
                        "typesCriterion": this.entityTypes,
                        "attributesCriterion": [],
                        "propertiesCriterion": [{
                            "createdDate": {
                                "gte": moment(startDate).format(),
                                "lte": moment(endDate).format("YYYY-MM-DDTHH:mm:ss.SSS-0600"),
                                "type": "_DATETIME",
                                "valueContexts": [
                                    {
                                        "source": "internal",
                                        "locale": "en-US"
                                    }
                                ]
                            }
                        }],
                    }
                },
                "options": {
                    "maxRecords": 200
                }
            }
        };


        let res = await this._sendRequestToGetCount(requestData);
        return res.response.content.totalRecords;
    }

    async _sendRequestToGetCount(requestData) {
        let entitySearchAndGetRequest = DataObjectManager.createRequest('initiatesearchandgetcount', requestData, '', {
            dataIndex: 'entityData'
        });
        let entitySearchAndGetResponse = await DataObjectManager.initiateRequest(entitySearchAndGetRequest);
        return entitySearchAndGetResponse;
    }

    _onChartClick(event, ele) {

        let datasetindex = ele[0]._datasetIndex;
        //  Getting data set , for sample item entity type data set
        let dataset = ele[0]._chart.config.data.datasets[datasetindex];
        let dataindex = ele[0]._index;
        //  Once we get dataset , the data which got selected on data set that count we can get here
        let data = dataset.data[dataindex];
        console.log("Data Clicked :" + data);
    }

    ready() {
        super.ready();

        this.MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.config = {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Item',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: [
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor()

                    ],
                    fill: false,
                }]
            },
            options: {

                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Chart.js Line Chart'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    x: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Quarter'
                        }
                    },
                    y: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }
                },
                events: ['click'],
                onClick: (e, ele) => {
                    let elements = ele[0]._chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false)
                    this._onChartClick(e, elements);
                }
            }
        };
        var ctx = this.shadowRoot.querySelector('#canvas').getContext('2d');
        window.myLine = new Chart(ctx, this.config);

        this.colorNames = Object.keys(window.chartColors);
        /*
                this.$.randomizeData.addEventListener('click', e => {
                    this.config.data.datasets.forEach(function(dataset) {
                        dataset.data = dataset.data.map(function() {
                            return randomScalingFactor();
                        });
        
                    });
        
                    window.myLine.update();
                });
        
                this.$.addDataset.addEventListener('click', e => {
                    var colorName = this.colorNames[this.config.data.datasets.length % colorNames.length];
                    var newColor = window.chartColors[colorName];
                    var newDataset = {
                        label: 'Dataset ' + this.config.data.datasets.length,
                        backgroundColor: newColor,
                        borderColor: newColor,
                        data: [],
                        fill: false
                    };
        
                    for (var index = 0; index < this.config.data.labels.length; ++index) {
                        newDataset.data.push(randomScalingFactor());
                    }
        
                    this.config.data.datasets.push(newDataset);
                    window.myLine.update();
                });
        
                this.$.addData.addEventListener('click', e => {
                    if (this.config.data.datasets.length > 0) {
                        var month = this.MONTHS[this.config.data.labels.length % this.MONTHS.length];
                        this.config.data.labels.push(month);
        
                        this.config.data.datasets.forEach(function(dataset) {
                            dataset.data.push(randomScalingFactor());
                        });
        
                        window.myLine.update();
                    }
                });
              
                this.$.removeDataset.addEventListener('click', e => {
                    this.config.data.datasets.splice(0, 1);
                    window.myLine.update();
                });
            
                this.$.removeData.addEventListener('click', e => {
                    this.config.data.labels.splice(-1, 1); // remove the label first
        
                    this.config.data.datasets.forEach(function(dataset) {
                        dataset.data.pop();
                    });
        
                    window.myLine.update();
                });
            */

        //Extracting last 10 year to display in dropdown

    }

    static get properties() {
        return {
            entityTypes: {
                type: Array,
                value: function () {
                    return [
                    ];
                },
                reflectToAttribute: true,
            },
            contextData: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onContextDataChange'
            },
            config: {
                type: Object,
                value: function () {
                    return {};
                }
            },
            MONTHS: {
                type: Array,
                value: function () {
                    return [
                    ];
                },
                reflectToAttribute: true,
            },
            YEARS: {
                type: Array,
                value: function () {
                    return [
                    ];
                },
                reflectToAttribute: true,
            },
            QUARTER: {
                type: Array,
                value: function () {
                    return [
                        "Q1", "Q2", "Q3", "Q4"
                    ];
                },
                reflectToAttribute: true,
            },
            colorNames: {
                type: Array,
                value: function () {
                    return [
                    ];
                },
                reflectToAttribute: true,
            },
            items: {
                type: Array,
                reflectToAttribute: true,
                value: function () {
                    return [
                        {
                            id: "lastmonth",
                            title: "Last Month",
                            value: "Last Month",
                        },
                        {
                            id: "lastquarter",
                            title: "Last Quarter",
                            value: "Last Quarter",
                        },
                        {
                            id: "lastyear",
                            title: "Last Year",
                            value: "Last Year",
                        }
                    ];
                }
            }
        }
    }

    async connectedCallback() {
        super.connectedCallback();
        let configResponse = await ConfigurationManager.getConfig('plugin-entity-creation-chart', this.contextData);
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
customElements.define(PluginEntityCreationChart.is, PluginEntityCreationChart);
