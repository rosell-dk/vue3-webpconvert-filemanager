import { createApp } from 'vue'
import WCFM from './WCFM.vue'
import './index.css'
import './tables.css'
import 'v-tooltip/dist/v-tooltip.css'
import VTooltip from 'v-tooltip'

// npm i -S v-tooltip@next    (tries to install 3.0.0-alpha.21, but cannot resolve dependency: vue@"^2.6.10")
// npm i -S v-tooltip@vue3    (installs 4.0.0-alpha.1)
// npm uninstall v-tooltip

// Cannot get v-tooltip to work. But it is also in alpha for Vue 3...
// https://github.com/Akryum/v-tooltip/issues/545
// https://github.com/Akryum/v-tooltip/discussions/603
//import Vue from 'vue'
//import VTooltip from 'v-tooltip'
//Vue.use(VTooltip)

const wcfm = createApp(WCFM);
wcfm.use(VTooltip);


if (!window["wcfmoptions"]) {
  window["wcfmoptions"] = {}
  window["wcfmoptions"]['poster'] = function(command, options, successCallback, errorCallback) {
    switch (command) {
      case 'get-tree':
        var response = {
          name: 'root',
          isDir: true,
          isOpen: true,
          children: [
            {name:'folder', isDir:true, children: [
                {name:'file', isDir:false},
                {name:'subfolder', isDir:true, children: [
                  {name:'file', isDir:false},
                ]},
                {name:'file', isDir:false}
              ]
              },
              {name:'file', isDir:false, isConverted: true},
              {name:'file2', isDir:false, isConverted: false}
            ]
        };
        break;
      case 'conversion-settings':
        var response = {
          converters: [
            {id: 'cwebp', name: 'cwebp'}, // TODO: Accept option definitions!
            {id: 'vips', name: 'vips'},
            {id: 'ewww', name: 'ewww'},
            {id: 'gd', name: 'gd'},
          ],
          options: [
            {
              "id": "converter",
              "type": "string",
              "default": 'cwebp',
              "ui": {
                "component": "select",
                "label": "Converter",
                "options": ['cwebp', 'ewww'],
                "optionLabels": {
                  'cwebp': 'cwebp',
                  'ewww': 'ewww',
                }
              },
            },
            /*
            {
              "id": "metadata",
              "type": "string",
              "default": 'exif',
              "ui": {
                "component": "multi-select",
                "label": "Metadata",
                "options": ['all', 'none', 'exif', 'icc', 'xmp'],
                "optionLabels": {
                  'all': 'All',
                  'none': 'None',
                  'exif': 'Exif',
                  'icc': 'ICC',
                  'xmp': 'XMP'
                }
              },
            },
            {
              "id": "encoding",
              "type": "string",
              "default": 'auto',
              "ui": {
                "component": "select",
                "label": "Encoding",
                "options": ['auto', 'lossy', 'lossless'],
                "optionLabels": {
                  'auto': 'Auto',
                  'lossy': 'Lossy',
                  'lossless': 'Lossless'
                }
              },
            },
            {
              "id": "quality",
              "type": "int",
              "default": 85,
              "min": 0,
              "max": 100,
              "ui": {
                "component": "input",
                "label": "Quality (lossy)",
                "default": {
                  'function': 'if-else',
                  'args': [
                    {
                      'function': 'equals',
                      'args': [
                        {
                          'function': 'state',
                          'args': ['imageType']
                        },
                        'png'
                      ]
                    },
                    90,
                    95
                  ]
                }
              },
            },
            {
              "id": "try-supplied-binary-for-os",
              "type": "boolean",
              "default": false,
              "ui": {
                "component": "checkbox",
                "label": "Try supplied binary for OS",
                "help-text": "help me!",
                "display": {
                  'function': 'inArray',
                  'args': [
                    {
                      'function': 'state',
                      'args': ['option', 'converter']
                    },
                    ['cwebp']
                  ]
                },
              },
            },
            {
              "id": "skip-these-precompiled-binaries",
              "type": "string",
              "default": "",
              "ui": {
                "component": "input",
                "label": "Skip these precompiled binaries",
                "display": {
                  'function': 'and',
                  'args': [
                    {
                      'function': 'inArray',
                      'args': [
                        {
                          'function': 'state',
                          'args': ['option', 'converter']
                        },
                        ['cwebp']
                      ]
                    },
                    {
                      'function': 'equals',
                      'args': [
                        {
                          'function': 'state',
                          'args': ['option', 'try-supplied-binary-for-os']
                        },
                        true
                      ]
                    }
                  ],
                },
              },
            },*/
            {
              "id": "encoding",
              "type": "string",
              "allowed-value-types": [
                  "string"
              ],
              "default": "auto",
              "ui": {
                  "component": "select",
                  "label": "Encoding",
                  "options": [
                      "auto",
                      "lossy",
                      "lossless"
                  ],
                  "optionLabels": {
                      "auto": "Auto",
                      "lossy": "Lossy",
                      "lossless": "Lossless"
                  },
                  "help-text": "Set encoding for the webp. If you choose \"auto\", webp-convert will convert to both lossy and lossless and pick the smallest result"
              },
              "sensitive": false,
              "options": [
                  "lossy",
                  "lossless",
                  "auto"
              ]
          },
          {
              "id": "quality",
              "type": "int",
              "allowed-value-types": [
                  "int",
                  "string"
              ],
              "default": 85,
              "ui": {
                  "component": "input",
                  "label": "Quality (Lossy)",
                  "help-text": "Quality for lossy encoding. ",
                  "display": {
                      "function": "notEquals",
                      "args": [
                          {
                              "function": "state",
                              "args": [
                                  "option",
                                  "encoding"
                              ]
                          },
                          "lossless"
                      ]
                  }
              }
          },
          {
              "id": "auto-limit",
              "type": "boolean",
              "allowed-value-types": [
                  "boolean"
              ],
              "default": true,
              "ui": {
                  "component": "checkbox",
                  "label": "Auto-limit",
                  "help-text": "Enable this option to prevent an unnecessarily high quality setting for low quality jpegs. You really should enable this. Read more about the feature [here](https:\/\/github.com\/rosell-dk\/webp-convert\/blob\/master\/docs\/v2.0\/converting\/introduction-for-converting.md#preventing-unnecessarily-high-quality-setting-for-low-quality-jpegs).",
                  "display": {
                      "function": "notEquals",
                      "args": [
                          {
                              "function": "state",
                              "args": [
                                  "option",
                                  "encoding"
                              ]
                          },
                          "lossless"
                      ]
                  }
              }
          },
          {
              "id": "alpha-quality",
              "type": "int",
              "allowed-value-types": [
                  "int"
              ],
              "default": 85,
              "ui": {
                  "component": "input",
                  "label": "Alpha quality",
                  "help-text": "Quality of alpha channel. Often, there is no need for high quality transparency layer and in some cases you can tweak this all the way down to 10 and save a lot in file size. The option only has effect with lossy encoding, and of course only on images with transparency. Read more [here](https:\/\/github.com\/rosell-dk\/webp-convert\/blob\/master\/docs\/v2.0\/converting\/introduction-for-converting.md#alpha-quality)",
                  "display": {
                      "function": "and",
                      "args": [
                          {
                              "function": "notEquals",
                              "args": [
                                  {
                                      "function": "state",
                                      "args": [
                                          "option",
                                          "encoding"
                                      ]
                                  },
                                  "lossless"
                              ]
                          },
                          {
                              "function": "notEquals",
                              "args": [
                                  {
                                      "function": "state",
                                      "args": [
                                          "imageType"
                                      ]
                                  },
                                  "jpeg"
                              ]
                          }
                      ]
                  }
              },
              "min": 0,
              "max": 100
          },
          {
              "id": "near-lossless",
              "type": "int",
              "allowed-value-types": [
                  "int"
              ],
              "default": 60,
              "ui": {
                  "component": "input",
                  "label": "\"Near lossless\" quality",
                  "help-text": "This option allows you to get impressively better compression for lossless encoding, with minimal impact on visual quality. The range is 0 (no preprocessing) to 100 (maximum preprocessing). Read more [here](https:\/\/github.com\/rosell-dk\/webp-convert\/blob\/master\/docs\/v2.0\/converting\/introduction-for-converting.md#near-lossless).",
                  "display": {
                      "function": "notEquals",
                      "args": [
                          {
                              "function": "state",
                              "args": [
                                  "option",
                                  "encoding"
                              ]
                          },
                          "lossy"
                      ]
                  }
              },
              "min": 0,
              "max": 100
          },
          {
              "id": "metadata",
              "type": "metadata",
              "allowed-value-types": [
                  "string"
              ],
              "default": "none",
              "ui": {
                  "component": "multi-select",
                  "label": "Metadata",
                  "help-text": "Determines which metadata that should be copied over to the webp. Setting it to \"all\" preserves all metadata, setting it to \"none\" strips all metadata. *cwebp* can take a comma-separated list of which kinds of metadata that should be copied (ie \"exif,icc\"). *gd* will always remove all metadata and *ffmpeg* will always keep all metadata. The rest can either strip all or keep all (they will keep all, unless the option is set to *none*)",
                  "options": [
                      "all",
                      "none",
                      "exif",
                      "icc",
                      "xmp"
                  ],
                  "optionLabels": {
                      "all": "All",
                      "none": "None",
                      "exif": "Exif",
                      "icc": "ICC",
                      "xmp": "XMP"
                  }
              },
              "sensitive": false,
              "options": null
          },
          {
              "id": "method",
              "type": "int",
              "allowed-value-types": [
                  "int"
              ],
              "default": 6,
              "ui": {
                  "component": "input",
                  "label": "Reduction effort (0-6)",
                  "help-text": "Controls the trade off between encoding speed and the compressed file size and quality. Possible values range from 0 to 6. 0 is fastest. 6 results in best quality and compression. PS: The option corresponds to the \"method\" option in libwebp"
              },
              "min": 0,
              "max": 6
          },
          {
              "id": "sharp-yuv",
              "type": "boolean",
              "allowed-value-types": [
                  "boolean"
              ],
              "default": true,
              "ui": {
                  "component": "checkbox",
                  "label": "Sharp YUV",
                  "help-text": "Better RGB->YUV color conversion (sharper and more accurate) at the expense of a little extra conversion time. Read more [here](https:\/\/www.ctrl.blog\/entry\/webp-sharp-yuv.html)."
              }
          },
          {
              "id": "auto-filter",
              "type": "boolean",
              "allowed-value-types": [
                  "boolean"
              ],
              "default": false,
              "ui": {
                  "component": "checkbox",
                  "label": "Auto-filter",
                  "help-text": "Turns auto-filter on. This algorithm will spend additional time optimizing the filtering strength to reach a well-balanced quality. Unfortunately, it is extremely expensive in terms of computation. It takes about 5-10 times longer to do a conversion. A 1MB picture which perhaps typically takes about 2 seconds to convert, will takes about 15 seconds to convert with auto-filter. "
              }
          },
          {
                      "id": "low-memory",
                      "type": "boolean",
                      "allowed-value-types": [
                          "boolean"
                      ],
                      "default": false,
                      "ui": {
                          "component": "checkbox",
                          "label": "Low memory",
                          "help-text": "Reduce memory usage of lossy encoding at the cost of ~30% longer encoding time and marginally larger output size. Only effective when the *method* option is 3 or more. Read more in [the docs](https:\/\/developers.google.com\/speed\/webp\/docs\/cwebp)",
                          "display": {
                              "function": "and",
                              "args": [
                                  {
                                      "function": "notEquals",
                                      "args": [
                                          {
                                              "function": "state",
                                              "args": [
                                                  "option",
                                                  "encoding"
                                              ]
                                          },
                                          "lossless"
                                      ]
                                  },
                                  {
                                      "function": "gt",
                                      "args": [
                                          {
                                              "function": "state",
                                              "args": [
                                                  "option",
                                                  "method"
                                              ]
                                          },
                                          2
                                      ]
                                  }
                              ]
                          }
                      }
                  },
          {
            "id": "preset",
            "type": "string",
            "allowed-value-types": [
                "string"
            ],
            "default": "none",
            "ui": {
                "component": "select",
                "label": "Preset",
                "options": [
                    "none",
                    "default",
                    "photo",
                    "picture",
                    "drawing",
                    "icon",
                    "text"
                ],
                "optionLabels": {
                    "none": "None",
                    "default": "Default",
                    "photo": "Photo",
                    "picture": "Picture",
                    "drawing": "Drawing",
                    "icon": "Icon",
                    "text": "Text"
                },
                "help-text": "Using a preset will set many of the other options to suit a particular type of source material. It even overrides them. It does however not override the quality option. \"none\" means that no preset will be set"
            },
            "sensitive": false,
            "options": [
                "none",
                "default",
                "photo",
                "picture",
                "drawing",
                "icon",
                "text"
            ]
        },

          ],
          supportedStandardOptions: {
            encoding: ['cwebp', 'vips', 'imagick', 'gmagick', 'imagemagick', 'graphicsmagick', 'ffmpeg', 'wpc'],
            method: ['cwebp', 'imagick', 'gmagick', 'imagemagick', 'graphicsmagick', 'ffmpeg', 'wpc'],
            nearLossless: ['cwebp', 'vips', 'wpc']
          },
          overrideDefaults: {
            converter: 'cwebp',
            //encoding: 'lossless',
            //method: 3,
          },
          systemStatus: {
            converterRequirements: {
              gd: {
                extensionLoaded: false,
                compiledWithWebP: true,
              }
            }

          }

        }
        break;
        case 'info':
          var response = {
            original: {
              name: 'file.png',
              size: 100,
              url: '',
            },
            converted: {
              name: 'file.png.webp',
              size: 70,
              url: ''
            },
            log: 'blah blah blah'
          }
          break;
        default:
          var response = 'ok';
          break;
    }
    successCallback(response);

  }
}

/*

if (window['wcfmoptions']) {
  wcfm.config.globalProperties['globalOptions'] = window.wcfmoptions;
}
*/
wcfm.mount('#webpconvert-filemanager');
//window.wcfileman = wcfm;
