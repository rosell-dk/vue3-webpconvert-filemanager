<template>
  <div class="wcfm">
    <SVGs />
    <multipane class="mainpanel" layout="vertical">
      <div class="pane" style="width:48%">
        <FileTree :item="item" />
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ flexGrow: 1 }">
        {{ data }}
        <AutoUI :ui="ui" :schema="schema" :modelValue="data"/>
        <!--<ConvertOptions />
        <hr/>
        <InfoPane :info="selectedInfo"/>-->
      </div>
    </multipane>
  </div>
</template>
<!--
<splitpanes style="height: 400px">
  <pane min-size="20">1</pane>
  <pane>
    <splitpanes horizontal>
      <pane>2</pane>
      <pane>3</pane>
    </splitpanes>
  </pane>
  <pane>5</pane>
</splitpanes>-->


<script>
import Poster from './classes/Poster.js'

import SVGs from './components/SVGs.vue'
import ConvertOptions from './components/ConvertOptions.vue'
import FileTree from './components/FileTree.vue'
import InfoPane from './components/InfoPane.vue'

import Multipane from './components/standard/multipane.vue';
import MultipaneResizer from './components/standard/multipane-resizer.vue';
import AutoUI from './autoui/AutoUI.vue';

import JsExpression from '@rosell/js-expression'
//import Pane from './components/pane.vue';
//import Splitpanes from './components/splitpanes.vue';


export default {
  name: 'WCFM',
  components: {
    SVGs,
    ConvertOptions,
    FileTree,
    InfoPane,
    Multipane, MultipaneResizer,
    AutoUI
    //Splitpanes, Pane
  },
  methods: {
    onConvertClick(path) {
      alert(path);
    },
    displayInfo(path) { // called from FileItem.vue
      var me = this;
      Poster.post('info', {path: path}, function(response) {
        me.selectedInfo = response;
      });
    }
  },
  mounted() {
    var me = this;
    Poster.post('conversion-settings', {folder: ''}, function(response) {
      //me.item = response;
      // TODO: Loading animation
      //console.log('r:', response);

      let components = [];
      let schemaProperties = {};
      let defaults = {}
      for (var i=0; i<response.options.length; i++) {
        let option = response.options[i];
        if (option.ui) {
          let componentUi = option.ui;
          componentUi['data-property'] = option.id;
          components.push(componentUi);
        }
        if (option.schema) {
          let componentUi = option.schema;
          schemaProperties[option.id] = option.schema;
          components.push(componentUi);
          if (option.schema.default) {
            defaults[option.id] = option.schema.default;
          }
        }
      }

//console.log('options', me.options);
      me.ui = {
        'component': 'group',
        'title': 'Options',
        'sub-components': components
      }

      me.schema = {
        "title": 'Options',
        "type": ['object'],
        "properties": schemaProperties
      }

      me.data = defaults;

      let globalContext = {
        option: me.data,
        imageType: 'any'
      };
      console.log('globalContext', globalContext);
      JsExpression.setGlobalContext(globalContext);

      /*me.ui = {
        'component': 'slider',
        'data-property': 'quality',
      }*/

      //me.data.quality = 77;
      //me.data.quality = 79;
      /*
      for (var i=0; i<options.length; i++) {
        var option = options[i];
        me.optionValues[option.id] = option.schema.default;
      }*/
    });

    Poster.post('get-tree', {folder: ''}, function(response) {
      me.item = response;
    });
  },
  data() {
    return {
      selectedPath: null,
      selectedItem: null,
      item: {},
      selectedInfo: {},
      ui: {},
      schema: {},
      data: {
        quality: 40,
        'alpha-quality': 65,
        'auto-limit': true,
        "command-line-options": 'dyt',
        'skip-these-precompiled-binaries': ''
      }
    }
  },
  provide() {
    return {
      wcfm: this
    }
  }
}
</script>

<style>
/*
  body, html {
    height: 100%;
    margin: 0;
    padding: 0;
  }*/
  .mainpanel, #webpconvert-filemanager {
    height: 100%;
  }
  .mainpanel {
    min-height: 400px;
  }
  /*
  #webpconvert-filemanager {
    padding: 20px;
  }*/
  .wcfm, input {
    font-family: 'Avenir',Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #222;
    font-size: 14px;
  }

  input {
    padding: 5px 8px;
    border-color: #333;
    border-width: 1px;
    box-sizing: border-box;
  }

  /* vue-multiselect tweaks */
  div .multiselect {
    min-height: 30px;
  }
  div .multiselect__select {
    height: 30px;
    line-height: 16px;
    width: 30px;
  }
  div .multiselect__select::before {
    border-top-color: #000;
    border-width: 6px 6px 0 6px;
  }
  div .multiselect__single {
    margin-bottom: 3px;
  }

  div .multiselect__tags {
    border-color: #333;
    border-radius: 0;
    padding: 5px 40px 0 5px;
    min-height: 30px;
  }
  li.multiselect__element {
    margin-left: 0px;
  }
  /*
  div .multiselect__option--selected.multiselect__option--highlight,
  div .multiselect__option--selected.multiselect__option--highlight:after {
    background: #41b883;
  }*/
  div .multiselect__tag {
    margin-bottom: 0;
    padding-bottom: 3px;
    padding-top: 3px;
  }
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
