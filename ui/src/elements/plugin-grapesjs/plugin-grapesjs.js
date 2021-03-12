import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

// ui-platform-utils
import { ObjectUtils } from '@riversandtechnologies/ui-platform-utils/lib/common/ObjectUtils.js';

// ui-platform-elements
import '@riversandtechnologies/ui-platform-elements/lib/elements/pebble-textbox/pebble-textbox.js';

// ui-platform-dataaccess
import { ConfigurationManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/ConfigurationManager.js';
import { DataObjectManager } from '@riversandtechnologies/ui-platform-dataaccess/lib/managers/DataObjectManager.js'

import './JS/grapes.min.js';

// Include Styles
import styles from './plugin-grapesjs.polymer.css.js';
//import {customstyles} from './fontawesome-css.js';

import sharedStyles from '@riversandtechnologies/ui-platform-elements/lib/flow/styles/flow.polymer.css.js';
/*                

Notes: in .scss , 
the grapesjs.min.css is copied with below modifications
added "" in background-image url() format

@face-font - updatd fonts path to start from root folder 
src: url("./fonts/main-fonts.eot?v=20");

*/

class PluginGrapesjs extends PolymerElement {
  static get is() {
    return 'plugin-grapesjs';
  }

  static get template() {
    return html`
            ${sharedStyles} ${styles}       
            <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.css"/>
            <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/v4-shims.min.css"/>
            
            <style>
          .fa-eye:before {
            content: "\f06e";
         }
          .fa-trash-o:before {
            content: "\\f1f8"
            }
             
            .fa-trash:before {
                content: "\\f1f8"
            }
            .fa-square-o:before {
              content: "\f096";
            }
            .fa-arrows-alt:before {
              content: "\f0b2";
            }
            .fa-arrows:before {
            content: "\f047";
             }
            </style>
            <div id="grapesjselement">
            {{htmlcode}}
             </div>

             <div id="blocks"></div>
            `;
  }

  static get properties() {
    return {

      message: {
        type: String,
        value: ''
      },
      contextData: {
        type: Object,
        value: function () {
          return {};
        },
        observer: '_onContextDataChange'
      },
      htmlcode: {
        type: String
        //value:'<h1 class="welcome">Welcome to Content Editor</h1>'
      },
      contentAttrShortname:{
        type:String,
        reflectToAttribute:true
      }
    };
  }
  _getEntityId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const entityid = urlParams.get('id');
    return entityid;
  }
  _getEntityType() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const entitytype = urlParams.get('type');
    return entitytype;
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

  async _getHtml() {
    let id = this._getEntityId();
    let entitytype=this._getEntityType();
    let requestData = {
      params: {
        query: {
          id: id,
          valueContexts: [
            {
              source: 'internal',
              locale: 'en-US'
            }
          ],
          filters: {
            typesCriterion: [entitytype]
          }
        },
        fields: {
          attributes: [this.contentAttrShortname]
        }
      }
    };
    let configResponse = await this._sendRequestToGetDetail(requestData);
    let rs="";
    try {
      rs=configResponse.response.content.entities[0].data.attributes.thghtmlcontent.values[0].value;
    }
    catch(error) {
      console.error(error);
    }
    finally{
      return rs;
    }
  }

  async _updateHtml(html) {
    console.log(html)
    let id = this._getEntityId();
    let entityType=this._getEntityType();
    let requestData = {
      "entity": {
        "id": id,

        "type": entityType,
        "data": {

          "attributes": {
            [this.contentAttrShortname]: {
              "values": [
                {
                  "source": "internal",
                  "locale": "en-US",
                  "value": html
                }
              ]
            }
          }

        }
      }
    }

    let options = {
      "dataIndex": "entityData",
      "validateRequest": false
    };
    if (html != "") {
      let res = await DataObjectManager.rest('/data/pass-through/entityservice/update',
        requestData,
        undefined,
        options
      );
      if(res.response.status=="success")
      {
        alert("Template Saved successfully");
      }
    }
    
    // let entityUpdateResponse = await DataObjectManager.initiateRequest(entityCreateRequest);

    // console.log(entityUpdateResponse);
  }
  ready() {
    super.ready();

  }
  load_editor() {

    //To add style on load
    /*
    canvas: {
        styles: [
          './CSS/grapes.min.css'
        ]
      },*/

    let gjs = this.shadowRoot.querySelector("#grapesjselement");
    let blocksele = this.shadowRoot.querySelector("#blocks");
    let currentinstance=this;
    const editor = grapesjs.init({
      container: gjs,

      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      components:currentinstance.htmlcode,
     // fromElement: true,
      // Size of the editor
      height: '100%',
      width: 'auto',
      storageManager: { autoload: 0 },
      styleManager: {
        sectors: [{
          name: 'General',
          open: false,
          buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
        }, {
          name: 'Flex',
          open: false,
          buildProps: ['flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'order', 'flex-basis', 'flex-grow', 'flex-shrink', 'align-self']
        }, {
          name: 'Dimension',
          open: false,
          buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
        }, {
          name: 'Typography',
          open: false,
          buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-shadow'],
        }, {
          name: 'Decorations',
          open: false,
          buildProps: ['border-radius-c', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
        }, {
          name: 'Extra',
          open: false,
          buildProps: ['transition', 'perspective', 'transform'],
        }
        ],
      },
      blockManager: {
        //appendTo: blocksele, - use this to display all blocks at bottom initially
        blocks: [

          {
            id: 'bannerimgleft', // id is mandatory
            label: '<div style="border:grey 1px solid"><h4>Title</h4><div style="display:flex;"> <img  height="30px" width="30px" src="data:image/png;base64,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"></img><div>Banner Description</div></div></div>', // You can use HTML/SVG inside labels
            attributes: { class: 'gjs-block-banner' },
            content: `<section>
                      <h1>This is a simple Banner</h1>
                      <div style="display:flex;">
                      <img src=""></img>
                      <div>Description is the pattern of narrative development that aims to make vivid a place, object, character, or group. Description is one of four rhetorical modes, along with exposition, argumentation, and narration. In practice it would be difficult to write literature that drew on just one of the four basic modes</div>
                      </div>
                    </section>`,
          },
          {
            id: 'bannerimgright', // id is mandatory
            label: '<div style="border:grey 1px solid"><h4>Title</h4><div style="display:flex;"><div>Banner Description</div> <img  height="30px" width="30px" src="data:image/png;base64,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"></img></div></div>', // You can use HTML/SVG inside labels
            attributes: { class: 'gjs-block-banner' },
            content: `<section>
                      <h1>This is a simple Banner</h1>
                      <div style="display:flex;">
                      <div>Description is the pattern of narrative development that aims to make vivid a place, object, character, or group. Description is one of four rhetorical modes, along with exposition, argumentation, and narration. In practice it would be difficult to write literature that drew on just one of the four basic modes</div>
                      <img src=""></img>
                      </div>
                    </section>`,
          },
          {
            id: 'bannerimgcenter', // id is mandatory
            label: '<div style="border:grey 1px solid"><h4>Title</h4> <img style="display: block;margin-left: auto;margin-right: auto;"" height="30px" width="30px" src="data:image/png;base64,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"></img><div>Banner Description</div></div>', // You can use HTML/SVG inside labels
            attributes: { class: 'gjs-block-banner' },
            content: `<section>
                      <h1>This is a simple Banner</h1>                 
                      <img src="" style="display: block;
                      margin-left: auto;
                      margin-right: auto;"></img>
                      <div>Description is the pattern of narrative development that aims to make vivid a place, object, character, or group. Description is one of four rhetorical modes, along with exposition, argumentation, and narration. In practice it would be difficult to write literature that drew on just one of the four basic modes</div>
                     
                    </section>`,
          }
          , {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
          }, {
            id: 'image',
            label: 'Image',
            // Select the component once it's dropped
            select: true,
            // You can pass components as a JSON instead of a simple HTML string,
            // in this case we also use a defined component type `image`
            content: { type: 'image' },
            // This triggers `active` event on dropped components and the `image`
            // reacts by opening the AssetManager
            activate: true,
          }
        ]
      }
    });
  
    editor.Panels.addButton('options', [{
      id: 'save',
      className: 'fa fa-save',
      command: function command(editor, sender) {
        var body = editor.getHtml();
        var css = editor.getCss();
        let htmlsave = "<style>".concat(css, "</style>").concat(body);

        currentinstance._updateHtml(htmlsave);
      },
      attributes: {
        title: 'Save Template'
      }
    }]);
  }

  async connectedCallback() {
    super.connectedCallback();

    let configResponse = await ConfigurationManager.getConfig('plugin-grapesjs', this.contextData);

    if (
      ObjectUtils.isValidObjectPath(configResponse, 'response.status') &&
      configResponse.response.status == 'success'
    ) {
      this._handleConfigGetSuccess(configResponse);
      this.htmlcode = await this._getHtml();
      this.load_editor();
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

customElements.define(PluginGrapesjs.is, PluginGrapesjs);
