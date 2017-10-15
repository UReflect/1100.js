import {Type} from './type.js';
import {Draggable} from './draggable.js';
import {Resizable} from './resizable.js';

class MC {

  // MC constructor
  constructor(identifier='.widget', options={}) {
    // Identifiers
    this._identifier = identifier;
    this._container = '';
    // MC options
    this._options = options;
    // Type class
    this._type = new Type();
    // Mouvement objects
    this._draggable = null;
    this._resizable = null;

    this.setupMCOptions(options);
  }

  setupMCOptions(options) {

    if (Object.keys(options).includes('container')) this._container = options.container;

    // if (!Object.keys(options).includes('draggable') || (Object.keys(options).includes('draggable') && options.draggable == true)) {
    //   $(this._container).sortable({
    //     grid: [ $(window).width() / 10, $(window).height() / 10 ]
    //   });
    // }
    if (!Object.keys(options).includes('resizable') || (Object.keys(options).includes('resizable') && options.resizable == true)) this._resizable = new Resizable(this._identifier);
  }

  // Set listener on element
  on(event, func, useCapture=false) {
    if (this._type.isString(event)) {
      event = event.trim().split(/ /);
    }

    var elements = document.querySelectorAll(this._identifier);
    for (let value of event) {
      Array.prototype.forEach.call(elements, function(el, i){
        el.addEventListener(value, func);
      });
    }

    return this;
  }

  // Get identifier
  get identifier() {
    return this._identifier;
  }

  // Set identifier
  set identifier(new_id) {
    this._identifier = new_id;
    this._element = $(this._identifier);
  }
}

module.exports = MC;
